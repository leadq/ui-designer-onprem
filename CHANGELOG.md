# Değişiklik notu — 18 Kasım 2026 · ikon metadata

**Başlangıç:** `0a457b7` · kullanıcının uyguladığı 18 Kasım teslimi / migrated kopyası esas alındı.

İkonun `description`, `visualHints` ve `recipes` bilgileri artık `IconLibrary.componentMeta` alanından okunuyor. Böylece kurum bilgisi ZIP güncellemesinde korunan adapter klasöründe tutulabiliyor. **Core tarafında ikon tipi ve ortak registry değişti.** İkon seçimi, boyutu, native exportu ve tasarım JSON alanları aynı kaldı; güncelleme scriptinin davranışı değişmedi.

**Ekipte gereken ilk işlem:** Eski kurum projesindeki `designIconRegistry.ts` içine yazılmış bu üç alanı, tarif dosyaları/importlarıyla birlikte aktif ikon adapterının `componentMeta` alanına bir kez taşıyın. Yeni teslimin ortak registry dosyasını kullanın. Script eski registry içindeki serbest kodu otomatik birleştirmez. [Kurum ajanına verilecek taşıma rehberi](designer/docs/icon-library-metadata.md).

**8 mevcut dosya değişti, 1 dosya eklendi.** Aşağıdaki mevcut yollar ekipte özelleştirilmişse içeriklerini karşılaştırın. Yeni rehberin yolu da ekipte kullanılmış olabilir. Kurum dosyaları bu repoda bulunmadığından gerçek içerik çakışmaları burada doğrulanmadı.

Yollar ZIP köküne, satırlar bu teslimdeki yeni dosyaya aittir.

| Dosya | Durum | Satır | Kısa değişiklik |
| --- | --- | --- | --- |
| `designer/src/types/iconLibrary.ts` | Değişti | 2, 20–21 | İkon adapterına isteğe bağlı componentMeta alanı eklendi. |
| `designer/src/registry/designIconRegistry.ts` | Değişti | 1, 18, 20–21 | Ortak icon kaydı açıklama, görsel ipucu ve tarifleri aktif ikon adapterından okuyor. |
| `designer/docs/icon-library-metadata.md` | Yeni | 1–50 | Kurumun metadata tanımı, eski registry bilgisini taşıma ve MCP doğrulaması anlatılıyor. |
| `designer/docs/adapter-catalog-metadata.md` | Değişti | 8–9 | Ortak icon için doğru tanım yeri ve taşıma rehberi belirtildi. |
| `designer/src/adapters/iconLibrary/README.md` | Değişti | 15–16 | Yeni componentMeta alanına ve ilk taşıma rehberine bağlantı eklendi. |
| `designer/docs/contracts/README.md` | Değişti | 652–653 | İkon metadata sahipliği açıklandı; tasarım JSON alanları aynı kaldı. |
| `designer/docs/README.md` | Değişti | 10 | İkon metadata rehberi başlangıç haritasına eklendi. |
| `designer/archive/iconLibrary/lucide/index.ts` | Değişti | 10–32 | Pasif örnek ikon adapterına açıklama, görsel ipuçları ve bağımsız simge tarifi eklendi. |
| `CHANGELOG.md` | Değişti | Tamamı | Başlangıç son uygulanan 18 Kasım teslimine alındı; bu düzeltmenin dosya özeti yazıldı. |
