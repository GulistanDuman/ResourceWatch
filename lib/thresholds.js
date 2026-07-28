// Thresholds are in percentages (CPU/RAM) or Celsius (temperature).
// These values can be moved to GSettings later and made configurable 
// by the user — reasonable defaults for now.
export const THRESHOLDS = {
    cpu: { warning: 70, critical: 85 },
    ram: { warning: 75, critical: 90 },
    temperature: { warning: 70, critical: 85 },
    gpuUsage: { warning: 80, critical: 95 },
    gpuTemperature: { warning: 80, critical: 90 },
};

/**
 * Returns the severity level of a metric value.
 * @param {'cpu'|'ram'|'temperature'|'gpuUsage'|'gpuTemperature'} kind
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

/** Returns the color corresponding to the severity level (GNOME standard warning/error colors) */
export function colorForSeverity(severity) {
    switch (severity) {
        case 'critical':
            return '#e01b24'; // GNOME error red
        case 'warning':
            return '#e5a50a'; // GNOME warning amber
        default:
            return null; // null = use default theme color (do not apply inline style)
    }
}
