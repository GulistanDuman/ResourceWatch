import GLib from 'gi://GLib';

const THERMAL_BASE = '/sys/class/thermal';
const HWMON_BASE = '/sys/class/hwmon';

// Sensor type patterns to try in order — prioritizing CPU package temperature.
// 'acpitz' is intentionally NOT here: known to give static/erroneous values on many systems,
// so it is also completely excluded from the thermal_zone fallback pool (see below).
const PREFERRED_TYPE_PATTERNS = [
    /x86_pkg_temp/i,
    /coretemp/i,
    /cpu/i,
    /soc/i,
];

// Driver names under hwmon providing CPU temperature (Intel / AMD)
const CPU_HWMON_NAME_PATTERNS = [/coretemp/i, /k10temp/i, /zenpower/i];

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

function listDirNames(basePath) {
    let dir;
    try {
        dir = GLib.Dir.open(basePath, 0);
    } catch (e) {
        return [];
    }
    const names = [];
    let name;
    while ((name = dir.read_name()) !== null)
        names.push(name);
    dir.close();
    return names;
}

/**
 * Searches for coretemp (Intel) or k10temp/zenpower (AMD) driver
 * under /sys/class/hwmon and prefers the sensor labeled "Package"/"Tdie"/"Tctl"
 * (general package temperature of all cores, not just a single core).
 * If not found, uses the first temp*_input found as a fallback.
 */
function readHwmonCpuTemperature() {
    for (const name of listDirNames(HWMON_BASE)) {
        const hwmonPath = `${HWMON_BASE}/${name}`;
        const driverName = readFileSafe(`${hwmonPath}/name`);
        if (!driverName || !CPU_HWMON_NAME_PATTERNS.some(p => p.test(driverName.trim())))
            continue;

        let fallbackCelsius = null;

        for (let i = 1; i <= 8; i++) {
            const inputText = readFileSafe(`${hwmonPath}/temp${i}_input`);
            if (!inputText)
                continue;

            const milliC = Number(inputText.trim());
            if (Number.isNaN(milliC))
                continue;

            const celsius = milliC / 1000;
            if (fallbackCelsius === null)
                fallbackCelsius = celsius;

            const label = readFileSafe(`${hwmonPath}/temp${i}_label`);
            if (label && /package|tdie|tctl/i.test(label))
                return celsius; // package-wide temperature found, use it directly
        }

        if (fallbackCelsius !== null)
            return fallbackCelsius;
    }

    return null;
}

/**
 * Scans all thermal_zone directories under /sys/class/thermal.
 * Might not be found depending on hardware (VMs, some ARM systems, etc.) —
 * returns an empty array in this case, does not throw an error.
 */
export function listThermalZones() {
    let dir;
    try {
        dir = GLib.Dir.open(THERMAL_BASE, 0);
    } catch (e) {
        return [];
    }

    const zones = [];
    let name;
    while ((name = dir.read_name()) !== null) {
        if (!name.startsWith('thermal_zone'))
            continue;

        const tempText = readFileSafe(`${THERMAL_BASE}/${name}/temp`);
        if (!tempText)
            continue;

        const milliC = Number(tempText.trim());
        if (Number.isNaN(milliC))
            continue;

        const typeText = readFileSafe(`${THERMAL_BASE}/${name}/type`);
        zones.push({
            name,
            type: typeText ? typeText.trim() : '',
            celsius: milliC / 1000,
        });
    }
    dir.close();

    return zones;
}

/** Reasonable range to filter out unrealistic sensor readings (faulty/irrelevant sensors) */
function isPlausible(celsius) {
    return celsius > 5 && celsius < 150;
}

/**
 * Returns the most appropriate CPU temperature in Celsius.
 * Returns null if no reliable CPU sensor can be found — the calling side
 * should treat this as "cannot be read on this system", not an error.
 *
 * Priority order:
 * 1. coretemp/k10temp via /sys/class/hwmon — this is the actual, reliable
 *    source for true CPU package temperature.
 * 2. A zone with matching CPU type via /sys/class/thermal (EXCEPT acpitz —
 *    known to give static/erroneous values on many systems).
 *
 * Intentionally no fallback to "guess and show an unrelated sensor as CPU" —
 * for instance, if only the Wi-Fi card temperature is available on the system,
 * labeling it as CPU temperature by mistake would be misleading.
 * If there is no real CPU source, we honestly return null and display
 * "cannot be read on this system" message in the interface.
 *
 * @returns {number|null}
 */
export function readCpuTemperature() {
    const hwmonReading = readHwmonCpuTemperature();
    if (hwmonReading !== null && isPlausible(hwmonReading))
        return hwmonReading;

    const zones = listThermalZones().filter(
        z => isPlausible(z.celsius) && z.type.toLowerCase() !== 'acpitz');

    for (const pattern of PREFERRED_TYPE_PATTERNS) {
        const match = zones.find(z => pattern.test(z.type));
        if (match)
            return match.celsius;
    }

    return null;
}
