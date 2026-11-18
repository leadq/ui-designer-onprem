# Kurum teslimi belgeleri

| İş | Başlangıç |
| --- | --- |
| Kurulum ve ayrı sunucu dağıtımı | [Ana README](../README.md), [backend](backend-mcp.md) |
| Nexus/SDK farkları | [Paket rehberi](sdk-toolchain.md) |
| Kurum library’sini bağlamak | [Adapter](adapter-onboarding.md), [kabul](component-adapter-checklist.md) |
| Mevcut adapterın açıklamalarını, görsel ipuçlarını ve kullanım tariflerini güncellemek | [Kurum içi ajana verilecek katalog rehberi](adapter-catalog-metadata.md) |
| Library kaynağından adapter yazdırmak | [Adapter skill](../.github/skills/write-ui-adapter/SKILL.md), [Doğrudan kaynak promptu](../installation/README.md#adim-2), [API eşleme noktaları](adapter-onboarding.md) |
| İkon açıklama, görsel ipucu ve tariflerini tanımlamak | [İkon metadata rehberi](icon-library-metadata.md) |
| Table ve compound eşlemesi | [Tablo](table-adapter-guide.md), [renk](adapter-colors.md) |
| JSON/state/flow/preview anlamı | [Kontrat](contracts/README.md), [fill](fill-layout.md), [flow](flow-authoring.md) |
| IDE ve hedef React uygulaması | [Kurulum adımları](../installation/README.md), [Designer agent](designer-agent.md), [JSON alanları](agent-handoff/json-fields.md), [React üretimi](agent-handoff/react-generation.md) |
| Bu teslimin kapsamı ve kanıtı | [DELIVERY](DELIVERY.md) |

Geliştirme testlerine ilişkin tarihsel atıflar bu branch’te o dosya veya komutun bulunduğu anlamına gelmez. Düzenlenebilir MCP rehberleri ../mcp/prompts, teknik kontratlar ../mcp/designer/contracts altındadır. [Prompt düzeni ve otomatik keşif](../../mcp/prompts/README.md).


- [Kurum tasarım ikon kaynağı](../src/adapters/iconLibrary/README.md): tek aktif kurum kaydı, gerçek native yükleme/export ve pasif arşiv örnekleri; editör kontrol ikonları ayrıdır.

Kod üretimi ve mimari kuralları `mcp/prompts/code-gen/` altında, `architecture.md` ve `coding-standards.md` gibi dosyalarda tutulur.
