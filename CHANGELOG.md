# Değişiklik notu — 18 Kasım 2026

**Başlangıç sürümü** `2b05435` · 16 Kasım 2026, 22.14 Türkiye saati.

**Hedef** 18 Kasım yerel teslimi. `547e819` teslimindeki düzeltmeyi, prompt/adapter iyileştirmelerini ve teslim belgelerinin düzenlenmesini kapsar.

Kullanıcı, başlangıçtaki 16 Kasım akşam teslimini kurum projesine uyguladığını doğruladı. O teslim 113 dosyalık editör stil izolasyonunu ve `scripts/update.mjs` düzeltmelerini içeriyor.

## Kısa özet

- Ekrandaki tekrar, hizalama ve sınırlar üzerinden bileşen adaylarını bulma ve metin/ikon/kenarlığın hangi prop veya slota ait olduğunu doğrulama kuralları geliştirildi.
- Adapter açıklamaları, `visualHints`, prop açıklamaları ve `recipes` için kurum içi ajana verilebilecek rehber ve örnekler eklendi.
- Editör kaynaklarında iki dosya değişti. Prototip önizlemesinin import sırası CSS sıralama uyarısı için düzeltildi. Authoring kontratındaki tarif metni güncel katalog akışına uyarlandı.
- Üretici ajan yönergeleri teslimden çıkarıldı. Güncelleme aracı kurumun mevcut ajan yönergelerini koruyor. Her ZIP için kısa değişiklik notu hazırlanıyor.

## Ekipte birleştirme

**15 mevcut dosya değişti, 3 yeni dosya eklendi, 2 dosya teslimden çıkarıldı.** Tablodaki `Değişti` yolları ekipte de düzenlendiyse iki tarafın değişikliklerini birleştir. Ekip dosyası başlangıç sürümüyle aynıysa güncel dosyayı al. `Yeni` yollarının ekipte kullanılıp kullanılmadığını kontrol et. Gerçek içerik çakışması, kurum kopyasıyla karşılaştırılarak belirlenebilir.

Taşıma aracı ekipteki `mcp/prompts/` içeriğini korur. Aşağıdaki iki promptun yeniliklerini kurum kurallarıyla birleştir. `archive/adapters/` örneklerindeki metadata'yı kurumun aktif adapterına uyarlamak için katalog rehberini kullan. [Adapter katalog rehberi](designer/docs/adapter-catalog-metadata.md).

Teslimden çıkarılan `AGENTS.md` dosyaları üreticinin yönergeleridir. Ekip kendi yönergelerini yönetebilir. Taşıma aracı mevcut projenin kök, `designer/` ve `mcp/` altındaki `AGENTS.md` dosyalarını korur.

## Dosya bazında değişiklikler

Yollar ZIP köküne göredir. Satırlar hedef dosyadaki eklenen/değişen aralıkları gösterir. `Eski` işaretli satır başlangıç sürümünden kaldırılmıştır.

| Dosya | Durum | Satır | Kısa değişiklik |
| --- | --- | --- | --- |
| `mcp/prompts/shared/screen-understanding.md` | Değişti | 32–40, 72, 75, 82, 90, 98 | Ekranlar arası tekrar, bileşen adayları ve parça sahipliğini gerçek katalogdan doğrulama yöntemi eklendi. |
| `mcp/prompts/shared/semantic-design.md` | Değişti | 60–61 | Recipe ve referans görseli seçimi overview/details akışına uyarlandı. |
| `mcp/designer/contracts/json-field-reference.md` | Değişti | 244, 250–251 | Recipe keşfi ve görsel okuma açıklamaları güncel MCP akışına uyarlandı. |
| `designer/src/utils/designer/authoringContract/constants.ts` | Değişti | 29 | Kontrattaki recipe kuralı, adayları overview'dan bulup details ile doğrulamayı anlatıyor. |
| `designer/src/components/PrototypePreview/index.tsx` | Değişti | 3 eklendi, eski 12 kaldırıldı | `PreviewScenarios` import'u Canvas bileşenlerinden önce yüklenerek CSS sıra uyarısını gideriyor. |
| `designer/.github/skills/write-ui-adapter/SKILL.md` | Değişti | 41–43, 46, 50 | Metadata alanlarının amacı ve bileşen adını bilmeden katalogdan bulma kabulü netleştirildi. |
| `designer/docs/adapter-catalog-metadata.md` | Yeni | 1–72 | Kurum ajanına verilecek metadata/recipe güncelleme ve MCP doğrulama rehberi eklendi. |
| `designer/docs/component-adapter-checklist.md` | Değişti | 12 | Görsel tariften aday bulma ve gerçek prop/slot/recipe ile doğrulama kabulü eklendi. |
| `designer/docs/README.md` | Değişti | 8 | Yeni katalog rehberine bağlantı eklendi. |
| `designer/archive/adapters/mantine/button.ts` | Değişti | 12–13, 24 | Eylem, düğmenin kendi kenarlığı ve varyant etkisi açıklamaları eklendi. |
| `designer/archive/adapters/mantine/card.ts` | Değişti | 14–16, 47–50 | Ortak yüzey ve dış kenarlığın sahipliği, `withBorder` açıklamasıyla belirtildi. |
| `designer/archive/adapters/mantine/textInput.ts` | Değişti | 12, 19–22, 24–27 | Tekrarlanan alan hizası, etiketi ve yardım metninin sahipliği açıklandı. |
| `designer/archive/adapters/shared/extendedMeta/getExtendedDefinitions.ts` | Değişti | 4, 36, 69–71, 74, 79, 142–143, 145–147 | Ortak tanımlara metadata desteği, segmented/divider açıklamaları ve tek seçim recipe bağlantısı eklendi. |
| `designer/archive/adapters/shared/recipes/segmented/single-choice/recipe.ts` | Yeni | 1–23 | Bitişik seçenekleri tek değer seçen native kontrolle kuran tarif eklendi. |
| `designer/installation/README.md` | Değişti | 61 | Adapter kurulum promptu doğrudan teslimdeki skill ve kabul koşullarına yönlendirildi. |
| `AGENTS.md` | Çıkarıldı | Eski 1–3 | Üretici çalışma yönergeleri on-prem Git ve ZIP kapsamından çıkarıldı. |
| `designer/AGENTS.md` | Çıkarıldı | Eski 1–24 | Üretici ajan yönergeleri teslimden çıkarıldı, kurumun adapter rehberleri korunuyor. |
| `scripts/update.mjs` | Değişti | 37 | Mevcut AGENTS.md dosyaları kurum ayarlarıyla birlikte taşınıyor. |
| `UPDATE.md` | Değişti | 3–4, 41 | Changelog bağlantısı ve kurumun ajan yönergelerinin korunması açıklaması eklendi. |
| `CHANGELOG.md` | Yeni | Tamamı | Bu teslimin kısa özeti, dosya listesi ve birleştirme bilgisi eklendi. |
