# Resource Watch — GNOME Shell Extension

Panelden çıkmadan CPU, RAM, sıcaklık ve process-level sistem kullanımını izleyen
GNOME Shell extension'ı.

## Özellikler

- Panelde canlı CPU% / RAM% / sıcaklık göstergesi, simgelerle ayrılmış
- CPU geçmişini gösteren sparkline grafiği
- Eşik bazlı renklendirme (normal → uyarı sarısı → kritik kırmızısı)
- Dropdown menüde en çok CPU/RAM tüketen process'lerin listesi
- Takılı (D) ve zombie (Z) process uyarısı
- Ayarlanabilir panel görünümü ve yenileme hızı (Ayarlar penceresi)
- `/sys/class/hwmon` (coretemp/k10temp) öncelikli, güvenilir sıcaklık okuma
- İngilizce arayüz, gettext ile uluslararasılaştırmaya hazır

## Kurulum (geliştirme/test için)

```bash
# 1. Extension klasörünü GNOME'un extension dizinine sembolik link ile bağla
ln -s $(pwd)/resourcewatch@gulistanduman.github.io ~/.local/share/gnome-shell/extensions/

# 2. Şemayı derle
glib-compile-schemas ~/.local/share/gnome-shell/extensions/resourcewatch@gulistanduman.github.io/schemas/

# 3. Oturumu kapat / aç (kod dosyaları her değiştiğinde bu adım gerekir)

# 4. Extension'ı etkinleştir
gnome-extensions enable resourcewatch@gulistanduman.github.io
```

## Hata ayıklama

```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

## Proje yapısı

```
resourcewatch@gulistanduman.github.io/
  extension.js       # ana giriş noktası, panel widget'ı, polling
  prefs.js            # ayarlar penceresi (Adwaita UI)
  metadata.json        # GNOME Shell sürüm uyumluluğu bilgisi
  lib/
    cpu.js            # /proc/stat okuma ve hesaplama
    memory.js         # /proc/meminfo
    processes.js      # /proc/[pid]/* tarama, en çok CPU/RAM tüketenler
    thermal.js        # hwmon + thermal_zone fallback zinciri
    thresholds.js      # eşik değerleri ve renk mantığı
  schemas/
    org.gnome.shell.extensions.resourcewatch.gschema.xml
```

## Lisans / Katkı

Ticari kaygı yok — açık kaynak, katkıya açık bir proje olarak geliştiriliyor.
