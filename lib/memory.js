import GLib from 'gi://GLib';

/**
 * /proc/meminfo'yu okuyup RAM kullanım yüzdesini ve ham değerleri döner.
 * MemAvailable, kernel tarafından hesaplanan "gerçekten kullanılabilir"
 * bellek miktarıdır — MemFree'den daha doğru bir metriktir çünkü
 * cache/buffer olarak tutulan ama geri kazanılabilir belleği de sayar.
 *
 * @returns {{percent: number, usedKb: number, totalKb: number}|null}
 */
export function readMemoryUsage() {
    const [ok, contents] = GLib.file_get_contents('/proc/meminfo');
    if (!ok)
        return null;

    const text = new TextDecoder().decode(contents);
    const values = {};

    for (const line of text.split('\n')) {
        const match = line.match(/^(\w+):\s+(\d+)\s*kB/);
        if (match)
            values[match[1]] = Number(match[2]);
    }

    const totalKb = values.MemTotal;
    const availableKb = values.MemAvailable;

    if (!totalKb || availableKb === undefined)
        return null;

    const usedKb = totalKb - availableKb;
    const percent = (usedKb / totalKb) * 100;

    return { percent, usedKb, totalKb };
}
