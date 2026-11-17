---
name: write-ui-adapter
description: UI Designer için kurum UI library kaynak kodundan adapter oluştur veya mevcut component eşlemesini tamamla. Native API, açıklamalı props, kısa görsel hint, slot, recipe, preview ve export eşlemesini gerçek MCP/browser kabulüyle doğrula. Tasarım JSON'u üretme veya uygulama ekranı yazma görevi için kullanılmaz.
---

# Kaynaktan doğrulanmış adapter

Bu skill UI Designer reposunda uygulanır. Kaynak library okunur; adapter bu repoda yazılır. Amaç yalnız çalışan renderer değil, başka bir agent'ın native kaynak kodunu okumadan doğru tasarım JSON'u üretebileceği katalogdur.

## 1. Girdileri ve gerçek sözleşmeyi doğrula

Önce repo kökündeki AGENTS.md, [onboarding](../../../docs/adapter-onboarding.md), [kabul listesi](../../../docs/component-adapter-checklist.md) ve [JSON kontratını](../../../docs/contracts/README.md) oku. Gerçek tipler: [ComponentMeta/UIAdapter/Recipe](../../../src/types/componentContract.ts), [PropSchema](../../../src/types/propSchema.ts), [PreviewValueConfig](../../../src/types/preview.ts). Mevcut tipte bulunmayan alanları varsayma.

Girdiler: erişilebilir library kaynak yolu, kurulu paket adı/sürümü, kaynak revizyonu, hedef component kapsamı. Kurulu manifest/public exports ile kaynak API'sini karşılaştır. İstenen component listesi verilmediyse container/text/button/input gibi temel rollerden sonlu bir başlangıç kapsamı belirle ve bildir; tüm exportları otomatik palete ekleme.

**Geçiş koşulu:** Kaynak okunabiliyor, paket erişilebilir ve sürüm/API ilişkisi açıklanabiliyor. Kaynak/paket uyuşmazlığı varsa ilgili eşlemeyi durdur; eksik sürümü/exportu açıkça bildir. Mevcut adapterı silerek veya başka library ile doldurarak ilerleme. Ayrı extraction/JSONL/form üretme.

## 2. Her component için kaynaktan eşleme çıkar

Her hedef component için şu sırayla oku: public export → props tipi → implementasyon → davranışı belirleyen wrapper/hook → varsa story/kullanım örneği. Örnekler implementasyonun yerine geçmez. Kaynak konumunu ve revizyonu çalışma notlarında tut; yalnız kaynakla doğrulanan özelliği destekleniyor say.

Her native prop'u aşağıdaki gruplardan birine ayır. Bu çalışma ayrı katalog dosyası gerektirmez; kararın sonucu metadata ve kısa teslim raporunda görünmelidir.

| Native girdi | Designer karşılığı |
| --- | --- |
| Desteklenen scalar görünüm/içerik | Uygun propsSchema tipi, açıklama, gerçek options/sınırlar ve başlangıç değeri |
| Controlled değer/değişim callback'i | previewValue ile gerçek prop/defaultProp/eventProp/read; callback'i JSON prop'u olarak sunma |
| ReactNode içeriği | Desteklenen named slot veya children; scalar ise gerçek kullanımına uygun scalar eşleme |
| Render callback / compound / tablo | Mevcut slot/collection/disclosure/table modeli; aile rehberini izle |
| Provider, DOM ref, event handler, stil taşıyıcı | Adapter renderer/provider/export sorumluluğu; çalıştırılabilir nesneyi JSON'a yazma |
| Desteklenmeyen ya da kaynağı belirsiz özellik | Katalogda vaat etme; eksik rolü ve kullanıcıya etkisini raporla |

[Prop yazım kurallarını ve örnekleri](references/prop-metadata.md) her prop eşlemesinde uygula. Native tip, Designer tipi ve export değeri farklıysa dönüşümü açıkla; desteklenmeyen union'ı keyfi string/select'e indirgeme. Kontrollü/uncontrolled değer, clear/null, false/0/boş metin ve omitted değerleri ayrı incele. Başlangıç değeri ile kullanıcı değiştikten sonraki runtime değeri karıştırılmamalı.

