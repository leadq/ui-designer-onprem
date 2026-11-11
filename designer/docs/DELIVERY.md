# On-prem teslimi — 6 Kasım 2026

Taban: `674ae841c11bd747d8571a0b575d2ae49ac918f3` (`main`). Bu branch tabanın doğrudan çocuğu olan tek teslim commitidir. Önceki teslim ucu `codex/backup-onprem-0f476a8` yerel ref’inde korunur.

Main’in yeni kaynak yerleşimi ve editör ikon primitive’i korunur. Üç UI adapterı `archive/adapters`, tasarım ikon örnekleri `archive/iconLibrary` altındadır. Aktif `UI_ADAPTERS` boş, `DESIGN_ICON_LIBRARY` null’dır; kuruma ait paket/env/config/adapter eşlemesi kurulmadan çalışan kurum uygulaması kabulü yapılmaz.

İkon kurulumunun kısa yolu: [kurum ikon kaynağı](../src/adapters/iconLibrary/README.md). Genel kurulum: [installation](../installation/README.md).

Yerel doğrulama tamamlandı:

- Main: 159/159 sabit kabul, tam check 598 Jest + 30 Chromium fixture, iki yeni form üç adapterda 6/6 ve gerçek HTTP MCP/WS/IDB paketi 8/8 geçti. UI/MCP nested/flat/behavior dosyaları aynı revizyonda eşleşti.
- Teslim: bağımsız geçici kopyada örnek kurum UI adapterıyla null ve tek SVG ikon kaynağı ayrı ayrı strict TypeScript, SDK frontend/backend build ve gerçek MCP SDK katalog/kontrat/rehber/revizyon/disk round-trip kontrolünden geçti; 6/6 Jest, 12/12 kaynak grafiği kontrolü. Yapılandırılmamış teslim yalnız beklenen adapter guard’ıyla durdu.
- 189 arşiv kaynak/asset dosyası yeni main ile byte eşit; iki form örneği ayrıca korundu. Asıl bağımlılık hash’leri değişmedi; geçici kopya silindi. Teslim ağacına test altyapısı eklenmedi.

Kurum paketleri yerine yerel kurulu SDK ve sentetik adapter kullanıldı. Temiz Nexus kurulumu, gerçek kurum adapterı/browser kabulü, kurum origin/TLS/proxy, IDE/model ve production deploy bu yerel kontrolün kapsamı değildir.
