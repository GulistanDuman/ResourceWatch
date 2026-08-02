# Resource Watch — GNOME Shell Extension

A GNOME Shell extension that monitors CPU, GPU, RAM, temperature, and process-level system usage directly from the panel.

## Screenshots

**Panel indicator**

<img width="393" height="30" alt="Resource Watch panel view" src="https://github.com/user-attachments/assets/35aeecf2-4af5-4206-ab34-ebe0b3040378" />

**Dropdown menu &nbsp;/&nbsp; Preferences window**

<table>
  <tr>
    <td><img width="330" alt="Resource Watch dropdown menu" src="https://github.com/user-attachments/assets/b2de7bae-87c8-4a10-8e28-c041580ce144" /></td>
    <td><img width="330" alt="Resource Watch preferences window" src="https://github.com/user-attachments/assets/56d770c2-e5e7-4c8a-8e8d-3a26b99a54b2" /></td>
  </tr>
</table>

## Features

* Live CPU% / RAM% / temperature indicator on the panel, separated by icons
* Sparkline graph showing CPU history
* Threshold-based coloring (normal → warning yellow → critical red)
* List of top CPU/RAM-consuming processes in the dropdown menu
* Warnings for stuck (D) and zombie (Z) processes
* Adjustable panel appearance and refresh rate (Preferences window)
* Reliable temperature reading prioritizing `/sys/class/hwmon` (coretemp/k10temp)
* English interface, ready for internationalization using gettext

## Installation (for development/testing)

```bash
# 1. Symlink the extension folder to GNOME's extension directory
ln -s $(pwd)/resourcewatch@gulistanduman.github.io ~/.local/share/gnome-shell/extensions/

# 2. Compile the schema
glib-compile-schemas ~/.local/share/gnome-shell/extensions/resourcewatch@gulistanduman.github.io/schemas/

# 3. Log out / log back in (this step is required whenever code files change)

# 4. Enable the extension
gnome-extensions enable resourcewatch@gulistanduman.github.io
```

## Debugging

```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

## Project Structure

```
resourcewatch@gulistanduman.github.io/
  extension.js        # main entry point, panel widget, polling
  prefs.js            # preferences window (Adwaita UI)
  metadata.json       # GNOME Shell version compatibility info
  lib/
    cpu.js            # /proc/stat reading and calculation
    memory.js         # /proc/meminfo
    processes.js      # /proc/[pid]/* scanning, top CPU/RAM consumers
    thermal.js        # hwmon + thermal_zone fallback chain
    thresholds.js     # threshold values and color logic
  schemas/
    org.gnome.shell.extensions.resourcewatch.gschema.xml

```
## License / Contribution

Licensed under the [MIT License](LICENSE) — free and open source, contributions welcome.
