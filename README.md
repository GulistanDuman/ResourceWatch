# Resource Watch — GNOME Shell Extension

A GNOME Shell extension that monitors CPU, GPU, RAM, temperature, and process-level system usage directly from the panel.

## Features

* Live CPU% / RAM% / temperature indicator on the panel, separated by icons
* Sparkline graph showing CPU history
* Threshold-based coloring (normal $\rightarrow$ warning yellow $\rightarrow$ critical red)
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

No commercial concerns — developed as an open-source project open to contributions.
