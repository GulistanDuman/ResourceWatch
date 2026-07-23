import GLib from 'gi://GLib';

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


function readInterfaceBytes() {
    const text = readFileSafe('/proc/net/dev');
    if (!text)
        return null;

    let rxTotal = 0;
    let txTotal = 0;

    // İlk iki satır başlık, atlanıyor
    for (const line of text.split('\n').slice(2)) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;

        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1)
            continue;

        const iface = trimmed.slice(0, colonIndex).trim();
        if (iface === 'lo')
            continue; // loopback trafiği gerçek ağ kullanımı değil, hariç tutuluyor

        const fields = trimmed.slice(colonIndex + 1).trim().split(/\s+/).map(Number);
        const rxBytes = fields[0];
        const txBytes = fields[8];

        if (!Number.isNaN(rxBytes))
            rxTotal += rxBytes;
        if (!Number.isNaN(txBytes))
            txTotal += txBytes;
    }

    return { rxTotal, txTotal };
}

/**
 * İki ardışık okuma arasındaki farktan saniye başına indirme/yükleme
 * hızını hesaplayan durum tutucu sınıf. CpuUsageTracker ile aynı mantık.
 */
export class NetworkUsageTracker {
    constructor() {
        this._prev = readInterfaceBytes();
        this._prevTime = GLib.get_monotonic_time();
    }

    /**
     * @returns {{downBytesPerSec:number, upBytesPerSec:number}|null}
     */
    poll() {
        const current = readInterfaceBytes();
        const now = GLib.get_monotonic_time();
        const elapsedSeconds = (now - this._prevTime) / 1_000_000;
        this._prevTime = now;

        if (!current || !this._prev || elapsedSeconds <= 0) {
            this._prev = current;
            return null;
        }

        const downBytesPerSec = Math.max(0, (current.rxTotal - this._prev.rxTotal) / elapsedSeconds);
        const upBytesPerSec = Math.max(0, (current.txTotal - this._prev.txTotal) / elapsedSeconds);

        this._prev = current;

        return { downBytesPerSec, upBytesPerSec };
    }
}

/** Bayt/saniye değerini okunabilir bir birime çevirir (B/s, KB/s, MB/s) */
export function formatBytesPerSec(bytesPerSec) {
    if (bytesPerSec < 1024)
        return `${Math.round(bytesPerSec)} B/s`;
    if (bytesPerSec < 1024 * 1024)
        return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`;
}