**Geçiş koşulu:** Her sunulan prop'un kaynağı, etkisi, değer alanı, başlangıcı ve native karşılığı biliniyor. Bilinmeyen bilgiyi isimden tahmin etme; o özelliği açık bırak ve bağımsız componentlere devam et.

## 3. Katalog metnini üç ayrı amaçla yaz

| Alan | Yazılacak içerik | Gönderildiği yer |
| --- | --- | --- |
| ComponentMeta.description | Bileşenin karşıladığı iş. Özelleşmiş bir türse genel bileşenden ayrılan kullanımını söyle. | Overview |
| ComponentMeta.visualHints | Farklı içeriklerde sabit kalan yapıyı ve benzerinden ayrılan işareti anlatan birkaç kısa gözlem | Overview |
| PropSchema.description | Prop'un yönettiği parça, değerlerin görünür etkisi, başlangıç ve varsa önkoşul | Seçilen component details |
| ComponentMeta.recipes | Gerekliyse belirli görünümün gerçek props/slot/children ile kurulma tarifi | Seçilen component details |

Kaynak veya çalışan örneklerde içerik, varyant ya da durum değiştiğinde neyin sabit kaldığına bak. İpucunu bileşenin adını bilmeyen birinin ekranda görebileceği dille yaz. Örneğin “Çizgi iki içerik grubu arasında uzanır, ortasında kısa bir metin olabilir” ayrı bir ayırıcıyı tarif eder. Bir yüzeyin dış kenarını takip eden çizgi ise o yüzeyin ipucuna aittir. Yalnız doğrulayabildiğin işareti yaz. Prop seçeneklerini ve kurulum adımlarını bileşen ayrıntılarında tut. Aynı görünüm birden fazla davranışa uyuyorsa tarifi hangi kanıtın geçerli kıldığını `when` alanında belirt.

Recipe, prop açıklamasının kopyası değildir. Native slot/compound yerleşimi veya birden çok prop'un birlikte kullanımı yanlış anlaşılabilecekse yaz. Sadece ihtiyaç olan tarifleri ekle. Alanlar: id, title, when, instructions, isteğe bağlı avoid/images ve geçerli DesignNode example. Example aynı component type'ının kendi alt ağacı olmalı; desteklenen props/slots kullanmalı. ReactNode/JSX/fonksiyon/PNG/base64 tasarım JSON'u değildir. Görsel dosya eklenecekse [recipe görsel sözleşmesini](../../../docs/designer-agent.md#recipe-referans-görselleri) izle; görsel zorunlu değildir.

**Geçiş koşulu:** Görsel olarak karışabilecek bir kullanımı bileşenin adını vermeden tarif et. Gerçek overview yanıtındaki ipuçlarıyla adayları bul. Yalnız bu adayların details yanıtında görünümü sağlayan varyantı, prop'u, slotu veya bileşimi gösterebilmelisin. Ayrım desteğin dışındaysa bu sınırı tarifte açık bırak.

## 4. Önce küçük bir çalışan adapter, sonra kapsamı büyüt

Kod `src/adapters/<kurum>/` altında; `src/adapters/index.ts` içindeki UI_ADAPTERS kaydı gerçek importlarla yapılır. [Arşiv](../../../archive/adapters/README.md) yalnız örnektir; oradan runtime import etme. Örneklerin native prop/event/helper isimlerini kurum API'sine kopyalama. Kurum paketi public girişlerinden import edilir; geliştiricinin mutlak kaynak yolu kalıcı dependency olmaz.

İkon paketi de bağlanacaksa [tek ikon kaynağı rehberini](../../../src/adapters/iconLibrary/README.md) izle; editör kontrol ikonları ile kurum içeriğinin ikonlarını ayır. Arşiv örneğini etkin kaynak sayma.

İlk dikey akış: container/text/button → ekleme/seçim → prop/layout → preview → kayıt/JSON → export. Sonra kapsam içindeki input/slot/compound/table/overlay ailelerini ekle. Tablo varsa [tablo rehberi](../../../docs/table-adapter-guide.md), boyutlandırmada [fill kontratı](../../../docs/fill-layout.md) geçerlidir.

