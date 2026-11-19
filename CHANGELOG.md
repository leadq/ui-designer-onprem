# Değişiklik notu — 19 Kasım 2026 · kurulum rehberi

**Başlangıç:** `8f11800` · son uygulandığı esas alınan 18 Kasım ikon metadata teslimi. 19 Kasım ilk belge teslimi `ec66bcf` sonrasında rehber genişletildi; o teslimin kurumda uygulandığı bildirilmediği için başlangıç korunuyor.

**Yalnız dokümantasyon değişti.** [SETUP.md](SETUP.md) paketler, yerel/sunucu ayarları, IDE/clientId kullanımı ve gerçek tasarım yazma/geri okuma/kayıt kabulünü içeriyor. Paket, export, bağlantı, MCP oturumu, depolama ve render sorunlarının çözümü aynı dosyanın sonunda. Editör/core, adapterlar, MCP çalışma kodu, prompt klasörü ve güncelleme scripti değişmedi.

**11 mevcut dosya değişti, 1 dosya eklendi.** Mevcut yollar ekipte özelleştirildiyse birleştirin; yeni SETUP yolu da ekipte kullanılmış olabilir. Kurum kopyası burada bulunmadığından gerçek içerik çakışması doğrulanmadı.

Satırlar yeni dosyaya aittir; yalnız silinen bölümler “silinen eski” olarak işaretlendi.

| Dosya | Durum | Satır | Kısa değişiklik |
| --- | --- | --- | --- |
| `SETUP.md` | Yeni | 1–182 | Paketler, yerel/sunucu env ve IDE adımları; gerçek tasarım kabulü, MCP dağıtım içeriği ve hata çözümü tek rehberde toplandı. |
| `README.md` | Yeni | 1–15 | Kurulumun ana girişi SETUP oldu; tekrarlanan bağlantı açıklamaları yönlendirildi. |
| `UPDATE.md` | Yeni | 1–71 | Taşıma sonrası env/build/export/IDE kabulü aynı SETUP sırasına bağlandı. |
| `designer/README.md` | Yeni | 1–7 | Yeni proje kurulum rehberine doğrudan bağlantı eklendi. |
| `designer/docs/README.md` | Yeni | 1–21 | Doküman haritasının kurulum satırı yeni rehbere yönlendirildi. |
| `designer/docs/connection.md` | Yeni | 1–59 | Sıralı kurulum ile teknik bağlantı ayrıntılarının ayrımı açıklandı. |
| `designer/docs/adapter-onboarding.md` | Yeni | 1–47 | MCP env yükleme ve build/export sırası kurulum rehberine yönlendirildi. |
| `designer/docs/designer-agent.md` | Yeni | 1–297 | Yerel/uzak MCP ve isteğe bağlı ajan şablonu ayrımı netleştirildi; eski başlatma tarifi düzeltildi. |
| `designer/docs/table-adapter-guide.md` | Yeni | 1–178 | Test komutlarının kaynak geliştirme reposuna ait olduğu açıklandı; kurum kurulumu/kabulü yönlendirildi. |
| `designer/installation/README.md` | Yeni | 1–88 | Paket/adapter hazırlık sırası düzeltildi; env/build/IDE tekrarları yeni rehbere yönlendirildi. |
| `mcp/README.md` | Yeni | 1–27 | MCP .env yükleme davranışı ve bağımsız repo başlatma komutu belirtildi. |
| `CHANGELOG.md` | Değişti | Tamamı | Son uygulanan başlangıç korunarak kurulum tamamlamaları dahil dosya özeti yenilendi. |
