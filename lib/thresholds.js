// Eşikler yüzde (CPU/RAM) veya Celsius (sıcaklık) cinsindendir.
// Bu değerler ileride GSettings'e taşınıp kullanıcı tarafından
// ayarlanabilir hale getirilebilir — şimdilik makul varsayılanlar.
export const THRESHOLDS = {
    cpu: { warning: 70, critical: 85 },
    ram: { warning: 75, critical: 90 },
    temperature: { warning: 70, critical: 85 },
    gpuUsage: { warning: 80, critical: 95 },
    gpuTemperature: { warning: 80, critical: 90 },
};

/**
 * Bir metrik değerinin önem derecesini döner.
 * @param {'cpu'|'ram'|'temperature'} kind
 * @param {number|null} value
 * @returns {'normal'|'warning'|'critical'}
 */
export function severityFor(kind, value) {
    if (value == null)
        return 'normal';

    const t = THRESHOLDS[kind];
    if (!t)
        return 'normal';

    if (value >= t.critical)
        return 'critical';
    if (value >= t.warning)
        return 'warning';
    return 'normal';
}

/** Önem derecesine karşılık gelen rengi döner (GNOME'un standart uyarı/hata renkleri) */
export function colorForSeverity(severity) {
    switch (severity) {
        case 'critical':
            return '#e01b24'; // GNOME error red
        case 'warning':
            return '#e5a50a'; // GNOME warning amber
        default:
            return null; // null = varsayılan tema rengini kullan (inline stil uygulama)
    }
}
