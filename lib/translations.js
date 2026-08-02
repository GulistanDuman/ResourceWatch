/**
 * Kullanıcının ayarlardan manuel olarak seçebildiği dil sözlükleri.
 * Standart gettext sistemi sistem diline (`$LANG`) bağlı çalışır ve
 * extension'ın kendi tercihini geçersiz kılmasına izin vermez — bu yüzden
 * kullanıcı "Language" ayarını belirli bir dile sabitlediğinde, sistem
 * dili ne olursa olsun bu sözlükler kullanılır.
 *
 * Her dilin anahtarları, kodun içindeki orijinal (İngilizce) metinlerle
 * birebir aynı olmalı.
 */
export const TRANSLATIONS = {
    tr: {
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
        'Appearance & Language': 'Görünüm ve Dil',
        'Control the color of panel text and the language used, independent of the system theme and locale':
            'Panel metninin rengini ve kullanılan dili, sistem temasından ve dilinden bağımsız olarak kontrol edin',
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
        'Process list refresh': 'Process listesi yenileme',
        'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting below, since scanning all processes is more expensive than reading global CPU/RAM totals.':
            'Process listesi (en çok CPU/RAM tüketenler, takılı/zombie process\'ler) her 5 saniyede bir yenilenir ve aşağıdaki ayardan etkilenmez, çünkü tüm process\'leri taramak genel CPU/RAM toplamlarını okumaktan daha maliyetlidir.',
        'Panel color mode': 'Panel renk modu',
        '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
            '"Auto" sistemin açık/koyu temasını otomatik olarak takip eder. "Light" ve "Dark" mevcut temadan bağımsız olarak sabit bir renk zorlar.',
        'Auto (follow system)': 'Otomatik (sistemi takip et)',
        'Light': 'Açık',
        'Dark': 'Koyu',
        'Language': 'Dil',
    },

    de: {
        'CPU: —': 'CPU: —',
        'RAM: —': 'RAM: —',
        'CPU Temperature: —': 'CPU-Temperatur: —',
        'GPU Usage: —': 'GPU-Auslastung: —',
        'GPU Temperature: —': 'GPU-Temperatur: —',
        'Network ↓: —': 'Netzwerk ↓: —',
        'Network ↑: —': 'Netzwerk ↑: —',
        '⚠ No stuck or zombie processes': '⚠ Keine hängenden oder Zombie-Prozesse',
        'Top RAM-consuming processes': 'Prozesse mit dem höchsten RAM-Verbrauch',
        'Top CPU-consuming processes': 'Prozesse mit der höchsten CPU-Auslastung',
        'Settings…': 'Einstellungen…',
        '⚠ Attention:': '⚠ Achtung:',
        'CPU:': 'CPU:',
        'RAM:': 'RAM:',
        'CPU Temperature:': 'CPU-Temperatur:',
        'CPU Temperature: not available on this system': 'CPU-Temperatur: auf diesem System nicht verfügbar',
        'GPU Usage:': 'GPU-Auslastung:',
        'GPU Usage: not available on this system': 'GPU-Auslastung: auf diesem System nicht verfügbar',
        'GPU Temperature:': 'GPU-Temperatur:',
        'GPU Temperature: not available on this system': 'GPU-Temperatur: auf diesem System nicht verfügbar',
        'Network ↓:': 'Netzwerk ↓:',
        'Network ↑:': 'Netzwerk ↑:',
        'General': 'Allgemein',
        'Panel Display': 'Panel-Anzeige',
        'Choose which metrics appear in the top panel': 'Wähle, welche Metriken im oberen Panel angezeigt werden',
        'Show CPU usage': 'CPU-Auslastung anzeigen',
        'Show RAM usage': 'RAM-Nutzung anzeigen',
        'Show CPU sparkline graph': 'CPU-Sparkline-Diagramm anzeigen',
        'Show CPU temperature': 'CPU-Temperatur anzeigen',
        'Hidden automatically if no sensor is found on this system': 'Wird automatisch ausgeblendet, wenn kein Sensor auf diesem System gefunden wird',
        'Show GPU usage and temperature': 'GPU-Auslastung und -Temperatur anzeigen',
        'Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.':
            'Unterstützt AMD/Radeon/Nouveau direkt; NVIDIA über nvidia-smi, falls installiert. Wird automatisch ausgeblendet, wenn nicht verfügbar.',
        'Show network activity': 'Netzwerkaktivität anzeigen',
        'Combined download/upload speed across all network interfaces (excluding loopback)':
            'Kombinierte Download-/Upload-Geschwindigkeit über alle Netzwerkschnittstellen (ohne Loopback)',
        'Appearance & Language': 'Erscheinungsbild & Sprache',
        'Control the color of panel text and the language used, independent of the system theme and locale':
            'Steuere die Farbe des Paneltexts und die verwendete Sprache, unabhängig vom Systemdesign und der Systemsprache',
        'Process List': 'Prozessliste',
        'Show process list in dropdown': 'Prozessliste im Dropdown-Menü anzeigen',
        'Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.':
            'Prozesse mit höchstem CPU-/RAM-Verbrauch sowie Warnungen zu hängenden/Zombie-Prozessen. Das Deaktivieren stoppt auch die Prozessüberprüfung vollständig und spart etwas Ressourcen.',
        'Show process ID (PID)': 'Prozess-ID (PID) anzeigen',
        'Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.':
            'Fügt die Prozess-ID-Nummer neben jeder Prozesszeile hinzu, z. B. „(pid 1234)“. Standardmäßig deaktiviert, damit die Liste übersichtlicher bleibt.',
        'Refresh Rate': 'Aktualisierungsrate',
        'Poll interval (seconds)': 'Abfrageintervall (Sekunden)',
        'How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.':
            'Wie oft CPU-, RAM- und Temperaturwerte aktualisiert werden. Niedrigere Werte sind aktueller, verbrauchen aber etwas mehr Ressourcen.',
        'Process list refresh': 'Aktualisierung der Prozessliste',
        'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting below, since scanning all processes is more expensive than reading global CPU/RAM totals.':
            'Die Prozessliste (Top-CPU-/RAM-Verbraucher, hängende/Zombie-Prozesse) wird alle 5 Sekunden aktualisiert und ist von der untenstehenden Einstellung nicht betroffen, da das Scannen aller Prozesse aufwendiger ist als das Lesen der globalen CPU-/RAM-Summen.',
        'Panel color mode': 'Panel-Farbmodus',
        '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
            '„Auto“ folgt automatisch dem hellen/dunklen Systemdesign. „Hell“ und „Dunkel“ erzwingen eine feste Farbe unabhängig vom aktuellen Design.',
        'Auto (follow system)': 'Automatisch (Systemeinstellung folgen)',
        'Light': 'Hell',
        'Dark': 'Dunkel',
        'Language': 'Sprache',
    },

    es: {
        'CPU: —': 'CPU: —',
        'RAM: —': 'RAM: —',
        'CPU Temperature: —': 'Temperatura de la CPU: —',
        'GPU Usage: —': 'Uso de la GPU: —',
        'GPU Temperature: —': 'Temperatura de la GPU: —',
        'Network ↓: —': 'Red ↓: —',
        'Network ↑: —': 'Red ↑: —',
        '⚠ No stuck or zombie processes': '⚠ No hay procesos bloqueados o zombis',
        'Top RAM-consuming processes': 'Procesos que más RAM consumen',
        'Top CPU-consuming processes': 'Procesos que más CPU consumen',
        'Settings…': 'Ajustes…',
        '⚠ Attention:': '⚠ Atención:',
        'CPU:': 'CPU:',
        'RAM:': 'RAM:',
        'CPU Temperature:': 'Temperatura de la CPU:',
        'CPU Temperature: not available on this system': 'Temperatura de la CPU: no disponible en este sistema',
        'GPU Usage:': 'Uso de la GPU:',
        'GPU Usage: not available on this system': 'Uso de la GPU: no disponible en este sistema',
        'GPU Temperature:': 'Temperatura de la GPU:',
        'GPU Temperature: not available on this system': 'Temperatura de la GPU: no disponible en este sistema',
        'Network ↓:': 'Red ↓:',
        'Network ↑:': 'Red ↑:',
        'General': 'General',
        'Panel Display': 'Visualización del panel',
        'Choose which metrics appear in the top panel': 'Elige qué métricas aparecen en el panel superior',
        'Show CPU usage': 'Mostrar uso de la CPU',
        'Show RAM usage': 'Mostrar uso de la RAM',
        'Show CPU sparkline graph': 'Mostrar gráfico sparkline de la CPU',
        'Show CPU temperature': 'Mostrar temperatura de la CPU',
        'Hidden automatically if no sensor is found on this system': 'Se oculta automáticamente si no se encuentra ningún sensor en este sistema',
        'Show GPU usage and temperature': 'Mostrar uso y temperatura de la GPU',
        'Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.':
            'Compatible directamente con AMD/Radeon/Nouveau; NVIDIA mediante nvidia-smi si está instalado. Se oculta automáticamente si no está disponible.',
        'Show network activity': 'Mostrar actividad de red',
        'Combined download/upload speed across all network interfaces (excluding loopback)':
            'Velocidad combinada de descarga/subida en todas las interfaces de red (excluyendo loopback)',
        'Appearance & Language': 'Apariencia e idioma',
        'Control the color of panel text and the language used, independent of the system theme and locale':
            'Controla el color del texto del panel y el idioma utilizado, independientemente del tema y la configuración regional del sistema',
        'Process List': 'Lista de procesos',
        'Show process list in dropdown': 'Mostrar lista de procesos en el menú desplegable',
        'Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.':
            'Procesos que más CPU/RAM consumen y avisos de procesos bloqueados/zombis. Desactivar esto también detiene por completo el escaneo de procesos, ahorrando algunos recursos.',
        'Show process ID (PID)': 'Mostrar ID de proceso (PID)',
        'Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.':
            'Añade el número de ID del proceso junto a cada línea de proceso, p. ej. «(pid 1234)». Desactivado de forma predeterminada para mantener la lista más limpia.',
        'Refresh Rate': 'Frecuencia de actualización',
        'Poll interval (seconds)': 'Intervalo de consulta (segundos)',
        'How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.':
            'Con qué frecuencia se actualizan los valores de CPU, RAM y temperatura. Valores más bajos están más actualizados pero usan ligeramente más recursos.',
        'Process list refresh': 'Actualización de la lista de procesos',
        'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting below, since scanning all processes is more expensive than reading global CPU/RAM totals.':
            'La lista de procesos (los que más CPU/RAM consumen, procesos bloqueados/zombis) se actualiza cada 5 segundos y no se ve afectada por el ajuste de abajo, ya que escanear todos los procesos es más costoso que leer los totales globales de CPU/RAM.',
        'Panel color mode': 'Modo de color del panel',
        '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
            '«Auto» sigue automáticamente el tema claro/oscuro del sistema. «Claro» y «Oscuro» fuerzan un color fijo independientemente del tema actual.',
        'Auto (follow system)': 'Automático (seguir sistema)',
        'Light': 'Claro',
        'Dark': 'Oscuro',
        'Language': 'Idioma',
    },

    fr: {
        'CPU: —': 'CPU : —',
        'RAM: —': 'RAM : —',
        'CPU Temperature: —': 'Température du CPU : —',
        'GPU Usage: —': 'Utilisation du GPU : —',
        'GPU Temperature: —': 'Température du GPU : —',
        'Network ↓: —': 'Réseau ↓ : —',
        'Network ↑: —': 'Réseau ↑ : —',
        '⚠ No stuck or zombie processes': '⚠ Aucun processus bloqué ou zombie',
        'Top RAM-consuming processes': 'Processus consommant le plus de RAM',
        'Top CPU-consuming processes': 'Processus consommant le plus de CPU',
        'Settings…': 'Paramètres…',
        '⚠ Attention:': '⚠ Attention :',
        'CPU:': 'CPU :',
        'RAM:': 'RAM :',
        'CPU Temperature:': 'Température du CPU :',
        'CPU Temperature: not available on this system': 'Température du CPU : non disponible sur ce système',
        'GPU Usage:': 'Utilisation du GPU :',
        'GPU Usage: not available on this system': 'Utilisation du GPU : non disponible sur ce système',
        'GPU Temperature:': 'Température du GPU :',
        'GPU Temperature: not available on this system': 'Température du GPU : non disponible sur ce système',
        'Network ↓:': 'Réseau ↓ :',
        'Network ↑:': 'Réseau ↑ :',
        'General': 'Général',
        'Panel Display': 'Affichage du panneau',
        'Choose which metrics appear in the top panel': 'Choisissez les indicateurs affichés dans le panneau supérieur',
        'Show CPU usage': "Afficher l'utilisation du CPU",
        'Show RAM usage': "Afficher l'utilisation de la RAM",
        'Show CPU sparkline graph': 'Afficher le graphique sparkline du CPU',
        'Show CPU temperature': 'Afficher la température du CPU',
        'Hidden automatically if no sensor is found on this system': "Masqué automatiquement si aucun capteur n'est trouvé sur ce système",
        'Show GPU usage and temperature': "Afficher l'utilisation et la température du GPU",
        'Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.':
            'Prend en charge directement AMD/Radeon/Nouveau ; NVIDIA via nvidia-smi si installé. Masqué automatiquement si indisponible.',
        'Show network activity': "Afficher l'activité réseau",
        'Combined download/upload speed across all network interfaces (excluding loopback)':
            'Débit combiné de téléchargement/envoi sur toutes les interfaces réseau (hors loopback)',
        'Appearance & Language': 'Apparence et langue',
        'Control the color of panel text and the language used, independent of the system theme and locale':
            'Contrôlez la couleur du texte du panneau et la langue utilisée, indépendamment du thème et de la langue du système',
        'Process List': 'Liste des processus',
        'Show process list in dropdown': 'Afficher la liste des processus dans le menu déroulant',
        'Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.':
            "Principaux consommateurs de CPU/RAM et avertissements de processus bloqués/zombies. Désactiver cette option arrête également complètement l'analyse des processus, économisant un peu de ressources.",
        'Show process ID (PID)': "Afficher l'identifiant du processus (PID)",
        'Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.':
            "Ajoute le numéro d'identifiant du processus à côté de chaque ligne, par ex. « (pid 1234) ». Désactivé par défaut pour garder la liste plus lisible.",
        'Refresh Rate': "Fréquence d'actualisation",
        'Poll interval (seconds)': "Intervalle d'interrogation (secondes)",
        'How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.':
            'Fréquence de mise à jour des valeurs de CPU, RAM et température. Des valeurs plus basses sont plus à jour mais utilisent un peu plus de ressources.',
        'Process list refresh': 'Actualisation de la liste des processus',
        'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting below, since scanning all processes is more expensive than reading global CPU/RAM totals.':
            "La liste des processus (principaux consommateurs de CPU/RAM, processus bloqués/zombies) est actualisée toutes les 5 secondes et n'est pas affectée par le paramètre ci-dessous, car analyser tous les processus est plus coûteux que lire les totaux globaux de CPU/RAM.",
        'Panel color mode': 'Mode de couleur du panneau',
        '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
            '« Auto » suit automatiquement le thème clair/sombre du système. « Clair » et « Sombre » imposent une couleur fixe quel que soit le thème actuel.',
        'Auto (follow system)': 'Automatique (suivre le système)',
        'Light': 'Clair',
        'Dark': 'Sombre',
        'Language': 'Langue',
    },

    ru: {
        'CPU: —': 'CPU: —',
        'RAM: —': 'RAM: —',
        'CPU Temperature: —': 'Температура ЦП: —',
        'GPU Usage: —': 'Загрузка GPU: —',
        'GPU Temperature: —': 'Температура GPU: —',
        'Network ↓: —': 'Сеть ↓: —',
        'Network ↑: —': 'Сеть ↑: —',
        '⚠ No stuck or zombie processes': '⚠ Нет зависших или зомби-процессов',
        'Top RAM-consuming processes': 'Процессы с наибольшим потреблением RAM',
        'Top CPU-consuming processes': 'Процессы с наибольшей загрузкой ЦП',
        'Settings…': 'Настройки…',
        '⚠ Attention:': '⚠ Внимание:',
        'CPU:': 'CPU:',
        'RAM:': 'RAM:',
        'CPU Temperature:': 'Температура ЦП:',
        'CPU Temperature: not available on this system': 'Температура ЦП: недоступна в этой системе',
        'GPU Usage:': 'Загрузка GPU:',
        'GPU Usage: not available on this system': 'Загрузка GPU: недоступна в этой системе',
        'GPU Temperature:': 'Температура GPU:',
        'GPU Temperature: not available on this system': 'Температура GPU: недоступна в этой системе',
        'Network ↓:': 'Сеть ↓:',
        'Network ↑:': 'Сеть ↑:',
        'General': 'Общие',
        'Panel Display': 'Отображение на панели',
        'Choose which metrics appear in the top panel': 'Выберите, какие показатели отображаются на верхней панели',
        'Show CPU usage': 'Показывать загрузку ЦП',
        'Show RAM usage': 'Показывать использование RAM',
        'Show CPU sparkline graph': 'Показывать мини-график ЦП',
        'Show CPU temperature': 'Показывать температуру ЦП',
        'Hidden automatically if no sensor is found on this system': 'Автоматически скрывается, если в системе не найден датчик',
        'Show GPU usage and temperature': 'Показывать загрузку и температуру GPU',
        'Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.':
            'Поддерживает AMD/Radeon/Nouveau напрямую; NVIDIA через nvidia-smi, если установлен. Автоматически скрывается, если недоступно.',
        'Show network activity': 'Показывать сетевую активность',
        'Combined download/upload speed across all network interfaces (excluding loopback)':
            'Суммарная скорость загрузки/отдачи по всем сетевым интерфейсам (кроме loopback)',
        'Appearance & Language': 'Внешний вид и язык',
        'Control the color of panel text and the language used, independent of the system theme and locale':
            'Настройте цвет текста на панели и используемый язык независимо от системной темы и локали',
        'Process List': 'Список процессов',
        'Show process list in dropdown': 'Показывать список процессов в выпадающем меню',
        'Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.':
            'Процессы с наибольшим потреблением ЦП/RAM и предупреждения о зависших/зомби-процессах. Отключение этой опции также полностью останавливает сканирование процессов, немного экономя ресурсы.',
        'Show process ID (PID)': 'Показывать ID процесса (PID)',
        'Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.':
            'Добавляет номер PID рядом с каждой строкой процесса, например «(pid 1234)». По умолчанию отключено, чтобы список оставался чище.',
        'Refresh Rate': 'Частота обновления',
        'Poll interval (seconds)': 'Интервал опроса (в секундах)',
        'How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.':
            'Как часто обновляются значения ЦП, RAM и температуры. Меньшие значения дают более актуальные данные, но немного увеличивают потребление ресурсов.',
        'Process list refresh': 'Обновление списка процессов',
        'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting below, since scanning all processes is more expensive than reading global CPU/RAM totals.':
            'Список процессов (наибольшее потребление ЦП/RAM, зависшие/зомби-процессы) обновляется каждые 5 секунд и не зависит от настройки ниже, поскольку сканирование всех процессов затратнее, чем чтение общих показателей ЦП/RAM.',
        'Panel color mode': 'Режим цвета панели',
        '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
            '«Авто» автоматически следует системной светлой/тёмной теме. «Светлая» и «Тёмная» задают фиксированный цвет независимо от текущей темы.',
        'Auto (follow system)': 'Автоматически (как в системе)',
        'Light': 'Светлая',
        'Dark': 'Тёмная',
        'Language': 'Язык',
    },

    pt: {
        'CPU: —': 'CPU: —',
        'RAM: —': 'RAM: —',
        'CPU Temperature: —': 'Temperatura da CPU: —',
        'GPU Usage: —': 'Uso da GPU: —',
        'GPU Temperature: —': 'Temperatura da GPU: —',
        'Network ↓: —': 'Rede ↓: —',
        'Network ↑: —': 'Rede ↑: —',
        '⚠ No stuck or zombie processes': '⚠ Nenhum processo travado ou zumbi',
        'Top RAM-consuming processes': 'Processos que mais consomem RAM',
        'Top CPU-consuming processes': 'Processos que mais consomem CPU',
        'Settings…': 'Configurações…',
        '⚠ Attention:': '⚠ Atenção:',
        'CPU:': 'CPU:',
        'RAM:': 'RAM:',
        'CPU Temperature:': 'Temperatura da CPU:',
        'CPU Temperature: not available on this system': 'Temperatura da CPU: não disponível neste sistema',
        'GPU Usage:': 'Uso da GPU:',
        'GPU Usage: not available on this system': 'Uso da GPU: não disponível neste sistema',
        'GPU Temperature:': 'Temperatura da GPU:',
        'GPU Temperature: not available on this system': 'Temperatura da GPU: não disponível neste sistema',
        'Network ↓:': 'Rede ↓:',
        'Network ↑:': 'Rede ↑:',
        'General': 'Geral',
        'Panel Display': 'Exibição no painel',
        'Choose which metrics appear in the top panel': 'Escolha quais métricas aparecem no painel superior',
        'Show CPU usage': 'Mostrar uso da CPU',
        'Show RAM usage': 'Mostrar uso da RAM',
        'Show CPU sparkline graph': 'Mostrar gráfico sparkline da CPU',
        'Show CPU temperature': 'Mostrar temperatura da CPU',
        'Hidden automatically if no sensor is found on this system': 'Ocultado automaticamente se nenhum sensor for encontrado neste sistema',
        'Show GPU usage and temperature': 'Mostrar uso e temperatura da GPU',
        'Supports AMD/Radeon/Nouveau directly; NVIDIA via nvidia-smi if installed. Hidden automatically if unavailable.':
            'Compatível diretamente com AMD/Radeon/Nouveau; NVIDIA via nvidia-smi se instalado. Ocultado automaticamente se indisponível.',
        'Show network activity': 'Mostrar atividade de rede',
        'Combined download/upload speed across all network interfaces (excluding loopback)':
            'Velocidade combinada de download/upload em todas as interfaces de rede (exceto loopback)',
        'Appearance & Language': 'Aparência e idioma',
        'Control the color of panel text and the language used, independent of the system theme and locale':
            'Controle a cor do texto do painel e o idioma usado, independentemente do tema e do idioma do sistema',
        'Process List': 'Lista de processos',
        'Show process list in dropdown': 'Mostrar lista de processos no menu suspenso',
        'Top CPU/RAM consumers and stuck/zombie warnings. Disabling this also stops process scanning entirely, saving a small amount of resources.':
            'Processos que mais consomem CPU/RAM e avisos de processos travados/zumbis. Desativar isso também interrompe completamente a varredura de processos, economizando um pouco de recursos.',
        'Show process ID (PID)': 'Mostrar ID do processo (PID)',
        'Adds the process ID number next to each process line, e.g. "(pid 1234)". Off by default to keep the list cleaner.':
            'Adiciona o número do ID do processo ao lado de cada linha de processo, por exemplo, "(pid 1234)". Desativado por padrão para manter a lista mais limpa.',
        'Refresh Rate': 'Taxa de atualização',
        'Poll interval (seconds)': 'Intervalo de consulta (segundos)',
        'How often CPU, RAM, and temperature values are refreshed. Lower values are more up to date but use slightly more resources.':
            'Com que frequência os valores de CPU, RAM e temperatura são atualizados. Valores menores são mais atualizados, mas usam um pouco mais de recursos.',
        'Process list refresh': 'Atualização da lista de processos',
        'The process list (top CPU/RAM consumers, stuck/zombie processes) refreshes every 5 seconds and is not affected by the setting below, since scanning all processes is more expensive than reading global CPU/RAM totals.':
            'A lista de processos (que mais consomem CPU/RAM, processos travados/zumbis) é atualizada a cada 5 segundos e não é afetada pela configuração abaixo, já que escanear todos os processos é mais custoso do que ler os totais globais de CPU/RAM.',
        'Panel color mode': 'Modo de cor do painel',
        '"Auto" follows the system light/dark theme automatically. "Light" and "Dark" force a fixed color regardless of the current theme.':
            '"Automático" segue automaticamente o tema claro/escuro do sistema. "Claro" e "Escuro" forçam uma cor fixa independentemente do tema atual.',
        'Auto (follow system)': 'Automático (seguir sistema)',
        'Light': 'Claro',
        'Dark': 'Escuro',
        'Language': 'Idioma',
    },
};

/**
 * Native-script display names for the language picker, in a fixed display
 * order. Intentionally NOT translated — always shown the same way so the
 * user can recognize their language regardless of the current UI language.
 */
export const LANGUAGE_DISPLAY_NAMES = {
    auto: 'Automatic (system language)',
    en: 'English',
    tr: 'Türkçe',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    ru: 'Русский',
    pt: 'Português',
};

export const UI_LANGUAGE_VALUES = Object.keys(LANGUAGE_DISPLAY_NAMES);