Renderer rootRef/rootClassName/style/data-node-id değerlerini aynı ölçülebilir native DOM köküne bağlamalı. Değer/event, portal/provider/CSS, children/slots ve export birlikte uygulanır. Örneğin ReactNode alanı için slot şeması yazmak yeterli değildir: o slotun child ağacı native prop'a render edilmeli ve export aynı native prop'u üretmelidir. Input altındaki aksiyon native slotun içeriğiyse ayrı kardeş link üretme. JSON içinde callback saklama; mevcut slotRenderMode/slotArgumentNames mekanizmasını kullan.

Ortak core/editör/MCP içinde library adına göre dal açma. Kaynak library'yi değiştirme. Metadata tipi yetmiyorsa desteklenmeyen davranışı raporla; sırf kabulü geçmek için type cast, any, sahte prop veya no-op handler kullanma. Adapter importları MCP Node sürecinde de yüklenebilmelidir; modül başında browser global erişimine güvenme.

**Geçiş koşulu:** İlk akış hem browser hem MCP'de çalışıyor. Sonraki component aynı kurallarla tamamlanıyor; eksik bileşen çalışanmış gibi kataloglanmıyor.

## 5. Kanıtı gerçek çıktılardan al

Ortam için [installation](../../../installation/README.md) önkoşulları uygulanmış olmalı. Bu teslim branch'inde test runner yoktur; yeni test altyapısı kurma. Designer: `npm run build`, `npm run export:mcp -- /tam/yol/mcp`, `npm run dev`. MCP reposunda: `npm ci && npm run build && npm run start:backend`. Build geçmesi davranış kabulü değildir.

[Kabul listesinin](../../../docs/component-adapter-checklist.md) ilgili maddelerini tamamla. Ek olarak:

1. Gerçek MCP overview çağrısında yalnız aktif kurum adapterını ve component ad/kısa description/visualHints bilgisini kontrol et; recipeIndex/recipe gövdesi bulunmamalı.
2. Dönen contractRevision ile seçili componentTypes details çağrısı yap. Her sunulan prop için description, seçenek/sınır, varsayılan, slot/değer eşlemesinin kaynakla aynı olduğunu kontrol et. Başka component'in tarifini getirme. Tipte alan olması yeterli değil; gerçek tool yanıtında bulunmalı.
3. Her sunulan prop için default ve anlamlı bir farklı değer dene; boolean iki durum, select sunulan seçenekler, numeric sınırlar ve varsa null/clear/bağımlı prop koşullarını kapsa. Değerin JSON'da, gerçek native görünüm/preview'de ve exportta beklenen anlamı koruduğunu kontrol et. Bu kontrolleri geçen prop'u doğrulanmış say.
4. ReactNode/callback slotu varsa child ağacıyla dene: native yerleşim, slot sahipliği, preview ve TSX çıktısı aynı olmalı. Recipe varsa example'ını gerçek validator ile doğrula; instructions ile çelişen örneği teslim etme.
5. Gerçek MCP validate → import/update → applied/isPersisted → readback ve tek undo; kayıt/açma ve nested/flat/behavior tutarlılığı. Uygulanan işlem bilinmiyorsa yeni mutation ile kör tekrar yapma; receipt oku.
6. Üretilen TSX'i uygun bağımlılık/provider/CSS bulunan hedef veya geçici uygulamada build/browser ile kontrol et. Hedef ortam yoksa export kabulünü açık bırak; syntax incelemesini çalıştırılmış build gibi sunma.

Bir kontrol başarısızsa ilgili implementasyonu düzelt; kabul beklentisini gevşetme. Araç/paket/browser/MCP erişimi eksikse geçen kontrolleri ve açık kalanları ayrı yaz. Kurum proxy'si/iki kullanıcı kabulü yapılmadıysa deployment veya multi-user tamamlandı deme.

## 6. Teslim et

Kısa rapor: kaynak revizyonu + kurulu paket/sürüm; adapter kimliği; kapsam/eksik roller; component bazında metadata/renderer/preview/export/MCP kabul durumu ve kanıtı; kalan engeller. “Yazıldı” ile “gerçek ortamda doğrulandı” ayrı durumlar olmalı. Rehber/metadata tasarım yapan agent'a yeterli değilse teslim tamamlandı deme.

Bu skill commit/push/deploy izni vermez; geçerli kullanıcı talimatını izle. Sonraki düzeltmede mevcut tasarımları ve kurum adapterını koru.
