import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _systemGettext } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import { TR_STRINGS } from './lib/translations.js';

const PANEL_COLOR_MODE_VALUES = ['auto', 'light', 'dark'];
const UI_LANGUAGE_VALUES = ['auto', 'en', 'tr'];

export default class SysMonitorPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        this.initTranslations(); // loads .mo files from locale/ for the 'auto' (system-language) case
        const settings = this.getSettings();
        this._settings = settings;

        const page = new Adw.PreferencesPage({
            title: this._t('General'),
            icon_name: 'utilities-system-monitor-symbolic',
        });
        window.add(page);

        // --- Panel Display ---
        const displayGroup = new Adw.PreferencesGroup({
            title: this._t('Panel Display'),
            description: this._t('Choose which metrics appear in the top panel'),
        });
        page.add(displayGroup);

        displayGroup.add(this._switchRow(settings, 'show-cpu', this._t('Show CPU usage')));
        displayGroup.add(this._switchRow(settings, 'show-ram', this._t('Show RAM usage')));
        displayGroup.add(this._switchRow(settings, 'show-sparkline', this._t('Show CPU sparkline graph')));
        displayGroup.add(this._switchRow(
            settings, 'show-temperature',
            this._t('Show CPU temperature'),
            this._t('Hidden automatically if no sensor is found on this system')
        ));
        displayGroup.add(this._switchRow(
            settings, 'show-gpu',
            this._t('Show GPU usage and temperature'),
            this._t('Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.')
        ));
        displayGroup.add(this._switchRow(
            settings, 'show-network',
            this._t('Show network activity'),
            this._t('Combined download/upload speed across all network interfaces (excluding loopback)')
        ));

        // --- Appearance ---
        const appearanceGroup = new Adw.PreferencesGroup({
            title: this._t('Appearance'),
            description: this._t('Control the color of panel text and the sparkline graph'),
        });
        page.add(appearanceGroup);

        appearanceGroup.add(this._colorModeRow(settings));

        // --- Language ---
        const languageGroup = new Adw.PreferencesGroup({
            title: this._t('Language'),
            description: this._t('Choose the language used for panel and menu text, independent of the system language.'),
        });
        page.add(languageGroup);

        languageGroup.add(this._languageRow(settings));

        // --- Process List ---
        const processGroup = new Adw.PreferencesGroup({
            title: this._t('Process List'),
        });
        page.add(processGroup);

        processGroup.add(this._switchRow(
            settings, 'show-process-list',
            this._t('Show process list in dropdown'),
            this._t('Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.')
        ));

        processGroup.add(this._switchRow(
            settings, 'show-process-pid',
            this._t('Show process ID (PID)'),
            this._t('Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.')
        ));

        // --- Refresh Rate ---
        const refreshGroup = new Adw.PreferencesGroup({
            title: this._t('Refresh Rate'),
        });
        page.add(refreshGroup);

        const pollRow = new Adw.SpinRow({
            title: this._t('Poll interval (seconds)'),
            subtitle: this._t('How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.'),
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
            title: this._t('About'),
        });
        page.add(aboutGroup);

        const aboutRow = new Adw.ActionRow({
            title: this._t('Process list refresh'),
            subtitle: this._t('The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting above, since scanning all processes is more expensive than reading global CPU/RAM totals.'),
        });
        aboutGroup.add(aboutRow);
    }

    /**
     * Translates a string based on the user-selected 'ui-language' setting,
     * independent of the system locale — mirrors the same logic used in
     * extension.js so both surfaces (panel/menu and preferences window)
     * behave consistently.
     */
    _t(str) {
        const lang = this._settings.get_string('ui-language');
        if (lang === 'en')
            return str;
        if (lang === 'tr')
            return TR_STRINGS[str] ?? str;
        return _systemGettext(str);
    }

    _switchRow(settings, key, title, subtitle) {
        const row = new Adw.SwitchRow({ title, subtitle: subtitle ?? null });
        settings.bind(key, row, 'active', Gio.SettingsBindFlags.DEFAULT);
        return row;
    }

    /**
     * Builds the "Panel color mode" dropdown (Auto / Light / Dark).
     * GSettings string enums don't support direct settings.bind() the way
     * booleans/ints do, so we manually sync the selected index both ways:
     * read the current value on build, write it back whenever the user
     * picks a different option.
     */
    _colorModeRow(settings) {
        const row = new Adw.ComboRow({
            title: this._t('Panel color mode'),
            subtitle: this._t('"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.'),
            model: new Gtk.StringList({
                strings: [this._t('Auto (follow system)'), this._t('Light'), this._t('Dark')],
            }),
        });

        const currentValue = settings.get_string('panel-color-mode');
        const currentIndex = PANEL_COLOR_MODE_VALUES.indexOf(currentValue);
        row.selected = currentIndex >= 0 ? currentIndex : 0;

        row.connect('notify::selected', () => {
            settings.set_string('panel-color-mode', PANEL_COLOR_MODE_VALUES[row.selected]);
        });

        return row;
    }

    /**
     * Builds the "Language" dropdown (Auto / English / Türkçe). The option
     * labels themselves are intentionally NOT translated — they're always
     * shown the same way so the user can recognize their language choice
     * regardless of what the current UI language happens to be set to.
     */
    _languageRow(settings) {
        const row = new Adw.ComboRow({
            title: this._t('Language'),
            model: new Gtk.StringList({
                strings: ['Automatic (system language)', 'English', 'Türkçe'],
            }),
        });

        const currentValue = settings.get_string('ui-language');
        const currentIndex = UI_LANGUAGE_VALUES.indexOf(currentValue);
        row.selected = currentIndex >= 0 ? currentIndex : 0;

        row.connect('notify::selected', () => {
            settings.set_string('ui-language', UI_LANGUAGE_VALUES[row.selected]);
        });

        return row;
    }
}
