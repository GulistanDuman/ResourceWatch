import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import { CpuUsageTracker } from './lib/cpu.js';
import { readMemoryUsage } from './lib/memory.js';
import { readCpuTemperature } from './lib/thermal.js';
import { readAllProcesses, ProcessCpuTracker, topByRam, topByCpu, attentionProcesses, PROCESS_STATE_LABELS } from './lib/processes.js';
import { readGpuTemperature, readGpuUsagePercent, readNvidiaStatsAsync } from './lib/gpu.js';
import { NetworkUsageTracker, formatBytesPerSec } from './lib/network.js';
import { severityFor, colorForSeverity } from './lib/thresholds.js';

const PROCESS_POLL_INTERVAL_SECONDS = 5; // process taraması CPU/RAM'den daha pahalı, daha seyrek yapılır
const GPU_POLL_INTERVAL_SECONDS = 5; // nvidia-smi bir subprocess başlattığı için CPU/RAM'den daha seyrek
const PROCESS_LIST_LENGTH = 5;
const SPARKLINE_HISTORY_LENGTH = 30;
const SPARKLINE_WIDTH = 60;
const SPARKLINE_HEIGHT = 20;

/** '#rrggbb' formatındaki bir rengi Cairo'nun beklediği 0-1 aralığındaki [r,g,b] dizisine çevirir */
function hexToRgb01(hex) {
    const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!match)
        return [1, 1, 1];
    return [match[1], match[2], match[3]].map(v => parseInt(v, 16) / 255);
}

/** İki önem derecesinden daha "kötü" (dikkat gerektiren) olanı döner */
function worseSeverity(a, b) {
    const rank = { normal: 0, warning: 1, critical: 2 };
    return rank[a] >= rank[b] ? a : b;
}

