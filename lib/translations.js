/**
 * Kullanıcının ayarlardan manuel olarak seçebildiği dil sözlüğü.
 * Standart gettext sistemi sistem diline (`$LANG`) bağlı çalışır ve
 * extension'ın kendi tercihini geçersiz kılmasına izin vermez — bu yüzden
 * kullanıcı "Language" ayarını "Türkçe" ya da "English" olarak sabitlediğinde,
 * sistem dili ne olursa olsun bu sözlük kullanılır.
 *
 * Anahtarlar, kodun içindeki orijinal (İngilizce) metinlerle birebir aynı
 * olmalı — po/tr.po dosyasındaki msgid'lerle eşleşiyor.
 */
export const TR_STRINGS = {
    'CPU: —': 'CPU: —',
    'RAM: —': 'RAM: —',
    'CPU Temperature: —': 'CPU Sıcaklığı: —',
    'GPU Usage: —': 'GPU Kullanımı: —',
    'GPU Temperature: —': 'GPU Sıcaklığı: —',
    'Network ↓: —': 'Ağ ↓: —',
    'Network ↑: —': 'Ağ ↑: —',
    '⚠ No stuck or zombie processes': '⚠ Takılı veya zombie process yok',
    'Top RAM-consuming processes': 'En çok RAM kullanan process\'ler',
    'Top CPU-consuming processes': 'En çok CPU kullanan process\'ler',
    'Settings…': 'Ayarlar…',
    '⚠ Attention:': '⚠ Dikkat:',
    'CPU:': 'CPU:',
    'RAM:': 'RAM:',
    'CPU Temperature:': 'CPU Sıcaklığı:',
    'CPU Temperature: not available on this system': 'CPU Sıcaklığı: bu sistemde okunamıyor',
    'GPU Usage:': 'GPU Kullanımı:',
    'GPU Usage: not available on this system': 'GPU Kullanımı: bu sistemde okunamıyor',
    'GPU Temperature:': 'GPU Sıcaklığı:',
    'GPU Temperature: not available on this system': 'GPU Sıcaklığı: bu sistemde okunamıyor',
    'Network ↓:': 'Ağ ↓:',
    'Network ↑:': 'Ağ ↑:',

    'General': 'Genel',
    'Panel Display': 'Panel Görünümü',
    'Choose which metrics appear in the top panel': 'Üst panelde hangi metriklerin görüneceğini seçin',
    'Show CPU usage': 'CPU kullanımını göster',
    'Show RAM usage': 'RAM kullanımını göster',
    'Show CPU sparkline graph': 'CPU sparkline grafiğini göster',
    'Show CPU temperature': 'CPU sıcaklığını göster',
    'Hidden automatically if no sensor is found on this system': 'Bu sistemde sensör bulunamazsa otomatik olarak gizlenir',
    'Show GPU usage and temperature': 'GPU kullanımı ve sıcaklığını göster',
    'Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.':
        'AMD/Radeon/Nouveau\'yu doğrudan destekler; NVIDIA için kuruluysa nvidia-smi kullanılır. Kullanılamıyorsa otomatik olarak gizlenir.',
    'Show network activity': 'Ağ etkinliğini göster',
    'Combined download/upload speed across all network interfaces (excluding loopback)':
        'Loopback hariç tüm ağ arayüzlerinin toplam indirme/yükleme hızı',
    'Appearance': 'Görünüm',
    'Control the color of panel text and the sparkline graph': 'Panel metninin ve sparkline grafiğinin rengini kontrol edin',
    'Process List': 'Process Listesi',
    'Show process list in dropdown': 'Dropdown menüde process listesini göster',
    'Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.':
        'En çok CPU/RAM tüketenler ile takılı/zombie uyarıları. Bunu kapatmak process taramasını tamamen durdurur, küçük bir kaynak tasarrufu sağlar.',
    'Show process ID (PID)': 'Process ID\'sini (PID) göster',
    'Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.':
        'Her process satırının yanına PID numarasını ekler, örn. "(pid 1234)". Listeyi sade tutmak için varsayılan olarak kapalıdır.',
    'Refresh Rate': 'Yenileme Hızı',
    'Poll interval (seconds)': 'Yenileme aralığı (saniye)',
    'How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.':
        'CPU, RAM ve sıcaklık değerlerinin ne sıklıkla yenileneceği. Düşük değerler daha güncel bilgi verir ama biraz daha fazla kaynak kullanır.',
    'About': 'Hakkında',
    'Process list refresh': 'Process listesi yenileme',
    'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting above, since scanning all processes is more expensive than reading global CPU/RAM totals.':
        'Process listesi (en çok CPU/RAM tüketenler, takılı/zombie process\'ler) her 5 saniyede bir yenilenir ve yukarıdaki ayardan etkilenmez, çünkü tüm process\'leri taramak genel CPU/RAM toplamlarını okumaktan daha maliyetlidir.',
    'Panel color mode': 'Panel renk modu',
    '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
        '"Auto" sistemin açık/koyu temasını otomatik olarak takip eder. "Light" ve "Dark" mevcut temadan bağımsız olarak sabit bir renk zorlar.',
    'Auto (follow system)': 'Otomatik (sistemi takip et)',
    'Light': 'Açık',
    'Dark': 'Koyu',

    'Language': 'Dil',
    'Choose the language used for panel and menu text, independent of the system language.':
        'Panel ve menü metinlerinde kullanılacak dili, sistem dilinden bağımsız olarak seçin.',
};
