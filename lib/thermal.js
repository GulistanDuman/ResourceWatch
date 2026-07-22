import GLib from 'gi://GLib';

const THERMAL_BASE = '/sys/class/thermal';
const HWMON_BASE = '/sys/class/hwmon';

// Sırayla denenecek sensör tipi kalıpları — CPU paket sıcaklığını önceliklendiriyoruz.
// 'acpitz' bilerek burada YOK: birçok sistemde statik/hatalı değer verdiği biliniyor,
// bu yüzden thermal_zone fallback havuzundan da tamamen dışlanıyor (aşağıda bkz).
const PREFERRED_TYPE_PATTERNS = [
    /x86_pkg_temp/i,
    /coretemp/i,
    /cpu/i,
    /soc/i,
];

// hwmon altında CPU sıcaklığını veren sürücü isimleri (Intel / AMD)
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
 * /sys/class/hwmon altında coretemp (Intel) veya k10temp/zenpower (AMD)
 * sürücüsünü arar ve "Package"/"Tdie"/"Tctl" etiketli sensörü tercih eder
 * (tüm çekirdeklerin genel paket sıcaklığı, tek bir çekirdek değil).
 * Bulamazsa ilk bulduğu temp*_input'u fallback olarak kullanır.
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
                return celsius; // paket geneli sıcaklık bulundu, direkt bunu kullan
        }

        if (fallbackCelsius !== null)
            return fallbackCelsius;
    }

    return null;
}

/**
 * /sys/class/thermal altındaki thermal_zone dizinlerinin tümünü tarar.
 * Donanıma göre bulunamayabilir (VM'ler, bazı ARM sistemleri vb.) —
 * bu durumda boş dizi döner, hata fırlatmaz.
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

/** Gerçekçi olmayan sensör okumalarını (arızalı/alakasız sensörler) elemek için makul aralık */
function isPlausible(celsius) {
    return celsius > 5 && celsius < 150;
}

/**
 * En uygun CPU sıcaklığını Celsius olarak döner.
 * Hiçbir güvenilir CPU sensörü bulunamazsa null döner — çağıran taraf
 * bunu "bu sistemde okunamıyor" olarak ele almalı, hata değil.
 *
 * Öncelik sırası:
 * 1. /sys/class/hwmon üzerinden coretemp/k10temp — gerçek CPU paket
 *    sıcaklığının asıl, güvenilir kaynağı budur.
 * 2. /sys/class/thermal üzerinden CPU tipi eşleşen bir zone (acpitz HARİÇ —
 *    birçok sistemde statik/hatalı değer verdiği biliniyor).
 *
 * Bilerek "alakasız bir sensörü tahminen CPU diye göster" fallback'i
 * yok — örneğin sistemde sadece WiFi kartı sıcaklığı bulunabiliyorsa,
 * bunu yanlışlıkla CPU sıcaklığı diye etiketlemek yanıltıcı olur.
 * Gerçek bir CPU kaynağı yoksa dürüstçe null dönüp arayüzde
 * "bu sistemde okunamıyor" mesajını gösteriyoruz.
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
