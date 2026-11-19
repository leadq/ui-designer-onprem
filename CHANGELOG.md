# Değişiklik notu — 19 Kasım 2026 · kurulum rehberi

**Başlangıç:** `8f11800` · son uygulandığı esas alınan 18 Kasım ikon metadata teslimi. 19 Kasım ilk belge teslimi `ec66bcf` sonrasında rehber genişletildi; o teslimin kurumda uygulandığı bildirilmediği için başlangıç korunuyor.

**Yalnız dokümantasyon değişti.** [SETUP.md](SETUP.md) paketler, yerel/sunucu ayarları, IDE/clientId kullanımı ve gerçek tasarım yazma/geri okuma/kayıt kabulünü içeriyor. Paket, export, bağlantı, MCP oturumu, depolama ve render sorunlarının çözümü aynı dosyanın sonunda. Editör/core, adapterlar, MCP çalışma kodu, prompt klasörü ve güncelleme scripti değişmedi.

**13 mevcut dosya değişti, 1 dosya eklendi.** Mevcut yollar ekipte özelleştirildiyse birleştirin; yeni SETUP yolu da ekipte kullanılmış olabilir. Kurum kopyası burada bulunmadığından gerçek içerik çakışması doğrulanmadı.

Satırlar yeni dosyaya aittir; yalnız silinen bölümler “silinen eski” olarak işaretlendi.

| Dosya | Durum | Satır | Kısa değişiklik |
| --- | --- | --- | --- |
| `SETUP.md` | Yeni | 1–182 | Paketler, yerel/sunucu env ve IDE adımları; gerçek tasarım kabulü, MCP dağıtım içeriği ve hata çözümü tek rehberde toplandı. |
| `README.md` | Değişti | 5, 7, 9–11, silinen eski 32–35 | Kurulumun ana girişi SETUP oldu; tekrarlanan bağlantı açıklamaları yönlendirildi. |
| `UPDATE.md` | Değişti | 69, 71 | Taşıma sonrası env/build/export/IDE kabulü aynı SETUP sırasına bağlandı. |
| `designer/README.md` | Değişti | 3 | Yeni proje kurulum rehberine doğrudan bağlantı eklendi. |
| `designer/docs/README.md` | Değişti | 5 | Doküman haritasının kurulum satırı yeni rehbere yönlendirildi. |
| `designer/docs/adapter-onboarding.md` | Değişti | 41 | MCP env yükleme ve build/export sırası kurulum rehberine yönlendirildi. |
| `designer/docs/backend-mcp.md` | Değişti | 5, 20 | Bağlantı ayarları ve çalıştırma için doğrudan SETUP yönlendirmesi yapıldı. |
| `designer/docs/connection.md` | Değişti | 3–4 | Sıralı kurulum ile teknik bağlantı ayrıntılarının ayrımı açıklandı. |
| `designer/docs/designer-agent.md` | Değişti | 29, 31–32 | Yerel/uzak MCP ve isteğe bağlı ajan şablonu ayrımı netleştirildi; eski başlatma tarifi düzeltildi. |
| `designer/docs/fill-layout.md` | Değişti | 10 | Kaldırılmış core/fillLayout.ts atfı güncel yerleşim kaynağına düzeltildi. |
| `designer/docs/table-adapter-guide.md` | Değişti | 129 | Test komutlarının kaynak geliştirme reposuna ait olduğu açıklandı; kurum kurulumu/kabulü yönlendirildi. |
| `designer/installation/README.md` | Değişti | 1, 3–5, 14, silinen eski 36–45, 40, 59, 70, 72, 74 | Paket/adapter hazırlık sırası düzeltildi; env/build/IDE tekrarları yeni rehbere yönlendirildi. |
| `mcp/README.md` | Değişti | 3–4, 7, 9, 11 | MCP .env yükleme davranışı ve bağımsız repo başlatma komutu belirtildi. |
| `CHANGELOG.md` | Değişti | Tamamı | Son uygulanan başlangıç korunarak kurulum tamamlamaları dahil dosya özeti yenilendi. |
