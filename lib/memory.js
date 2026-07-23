import GLib from 'gi://GLib';


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
