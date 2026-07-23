import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class SysMonitorPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'utilities-system-monitor-symbolic',
        });
        window.add(page);

        // --- Panel Display ---
        const displayGroup = new Adw.PreferencesGroup({
            title: _('Panel Display'),
            description: _('Choose which metrics appear in the top panel'),
        });
        page.add(displayGroup);

        displayGroup.add(this._switchRow(settings, 'show-cpu', _('Show CPU usage')));
        displayGroup.add(this._switchRow(settings, 'show-ram', _('Show RAM usage')));
        displayGroup.add(this._switchRow(settings, 'show-sparkline', _('Show CPU sparkline graph')));
        displayGroup.add(this._switchRow(
            settings, 'show-temperature',
            _('Show CPU temperature'),
            _('Hidden automatically if no sensor is found on this system')
        ));
        displayGroup.add(this._switchRow(
            settings, 'show-gpu',
            _('Show GPU usage and temperature'),
            _('Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.')
        ));
        displayGroup.add(this._switchRow(
            settings, 'show-network',
            _('Show network activity'),
            _('Combined download/upload speed across all network interfaces (excluding loopback)')
        ));

        // --- Process List ---
        const processGroup = new Adw.PreferencesGroup({
            title: _('Process List'),
        });
        page.add(processGroup);

        processGroup.add(this._switchRow(
            settings, 'show-process-list',
            _('Show process list in dropdown'),
            _('Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.')
        ));

        processGroup.add(this._switchRow(
            settings, 'show-process-pid',
            _('Show process ID (PID)'),
            _('Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.')
        ));

        // --- Refresh Rate ---
        const refreshGroup = new Adw.PreferencesGroup({
            title: _('Refresh Rate'),
        });
        page.add(refreshGroup);

        const pollRow = new Adw.SpinRow({
            title: _('Poll interval (seconds)'),
            subtitle: _('How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.'),
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 30,
                step_increment: 1,
            }),
        });
        settings.bind('poll-interval', pollRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        refreshGroup.add(pollRow);

        // --- About ---
        const aboutGroup = new Adw.PreferencesGroup({
            title: _('About'),
        });
        page.add(aboutGroup);

        const aboutRow = new Adw.ActionRow({
            title: _('Process list refresh'),
            subtitle: _('The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting above, since scanning all processes is more expensive than reading global CPU/RAM totals.'),
        });
        aboutGroup.add(aboutRow);
    }

    _switchRow(settings, key, title, subtitle) {
        const row = new Adw.SwitchRow({ title, subtitle: subtitle ?? null });
        settings.bind(key, row, 'active', Gio.SettingsBindFlags.DEFAULT);
        return row;
    }
}
