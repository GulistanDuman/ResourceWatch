# Resource Watch — GNOME Shell Extension

A GNOME Shell extension that monitors CPU, GPU, RAM, temperature, and process-level system usage directly from the panel.

## Screenshots

**Panel indicator**

<img width="430" height="30" alt="resim" src="https://github.com/user-attachments/assets/b61405cd-1114-4d96-b663-88e924cbbda8" />


**Dropdown menu &nbsp;/&nbsp; Preferences window**

<table>
  <tr>
    <td> <img width="309" height="818" alt="resim" src="https://github.com/user-attachments/assets/2311a089-32cb-4a2d-b39a-633a1d686604" /> </td>

    <td> <img width="309" height="818" alt="resim" src="https://github.com/user-attachments/assets/38b6dfe1-6a88-4579-8c75-963ac1460a49" /> </td>

    <td> <img width="627" height="1043" alt="resim" src="https://github.com/user-attachments/assets/5e96f167-30da-440a-9c06-477039362be1" /> </td>

    <td> <img width="627" height="1043" alt="resim" src="https://github.com/user-attachments/assets/f5084d29-1da7-46c7-a570-c90a472bf767" /> </td>

  </tr>
</table>

## Features

* Live CPU% / RAM% / temperature indicator on the panel, separated by icons
* GPU usage and temperature (AMD/Radeon/Nouveau directly; NVIDIA via `nvidia-smi` if installed)
* Network download/upload speed across all interfaces (excluding loopback)
* Sparkline graph showing CPU history
* Threshold-based coloring (normal → warning yellow → critical red)
* List of top CPU/RAM-consuming processes in the dropdown menu, shown as
  distinct card-style groups
* Warnings for stuck (D) and zombie (Z) processes
* Optional process ID (PID) display, off by default to keep the list clean
* Manual panel color mode (Auto / Light / Dark) — overrides the
  theme-following color for the panel badge, sparkline, and dropdown menu;
  the Preferences window itself follows the same setting
* User-selectable UI language, independent of the system locale:
  English, Türkçe, Deutsch, Español, Français, Русский, Português, or
  Automatic (follows system language via gettext)
* Adjustable panel appearance and refresh rate (Preferences window)
* Reliable temperature reading prioritizing `/sys/class/hwmon` (coretemp/k10temp)

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
