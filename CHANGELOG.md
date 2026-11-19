# Değişiklik notu — 19 Kasım 2026 · kurulum rehberi

**Başlangıç:** `8f11800` · son paylaşılan 18 Kasım ikon metadata teslimi esas alındı; kullanıcı kurum bağlantısının çalıştığını doğruladı.

**Yalnız dokümantasyon değişti.** Paket kurulumu, yerel/sunucu ayarları, IDE bağlantısı ve troubleshooting [SETUP.md](SETUP.md) içinde adım adım toplandı. MCP'nin `.env` dosyasını otomatik okumadığı ve kopyalanan kimliğin nasıl kullanılacağı açıklandı. Editör/core, adapterlar, MCP çalışma kodu, prompt klasörü ve güncelleme scripti değişmedi.

**7 mevcut dosya değişti, 1 dosya eklendi.** Mevcut yollar ekipte özelleştirildiyse birleştirin; yeni `SETUP.md` yolu da ekipte kullanılmış olabilir. Kurum kopyası burada bulunmadığından gerçek içerik çakışması doğrulanmadı.

Satırlar yeni dosyaya aittir; yalnız silinen bölümler “silinen eski” olarak işaretlendi.

| Dosya | Durum | Satır | Kısa değişiklik |
| --- | --- | --- | --- |
| `SETUP.md` | Yeni | 1–131 | Paketler, yerel/sunucu ayarları, IDE/clientId kontrolleri ve kısa hata çözüm tablosu tek rehberde toplandı. |
| `README.md` | Değişti | 5, 7, 9–11, silinen eski 32–35 | Kurulumun ana girişi SETUP oldu; tekrarlanan çalıştırma ve bağlantı açıklamaları ilgili rehberlere yönlendirildi. |
| `designer/README.md` | Değişti | 3 | Yeni proje kurulum rehberine doğrudan bağlantı eklendi. |
| `designer/docs/README.md` | Değişti | 5 | Doküman haritasının kurulum satırı yeni rehbere yönlendirildi. |
| `designer/docs/connection.md` | Değişti | 3–4 | Sıralı kurulum rehberi ile teknik bağlantı ayrıntılarının ayrımı açıklandı. |
| `designer/installation/README.md` | Değişti | 1, 3–5, 14, silinen eski 36–45, 40, 59, 70, 72, 74 | Paket/adapter hazırlık sırası düzeltildi; env/build/IDE tekrarları yeni rehbere yönlendirildi. |
| `mcp/README.md` | Değişti | 3–4, 7, 9, 11 | MCP .env yükleme davranışı açıklandı; yerel/sunucu rehberi ve bağımsız repo başlatma komutu belirtildi. |
| `CHANGELOG.md` | Değişti | Tamamı | Başlangıç 8f11800 alındı; bu dokümantasyon tesliminin özeti yazıldı. |
