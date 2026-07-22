import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

const DRM_BASE = '/sys/class/drm';
const HWMON_BASE = '/sys/class/hwmon';

// Sysfs üzerinden GPU bilgisi sunan açık kaynak sürücüler.
// NVIDIA'nın kapalı kaynak sürücüsü bu bilgiyi buradan sunmuyor —
// nvidia-smi gibi ayrı bir araç gerektiriyor, bu yüzden desteklenmiyor.
const GPU_HWMON_NAME_PATTERNS = [/amdgpu/i, /radeon/i, /nouveau/i];
const PREFERRED_TEMP_LABELS = [/edge/i, /gpu/i];

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

function isPlausibleTemp(celsius) {
    return celsius > 5 && celsius < 150;
}

/**
 * GPU paket/edge sıcaklığını Celsius olarak döner.
 * Bulunamazsa null döner — arayüz bunu "bu sistemde okunamıyor" olarak ele almalı.
 *
 * @returns {number|null}
 */
export function readGpuTemperature() {
    for (const name of listDirNames(HWMON_BASE)) {
        const hwmonPath = `${HWMON_BASE}/${name}`;
        const driverName = readFileSafe(`${hwmonPath}/name`);
        if (!driverName || !GPU_HWMON_NAME_PATTERNS.some(p => p.test(driverName.trim())))
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
            if (!isPlausibleTemp(celsius))
                continue;

            if (fallbackCelsius === null)
                fallbackCelsius = celsius;

            const label = readFileSafe(`${hwmonPath}/temp${i}_label`);
            if (label && PREFERRED_TEMP_LABELS.some(p => p.test(label)))
                return celsius; // "edge" etiketli genel paket sıcaklığı bulundu
        }

        if (fallbackCelsius !== null)
            return fallbackCelsius;
    }

    return null;
}

/**
 * GPU kullanım yüzdesini (0-100) döner. amdgpu sürücüsünün doğrudan kernel
 * üzerinden sunduğu gpu_busy_percent dosyasını okur — ek araç gerekmez.
 * Bulunamazsa null döner.
 *
 * @returns {number|null}
 */
export function readGpuUsagePercent() {
    for (const name of listDirNames(DRM_BASE)) {
        // Sadece "cardN" adlı gerçek GPU cihazlarını istiyoruz,
        // "cardN-DP-1" gibi bağlantı noktası girişlerini değil.
        if (!/^card\d+$/.test(name))
            continue;

        const busyText = readFileSafe(`${DRM_BASE}/${name}/device/gpu_busy_percent`);
        if (!busyText)
            continue;

        const percent = Number(busyText.trim());
        if (!Number.isNaN(percent))
            return Math.max(0, Math.min(100, percent));
    }

    return null;
}

let _nvidiaSmiChecked = false;
let _nvidiaSmiAvailable = false;

function isNvidiaSmiAvailable() {
    if (!_nvidiaSmiChecked) {
        _nvidiaSmiChecked = true;
        _nvidiaSmiAvailable = GLib.find_program_in_path('nvidia-smi') !== null;
    }
    return _nvidiaSmiAvailable;
}

/**
 * NVIDIA'nın kapalı kaynak sürücüsünde GPU sıcaklık/kullanım bilgisi sysfs
 * üzerinden sunulmuyor — bunun yerine resmi `nvidia-smi` aracını (sistemde
 * kuruluysa) asenkron olarak çalıştırıp sonucu callback ile döner. Ana
 * thread'i bloklamaz, GNOME Shell'de donma yaratmaz.
 *
 * `nvidia-smi` sistemde yoksa (Intel/AMD sistemler, ya da sürücü kurulu
 * değilse) callback'i hemen `null` ile çağırır.
 *
 * @param {(result: {temperature:number, usage:number}|null) => void} callback
 */
export function readNvidiaStatsAsync(callback) {
    if (!isNvidiaSmiAvailable()) {
        callback(null);
        return;
    }

    try {
        const proc = Gio.Subprocess.new(
            ['nvidia-smi', '--query-gpu=temperature.gpu,utilization.gpu', '--format=csv,noheader,nounits'],
            Gio.SubprocessFlags.STDOUT_PIPE);

        proc.communicate_utf8_async(null, null, (source, res) => {
            try {
                const [, stdout] = source.communicate_utf8_finish(res);
                // Birden fazla GPU varsa ilkinin satırını al
                const line = stdout.trim().split('\n')[0];
                const [tempText, usageText] = line.split(',').map(s => s.trim());
                const temperature = Number(tempText);
                const usage = Number(usageText);

                if (Number.isNaN(temperature) || Number.isNaN(usage)) {
                    callback(null);
                    return;
                }

                callback({ temperature, usage });
            } catch (e) {
                callback(null);
            }
        });
    } catch (e) {
        callback(null);
    }
}
