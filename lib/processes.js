import GLib from 'gi://GLib';

const CLK_TCK = 100; // Linux'ta neredeyse her zaman sabit (USER_HZ), /proc/[pid]/stat zaman birimi budur

/**
 * Process durumu harflerinin okunabilir karşılıkları.
 * D ve Z özellikle "dikkat edilmesi gereken" durumlar.
 */
export const PROCESS_STATE_LABELS = {
    R: 'Çalışıyor',
    S: 'Uykuda',
    D: 'Disk/IO bekliyor (takılmış olabilir)',
    Z: 'Zombie',
    T: 'Durduruldu',
    I: 'Boşta',
};

/** Panelde/menüde vurgulanacak "dikkat" durumları */
export const ATTENTION_STATES = new Set(['D', 'Z']);

function readFileSafe(path) {
    try {
        const [ok, contents] = GLib.file_get_contents(path);
        if (!ok)
            return null;
        return new TextDecoder().decode(contents);
    } catch (e) {
        return null;
    }
}

/**
 * Tek bir process için /proc/[pid]/stat dosyasını parse eder.
 * comm (process adı) parantez içinde ve boşluk/parantez içerebildiği için
 * son ')' karakterine göre bölmek gerekiyor — naif split(' ') kırılır.
 */
function parseStat(pid, statText) {
    const closeParen = statText.lastIndexOf(')');
    if (closeParen === -1)
        return null;

    const comm = statText.slice(statText.indexOf('(') + 1, closeParen);
    const rest = statText.slice(closeParen + 2).trim().split(/\s+/);

    // rest[0] = state, rest[11] = utime, rest[12] = stime (stat(5) man sayfasına göre,
    // state alanından itibaren sayıyoruz)
    const state = rest[0];
    const utime = Number(rest[11]);
    const stime = Number(rest[12]);

    if (Number.isNaN(utime) || Number.isNaN(stime))
        return null;

    return { pid, comm, state, cpuTicks: utime + stime };
}

/** /proc/[pid]/status içinden VmRSS (gerçek fiziksel bellek kullanımı) okur */
function readRssKb(pid) {
    const text = readFileSafe(`/proc/${pid}/status`);
    if (!text)
        return null;

    const match = text.match(/^VmRSS:\s+(\d+)\s*kB/m);
    return match ? Number(match[1]) : 0;
}

/**
 * Sistemdeki tüm process'leri tarar. I/O ağır bir işlem olduğu için
 * çağıran taraf bunu makul bir polling aralığında (process listesi için
 * CPU/RAM'den daha seyrek, örn. 5 sn) çağırmalı.
 *
 * @returns {Array<{pid:number, name:string, state:string, cpuTicks:number, rssKb:number}>}
 */
export function readAllProcesses() {
    const dir = GLib.Dir.open('/proc', 0);
    const results = [];
    let name;

    while ((name = dir.read_name()) !== null) {
        const pid = Number(name);
        if (!Number.isInteger(pid))
            continue;

        const statText = readFileSafe(`/proc/${pid}/stat`);
        if (!statText)
            continue;

        const parsed = parseStat(pid, statText);
        if (!parsed)
            continue;

        const rssKb = readRssKb(pid);
        if (rssKb === null)
            continue;

        results.push({
            pid,
            name: parsed.comm,
            state: parsed.state,
            cpuTicks: parsed.cpuTicks,
            rssKb,
        });
    }

    dir.close();
    return results;
}

/**
 * Process'lerin CPU zaman damgalarını (tick) takip edip iki okuma
 * arasındaki farktan anlık CPU yüzdesini hesaplayan durum tutucu.
 * Global CpuUsageTracker ile aynı mantık, ama process-bazlı.
 */
export class ProcessCpuTracker {
    constructor() {
        this._prevByPid = new Map();
        this._prevWallTime = GLib.get_monotonic_time();
    }

    /**
     * @param {Array} processes readAllProcesses() çıktısı
     * @returns aynı diziyi her elemana cpuPercent eklenmiş halde döner
     */
    annotate(processes) {
        const nowWallTime = GLib.get_monotonic_time();
        const elapsedSeconds = (nowWallTime - this._prevWallTime) / 1_000_000;
        this._prevWallTime = nowWallTime;

        const nextPrev = new Map();

        for (const proc of processes) {
            const prevTicks = this._prevByPid.get(proc.pid);
            nextPrev.set(proc.pid, proc.cpuTicks);

            if (prevTicks === undefined || elapsedSeconds <= 0) {
                proc.cpuPercent = null; // ilk görülüşünde henüz hesaplanamaz
                continue;
            }

            const deltaTicks = proc.cpuTicks - prevTicks;
            const deltaSeconds = deltaTicks / CLK_TCK;
            proc.cpuPercent = Math.max(0, (deltaSeconds / elapsedSeconds) * 100);
        }

        this._prevByPid = nextPrev;
        return processes;
    }
}

/** En çok RAM tüketen N process'i döner */
export function topByRam(processes, count = 5) {
    return [...processes]
        .sort((a, b) => b.rssKb - a.rssKb)
        .slice(0, count);
}

/** En çok CPU tüketen N process'i döner (null cpuPercent'liler en sona atılır) */
export function topByCpu(processes, count = 5) {
    return [...processes]
        .filter(p => p.cpuPercent !== null)
        .sort((a, b) => b.cpuPercent - a.cpuPercent)
        .slice(0, count);
}

/** D/Z durumundaki, yani "dikkat edilmesi gereken" process'leri döner */
export function attentionProcesses(processes) {
    return processes.filter(p => ATTENTION_STATES.has(p.state));
}
