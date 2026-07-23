import GLib from 'gi://GLib';


function readCpuTimes() {
    const [ok, contents] = GLib.file_get_contents('/proc/stat');
    if (!ok)
        return null;

    const text = new TextDecoder().decode(contents);
    const firstLine = text.split('\n')[0];
    const parts = firstLine.trim().split(/\s+/).slice(1).map(Number);

    if (parts.length < 4)
        return null;

    const [user, nice, system, idle, iowait = 0, irq = 0, softirq = 0, steal = 0] = parts;
    const idleTime = idle + iowait;
    const totalTime = user + nice + system + idle + iowait + irq + softirq + steal;

    return { idleTime, totalTime };
}

export class CpuUsageTracker {
    constructor() {
        this._prev = readCpuTimes();
    }

    
    poll() {
        const current = readCpuTimes();
        if (!current || !this._prev) {
            this._prev = current;
            return null;
        }

        const totalDelta = current.totalTime - this._prev.totalTime;
        const idleDelta = current.idleTime - this._prev.idleTime;

        this._prev = current;

        if (totalDelta <= 0)
            return null;

        const usage = (1 - idleDelta / totalDelta) * 100;
        return Math.max(0, Math.min(100, usage));
    }
}