const SysMonitorIndicator = GObject.registerClass(
class SysMonitorIndicator extends PanelMenu.Button {
    _init(settings, openPreferences) {
        super._init(0.0, 'Resource Watch');

        this._settings = settings;
        this._openPreferences = openPreferences;
        this._cpuTracker = new CpuUsageTracker();
        this._cpuHistory = [];
        this._processCpuTracker = new ProcessCpuTracker();
        this._networkTracker = new NetworkUsageTracker();

        // --- Panel content: sparkline + CPU% + RAM% + temperature ---
        this._box = new St.BoxLayout({
            style_class: 'resourcewatch-box',
            y_align: Clutter.ActorAlign.CENTER,
        });

        this._sparkline = new St.DrawingArea({
            style_class: 'resourcewatch-sparkline',
            width: SPARKLINE_WIDTH,
            height: SPARKLINE_HEIGHT,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._sparkline.connect('repaint', this._drawSparkline.bind(this));

        this._cpuLabel = new St.Label({
            text: '⚙ —',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'resourcewatch-label',
        });
        this._ramLabel = new St.Label({
            text: '▤ —',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'resourcewatch-label',
        });
        this._tempLabel = new St.Label({
            text: '🌡 —',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'resourcewatch-label',
        });
        this._gpuLabel = new St.Label({
            text: '🎮 —',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'resourcewatch-label',
        });
        this._networkLabel = new St.Label({
            text: '🌐 —',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'resourcewatch-label',
        });

        this._box.add_child(this._sparkline);
        this._box.add_child(this._cpuLabel);
        this._box.add_child(this._ramLabel);
        this._box.add_child(this._tempLabel);
        this._box.add_child(this._gpuLabel);
        this._box.add_child(this._networkLabel);
        this.add_child(this._box);

        // --- Dropdown menu ---
        this._cpuMenuItem = new PopupMenu.PopupMenuItem(_('CPU: —'), { reactive: false });
        this._ramMenuItem = new PopupMenu.PopupMenuItem(_('RAM: —'), { reactive: false });
        this._temperatureMenuItem = new PopupMenu.PopupMenuItem(_('CPU Temperature: —'), { reactive: false });
        this._gpuUsageMenuItem = new PopupMenu.PopupMenuItem(_('GPU Usage: —'), { reactive: false });
        this._gpuTempMenuItem = new PopupMenu.PopupMenuItem(_('GPU Temperature: —'), { reactive: false });
        this._networkDownMenuItem = new PopupMenu.PopupMenuItem(_('Network ↓: —'), { reactive: false });
        this._networkUpMenuItem = new PopupMenu.PopupMenuItem(_('Network ↑: —'), { reactive: false });
        this.menu.addMenuItem(this._cpuMenuItem);
        this.menu.addMenuItem(this._ramMenuItem);
        this.menu.addMenuItem(this._temperatureMenuItem);
        this.menu.addMenuItem(this._gpuUsageMenuItem);
        this.menu.addMenuItem(this._gpuTempMenuItem);
        this.menu.addMenuItem(this._networkDownMenuItem);
        this.menu.addMenuItem(this._networkUpMenuItem);
        // --- Process listesi bölümü: her öğe ayrı ayrı görünürlük dizisinde tutulur,
        // çünkü PopupMenuSection'ın kendisi bir aktör değildir, .visible atamak
        // hiçbir şeyi gizlemez — gerçek görünürlük alt öğelerde olmalı.
        this._processMenuItems = [];

        const addProcessItem = item => {
            this.menu.addMenuItem(item);
            this._processMenuItems.push(item);
            return item;
        };

        addProcessItem(new PopupMenu.PopupSeparatorMenuItem());

        // Dikkat gerektiren process'ler (D: disk bekliyor / Z: zombie)
        this._attentionHeader = addProcessItem(new PopupMenu.PopupMenuItem(
            _('⚠ No stuck or zombie processes'), { reactive: false }));

        addProcessItem(new PopupMenu.PopupSeparatorMenuItem());

        // En çok RAM tüketenler
        addProcessItem(new PopupMenu.PopupMenuItem(
            _('Top RAM-consuming processes'), { reactive: false, style_class: 'resourcewatch-section-title' }));
        this._ramProcessItems = [];
        for (let i = 0; i < PROCESS_LIST_LENGTH; i++) {
            const item = addProcessItem(new PopupMenu.PopupMenuItem('—', { reactive: false }));
            this._ramProcessItems.push(item);
        }

        addProcessItem(new PopupMenu.PopupSeparatorMenuItem());

        // En çok CPU tüketenler
        addProcessItem(new PopupMenu.PopupMenuItem(
            _('Top CPU-consuming processes'), { reactive: false, style_class: 'resourcewatch-section-title' }));
        this._cpuProcessItems = [];
        for (let i = 0; i < PROCESS_LIST_LENGTH; i++) {
            const item = addProcessItem(new PopupMenu.PopupMenuItem('—', { reactive: false }));
            this._cpuProcessItems.push(item);
        }

        // --- Settings button ---
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = new PopupMenu.PopupMenuItem(_('Settings…'));
        settingsItem.connect('activate', () => this._openPreferences());
        this.menu.addMenuItem(settingsItem);

        this._timeoutId = null;
        this._processTimeoutId = null;

        this._settingsChangedId = this._settings.connect('changed', this._onSettingsChanged.bind(this));
        this._applyDisplaySettings();
        this._startPolling();
    }

    _onSettingsChanged(_settings, key) {
        if (key === 'poll-interval') {
            this._stopPolling();
            this._startPolling();
        } else {
            this._applyDisplaySettings();
        }
    }

    _applyDisplaySettings() {
        this._showCpu = this._settings.get_boolean('show-cpu');
        this._showRam = this._settings.get_boolean('show-ram');
        this._showSparkline = this._settings.get_boolean('show-sparkline');
        this._showTemperature = this._settings.get_boolean('show-temperature');
        this._showProcessList = this._settings.get_boolean('show-process-list');
        this._showProcessPid = this._settings.get_boolean('show-process-pid');
        this._showGpu = this._settings.get_boolean('show-gpu');
        this._showNetwork = this._settings.get_boolean('show-network');

        this._sparkline.visible = this._showSparkline;
        this._cpuLabel.visible = this._showCpu;
        this._ramLabel.visible = this._showRam;
        this._tempLabel.visible = this._showTemperature;
        this._temperatureMenuItem.visible = this._showTemperature;
        this._gpuLabel.visible = this._showGpu;
        this._gpuUsageMenuItem.visible = this._showGpu;
        this._gpuTempMenuItem.visible = this._showGpu;
        this._networkLabel.visible = this._showNetwork;
        this._networkDownMenuItem.visible = this._showNetwork;
        this._networkUpMenuItem.visible = this._showNetwork;
        this._processMenuItems.forEach(item => { item.visible = this._showProcessList; });

        if (this._showProcessList) {
            this._ensureProcessPolling();
            this._pollProcesses(); // PID gösterimi gibi ayarlar değiştiğinde satırları hemen tazele
        } else {
            this._stopProcessPolling();
        }

        if (this._showGpu)
            this._ensureGpuPolling();
        else
            this._stopGpuPolling();

        this._refreshLabel();
    }

    _startPolling() {
        const pollSeconds = this._settings.get_int('poll-interval');

        this._poll();
        this._timeoutId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            pollSeconds,
            () => {
                this._poll();
                return GLib.SOURCE_CONTINUE;
            }
        );

        if (this._showProcessList)
            this._ensureProcessPolling();

        if (this._showGpu)
            this._ensureGpuPolling();
    }

    /** Process taramasını başlatır (zaten çalışıyorsa bir şey yapmaz) */
    _ensureProcessPolling() {
        if (this._processTimeoutId)
            return;

        this._pollProcesses();
        this._processTimeoutId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            PROCESS_POLL_INTERVAL_SECONDS,
            () => {
                this._pollProcesses();
                return GLib.SOURCE_CONTINUE;
            }
        );
    }

    _stopProcessPolling() {
        if (this._processTimeoutId) {
            GLib.source_remove(this._processTimeoutId);
            this._processTimeoutId = null;
        }
    }

    /** GPU okumasını başlatır (zaten çalışıyorsa bir şey yapmaz) */
    _ensureGpuPolling() {
        if (this._gpuTimeoutId)
            return;

        this._pollGpu();
        this._gpuTimeoutId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            GPU_POLL_INTERVAL_SECONDS,
            () => {
                this._pollGpu();
                return GLib.SOURCE_CONTINUE;
            }
        );
    }

    _stopGpuPolling() {
        if (this._gpuTimeoutId) {
            GLib.source_remove(this._gpuTimeoutId);
            this._gpuTimeoutId = null;
        }
    }

    _pollGpu() {
        // Önce sysfs (AMD/Radeon/Nouveau) — hızlı, senkron, ek işlem başlatmaz
        const sysfsUsage = readGpuUsagePercent();
        const sysfsTemp = readGpuTemperature();

        if (sysfsUsage !== null || sysfsTemp !== null) {
            this._gpuUsage = sysfsUsage;
            this._gpuTemperature = sysfsTemp;
            this._refreshLabel();
            return;
        }

        // sysfs'te bulunamadı (örn. NVIDIA kapalı kaynak sürücü) — nvidia-smi dene.
        // Aynı anda birden fazla sorgu çakışmasın diye basit bir kilit kullanıyoruz.
        if (this._gpuQueryInFlight)
            return;
        this._gpuQueryInFlight = true;

        readNvidiaStatsAsync(result => {
            this._gpuQueryInFlight = false;

            if (this._destroyed)
                return; // extension bu sırada kapatılmış olabilir, güvenlik kontrolü

            if (result) {
                this._gpuUsage = result.usage;
                this._gpuTemperature = result.temperature;
            } else {
                this._gpuUsage = null;
                this._gpuTemperature = null;
            }
            this._refreshLabel();
        });
    }

    _pollProcesses() {
        const processes = this._processCpuTracker.annotate(readAllProcesses());
        const pidSuffix = pid => this._showProcessPid ? `  (pid ${pid})` : '';

        const ramTop = topByRam(processes, PROCESS_LIST_LENGTH);
        ramTop.forEach((proc, i) => {
            const gb = (proc.rssKb / 1024 / 1024).toFixed(2);
            this._ramProcessItems[i].label.set_text(`${proc.name}  —  ${gb} GB${pidSuffix(proc.pid)}`);
        });

        const cpuTop = topByCpu(processes, PROCESS_LIST_LENGTH);
        cpuTop.forEach((proc, i) => {
            const pct = proc.cpuPercent.toFixed(1);
            this._cpuProcessItems[i].label.set_text(`${proc.name}  —  ${pct}%${pidSuffix(proc.pid)}`);
        });
        // Still on the first pass (cpuPercent not computed yet) — clear remaining slots
        for (let i = cpuTop.length; i < PROCESS_LIST_LENGTH; i++)
            this._cpuProcessItems[i].label.set_text('—');

        const attention = attentionProcesses(processes);
        if (attention.length === 0) {
            this._attentionHeader.label.set_text(_('⚠ No stuck or zombie processes'));
        } else {
            const summary = attention
                .slice(0, 3)
                .map(p => `${p.name} (${PROCESS_STATE_LABELS[p.state] ?? p.state}${this._showProcessPid ? `, pid ${p.pid}` : ''})`)
                .join(', ');
            this._attentionHeader.label.set_text(`${_('⚠ Attention:')} ${summary}`);
        }
    }

    _poll() {
        this._cpuPercent = this._cpuTracker.poll();
        this._memInfo = readMemoryUsage();
        this._temperature = this._showTemperature ? readCpuTemperature() : null;
        this._network = this._showNetwork ? this._networkTracker.poll() : null;

        this._refreshLabel();

        if (this._cpuPercent !== null) {
            this._cpuHistory.push(this._cpuPercent);
            if (this._cpuHistory.length > SPARKLINE_HISTORY_LENGTH)
                this._cpuHistory.shift();
            this._sparkline.queue_repaint();
        }
    }

    _refreshLabel() {
        const cpuText = this._cpuPercent != null ? `${Math.round(this._cpuPercent)}%` : '—';
        const ramText = this._memInfo != null ? `${Math.round(this._memInfo.percent)}%` : '—';
        const tempText = this._temperature != null ? `${Math.round(this._temperature)}°C` : '—';

        this._cpuLabel.set_text(`⚙ ${cpuText}`);
        this._applySeverityColor(this._cpuLabel, severityFor('cpu', this._cpuPercent));

        this._ramLabel.set_text(`▤ ${ramText}`);
        this._applySeverityColor(this._ramLabel, severityFor('ram', this._memInfo?.percent ?? null));

        this._tempLabel.set_text(`🌡 ${tempText}`);
        this._applySeverityColor(this._tempLabel, severityFor('temperature', this._temperature));

        const gpuUsageText = this._gpuUsage != null ? `${Math.round(this._gpuUsage)}%` : null;
        const gpuTempText = this._gpuTemperature != null ? `${Math.round(this._gpuTemperature)}°C` : null;
        const gpuParts = [gpuUsageText, gpuTempText].filter(v => v !== null);
        this._gpuLabel.set_text(`🎮 ${gpuParts.length > 0 ? gpuParts.join(' ') : '—'}`);
        this._applySeverityColor(this._gpuLabel, worseSeverity(
            severityFor('gpuUsage', this._gpuUsage),
            severityFor('gpuTemperature', this._gpuTemperature)));

        this._cpuMenuItem.label.set_text(`${_('CPU:')} ${cpuText}`);
        this._ramMenuItem.label.set_text(
            this._memInfo != null
                ? `${_('RAM:')} ${ramText} (${(this._memInfo.usedKb / 1024 / 1024).toFixed(1)} GB / ${(this._memInfo.totalKb / 1024 / 1024).toFixed(1)} GB)`
                : `${_('RAM:')} —`
        );
        this._temperatureMenuItem.label.set_text(
            this._temperature != null
                ? `${_('CPU Temperature:')} ${Math.round(this._temperature)}°C`
                : _('CPU Temperature: not available on this system')
        );
        this._gpuUsageMenuItem.label.set_text(
            gpuUsageText !== null
                ? `${_('GPU Usage:')} ${gpuUsageText}`
                : _('GPU Usage: not available on this system')
        );
        this._gpuTempMenuItem.label.set_text(
            gpuTempText !== null
                ? `${_('GPU Temperature:')} ${gpuTempText}`
                : _('GPU Temperature: not available on this system')
        );

        const downText = this._network != null ? formatBytesPerSec(this._network.downBytesPerSec) : null;
        const upText = this._network != null ? formatBytesPerSec(this._network.upBytesPerSec) : null;
        this._networkLabel.set_text(
            this._network != null ? `🌐 ↓${downText} ↑${upText}` : '🌐 —'
        );
        this._networkDownMenuItem.label.set_text(`${_('Network ↓:')} ${downText ?? '—'}`);
        this._networkUpMenuItem.label.set_text(`${_('Network ↑:')} ${upText ?? '—'}`);
    }

    /** Etikete eşik durumuna göre renk uygular (normal durumda tema rengine döner) */
    _applySeverityColor(label, severity) {
        const color = colorForSeverity(severity);
        label.set_style(color ? `color: ${color}; font-weight: bold;` : null);
    }

    _drawSparkline(area) {
        const [width, height] = area.get_surface_size();
        const cr = area.get_context();
        const history = this._cpuHistory;

        const severityColor = colorForSeverity(severityFor('cpu', this._cpuPercent));
        if (severityColor) {
            const [r, g, b] = hexToRgb01(severityColor);
            cr.setSourceRGBA(r, g, b, 0.9);
        } else {
            cr.setSourceRGBA(1, 1, 1, 0.7);
        }
        cr.setLineWidth(1.2);

        if (history.length < 2) {
            cr.$dispose();
            return;
        }

        const step = width / (SPARKLINE_HISTORY_LENGTH - 1);
        const startIndex = SPARKLINE_HISTORY_LENGTH - history.length;

        history.forEach((value, i) => {
            const x = (startIndex + i) * step;
            const y = height - (value / 100) * height;
            if (i === 0)
                cr.moveTo(x, y);
            else
                cr.lineTo(x, y);
        });

        cr.stroke();
        cr.$dispose();
    }

    _stopPolling() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }
        this._stopProcessPolling();
        this._stopGpuPolling();
    }

    destroy() {
        this._destroyed = true; // async GPU callback'lerinin destroy sonrası çalışmasını önler
        this._stopPolling();
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        super.destroy();
    }
});

export default class SysMonitorExtension extends Extension {
    enable() {
        const settings = this.getSettings();
        this._indicator = new SysMonitorIndicator(settings, () => this.openPreferences());
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
