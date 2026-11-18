# Tasarım ve davranış kontratı

> Bu teknik rehberdeki test komutları geliştirme reposuna aittir. Teslim branch’inde test runner yoktur; kurum adapterı kabulü docs/component-adapter-checklist.md üzerinden yapılır.

Boyutlandırma ve parent'a göre kalan alan paylaşımı: [Alanı doldur sözleşmesi](../fill-layout.md).

Alanların kod üretimindeki karşılığı: [JSON alan sözlüğü](../agent-handoff/json-fields.md) ve [React üretim tarifi](../agent-handoff/react-generation.md). Bunlar bu sözleşmenin açıklamalı tüketici rehberleridir; kurum mimarisini veya native adapter API'sini yeniden tanımlamaz. MCP rehber kimlikleri: `json-field-reference`, `react-generation`.

## Agent rehber keşfi ve template tamamlama (18 Ekim 2026)

MCP mode=basic|detailed ile kapsamı, phase/source ile iki aşamalı ekran anlama ve uygulama keşfini sağlar; JSON belge şemasını değiştirmez. Basic stratejiye dayalı form/wizard altyapısını da kapsar; açık seçim yoksa tüm güncel ekranlar incelenir. Çıkarılan adım planı açık JSON ilişkilerinin yerine geçmez, belgeyi otomatik değiştirmez. Ekran özeti, geçici veri çıkarımı ve scaffold completionChecklist tasarım node alanları değildir. [MCP giriş/varsayılan/geri uyumluluk kontratı](../designer-agent.md#ekran-anlama-ve-şablon-tamamlama-kontratı-190), screen-understanding (MCP reposunda `prompts/shared/screen-understanding.md`), data-inference (MCP reposunda `prompts/code-gen/data-inference.md`), template-completion (MCP reposunda `prompts/code-gen/template-completion.md`).

## Katalog keşfi

`get_design_catalog(adapterId)` ve `get_design_contract(phase: "overview")` bileşenleri type/ad/kısa description/visualHints/category/isContainer özetiyle listeler. `visualHints` yalnız görünür şekli ayırt eden kısa tanıma ipuçlarıdır; uygulama tarifi veya gizli davranış kanıtı değildir. Recipe indeksi ve recipe içerikleri overview içinde gönderilmez. Agent kullanacağı veya seçiminden emin olmadığı adayları `componentTypes` ile ister; detay yanıtı yalnız bu bileşenlerin visualHints/recipes/props/default/slot/export bilgisini içerir. Tüm detaylar açık `allComponents: true` isteğiyle alınabilir. Bu ayrım MCP keşif yanıtına aittir; tasarım JSON şeması ve native renderer davranışı değişmez.

`PropSchema.description` isteğe bağlı, seri hale getirilebilir katalog metadata’sıdır; prop etkisini, seçenek anlamlarını ve koşullarını açıklar. Seçili component details içinde propsSchema ile taşınır; tasarım JSON’una yeni alan veya yeni prop eklemez, validator değer kurallarını değiştirmez. Yeni kurum adapterının sunulan prop’ları için skill bu açıklamayı ister.

## Referans görsel ve MCP ekleme (15 Ekim 2026)

Referanslar ayrı IndexedDB ikili PNG kayıtlarıdır; DesignNode veya tasarım JSON alanı değildir.
MCP `import_design` doğrulanmış belgedeki yeni flow/frame köklerini aktif session/editöre ekler;
mevcut ekranları, sayfa metadata'sını ve kayıtlı tasarımları değiştirmez. İç referanslarıyla birlikte
ID'ler yeniden eşlenir ve işlem tek undo adımıdır. JSON schema version ile bridge snapshot
version farklıdır; değişmeyen içeriğin tekrar gönderilmesi snapshot version'ı artırmaz.
Bekleyen istek uygulanmış sayılmaz; tarayıcı `applied` ACK'i gerekir.
[Taşıma, limit, retry ve saklama sözleşmesi](../designer-agent.md#referans-saklama-ve-yazma-sınırı) ·
Agent adımları (MCP reposunda `designer/contracts/reference-images.md`).

## Boşluk yazımı ve editör sunumu (14 Ekim 2026)

- Toplu `padding`/`margin` yazarken aynı katmandaki dört kenar anahtarını kaldırın. Her stil
  katmanı birleştirilirken shorthand o grubun önceki katmanlardan gelen kenarlarını temizler;
  sonra aynı katmanın açık kenar değerleri uygulanır. Küçük boyut override'ları bu kurala dahildir.
- 21 Ekim kullanıcı kararı: üstteki ortak değer ile custom kenar modu birbirini dışlar.
  Custom moda geçerken mevcut çözülmüş boşluk dört kenara aktarılır, shorthand kaldırılır ve
  yalnız seçilen kenar değişir. Dört kenar birlikte üst katmandan gelen shorthand'ı da devreden çıkarır.
  Custom alanı boşaltmak o kenarı 0px yapar; ortak ayar geri etkinleşmez. Ortak değer seçimi
  dört kenarı kaldırır. Bölümü açmak veri değiştirmez. Eski mixed belgeler okunur; otomatik göç yoktur.
  Renderer React DOM'a yalnız çözülmüş kenarları geçirir; native prop varsayılanını adapter bildirir.
- Ölçüler sayı (px) veya CSS string'idir. 4 px adımlı 0–120 seçenekleri UI tercihidir,
  şema sınırı değildir; margin `"auto"` olabilir. `"Özel Değerler"` gibi UI metinleri kaydedilmez.
  Tam JSON'da kaldırılmış alanlar atlanır; `undefined` geçerli JSON değildir.
- Yeni şema alanı veya sürüm gerekmez. Panel açık/kapalı hali, focus/border, klavye yardımı,
  frame başlığının zoom telafisi ve editör yüzeyinin 960px minimumu tasarım JSON'una yazılmaz.
- MCP kullanım örnekleri: layout rehberi (MCP reposunda `designer/contracts/layout.md`).
  Makineye sunulan özet: [authoringContract](../../src/utils/designer/authoringContract/index.ts).

8 Ekim 2026. Bu belge dosyaların anlamını ve preview yürütme kurallarını tanımlar. Uygulama mimarisi dönüştürme kuralları içermez.

## Sürümler ve kaynaklar

| Veri | Sürüm | Kaynak |
| --- | --- | --- |
| Nested tasarım | `version: 14` | `src/utils/designDocument/index.ts`, `src/types/document.ts` |
| Flat tasarım | `format: "ui-design/flat"`, `version: 1`, `designVersion: 14` | `src/utils/flatDocument/index.ts` |
| Davranış manifesti | `version: 5`, `execution: "declarative-preview"` | `src/utils/flows/flowManifest/index.ts` |
| Görünürlük işlemleri | Manifestteki `effects` | `src/utils/flows/flowModel/index.ts` |
| Sayfa/form kapsamları | Manifestteki `pages`, `formScopes` | `src/utils/flows/flowScopes/index.ts` |

Nested ve flat aynı normalize edilmiş tasarımı temsil eder. Editörde nested model tutulur; flat indeks ve manifest dışa aktarılırken türetilir. Her iki tam tasarım dosyası import edilebilir. Tek başına manifest import edilemez.

### Export tüketicisi kararı — 19 Ekim 2026

“JSON dışa aktar” nested/tree `.json`, “Düz JSON + kontrat indir” `.flat.json` üretir; ayrı işlemlerdir. Saklama/editör kaynağı nested, agent'a dosya tesliminde tercih tek güncel flat + behavior'dır. Her iki tam biçim import edilebilir; ikisini birlikte zorunlu kılmıyoruz. Eski türetilmiş behavior importta doğrulanmış sayılmaz; güncel export veya validate_design(output: "flat") ile yeniden üret. Teslim ayrıntıları (geliştirme reposundaki kaynak), karar (geliştirme reposundaki kaynak).

## 1. Nested tasarım

Üst alanlar: `version`, `adapterId`, `pageName`, `pageNotes`, `pageAnnotations`, `nodes`, isteğe bağlı `savedDesigns`.

Her node şunları taşır:

| Alan | Anlam |
| --- | --- |
| `id`, `type`, `label?` | Kalıcı kimlik, adapter registry bileşen türü, kullanıcı ismi. Label kimlik değildir. |
| Bileşen çözümleme | `adapterId` + node `type` gerçek registry bileşenini belirler. Tree/ekran adı değiştirme yalnızca `label` alanını günceller; `type`, `props`, `children` ve `slots` korunur. Nested ve flat JSON aynı ayrımı taşır. |
| `props`, `style`, `responsiveStyles?`, `responsiveProps?` | Native prop değerleri, temel ve breakpoint stilleri. |
| `children` | Sıralı normal alt bileşenler. |
| `slots?` | Slot adı → sıralı inline node dizisi. |
| `notes?`, `annotations?` | Serbest notlar ve türlenmiş gereksinim açıklamaları. Çalıştırılabilir kod değildir. |
| `interactions?` | Bu node'dan başlayan sıralı kurallar. |
| `prototypeHidden?` | Önizleme başlarken gizleme tercihi. |
| `flow?` | Ekran grubunun başlangıcı ve frame/modal kimlikleri. Yeni belgelerde `layout: "root"`. |
| `overlay?` | Designer modalının sahipliği ve görünüm ayarları. |

Ekran boyutu anahtarları: `xl` = 1440 px ve üzeri (temel `style`), `wide` = 1200–1439 px, `lg` = 1024–1199 px, `md` = 768–1023 px, `sm` = 576–767 px, `xs` = 576 px altı (375 px hazır seçimi). Küçük ekranlar temel stilden başlayıp `wide → lg → md → sm → xs` sırasındaki ilgili override'ları devralır. 1200 px için bağımsız düzen `responsiveStyles.wide` altında saklanır; bu alan bulunmayan eski belgeler temel stillerini kullanmaya devam eder. Seçilen bağlı görünümün genişliği Özellikler/Düzen panelinin kapsamını belirler; diğer satırlar kendi genişliğinde kalır.

`flow = { layout: "root", startScreenId, screens: [{ nodeId, kind: "screen" | "overlay" }] }`. Normal frame UI'da frame olarak adlandırılır; kontratta geriye uyum için `screen` terimi kullanılır. `startScreenId` normal bir frame'i göstermelidir; normal frame yoksa boş string olur. Ekran grubu bir form/router türü taşımaz.

`savedDesigns = [{ id, name, nodes }]`: her kayıt ayrı node kimliği alanıdır. Ana tasarımda ve kayıtlı tasarımda aynı node ID'si bulunabilir; aynı ağaç içinde tekrarlanamaz. Slot prop'ları kayıtlı tasarım kimliğini veya inline içeriği belirtir. Tekrar eden item renderer örnekleri ana node tablosunda satır başına kopyalanmaz; veri ve şablon tanımı korunur.

## 2. Flat tasarım

Üst metadata nested ile aynıdır. `nodes` yerine:

| Alan | Anlam |
| --- | --- |
| `rootIds` | Köklerin sıralı kimlik dizisi. |
| `nodesById` | ID → tam node kaydı. |
| `nodesById[id].childIds` | Normal çocukların sıralı kimlikleri. |
| `slotChildIds?` | Slot adı → sıralı inline çocuk kimlikleri. |
| `parentId` | Normal/slot çocuğunun sahibi; kökte `null`. |
| `slotKey` | Inline slot çocuğunda slot adı; normal çocuk veya kökte `null`. |
| `index` | İlgili `rootIds`, `childIds` veya slot dizisindeki sıfır tabanlı sıra. |
| `behavior` | Aşağıdaki manifest v5; türetilmiş salt okunur görünüm. |

Diğer node alanları (props, stiller, notlar, bağlantılar, modal/flow bilgisi dahil) aynen bulunur. `children` ve `slots` nesne ağaçları tekrar yazılmaz. `hasChildren` tutulmaz; `childIds.length` ve slot dizilerinden anlaşılır.

Import ağacı sıralı referans dizilerinden kurar; `parentId`, `slotKey`, `index` ile tutarlılığı doğrular. İkisi çelişirse birini sessizce tercih etmez. Eksik kimlik, döngü, birden çok sahip, tekrarlı kök, ulaşılamayan kayıt veya desteklenmeyen sürüm reddedilir. Mevcut tasarım korunur.

Flat `savedDesigns` kayıtları da `{id, name, rootIds, nodesById}` kullanır; her birinin indeksi bağımsızdır. **Import `behavior` alanını kaynak olarak kullanmaz.** Davranışı düzenlemek için `nodesById[sourceId].interactions` ve ilgili flow/overlay kaynaklarını değiştirin. Yeniden export sırasında manifest yeniden hesaplanır; yalnızca `behavior` düzenlemek tasarımı değiştirmez.

## 3. Bağlantı kontratı

Kaynak node içindeki kural örneği:

```json
{
  "id": "open-sms-view",
  "trigger": "click",
  "action": "goTo",
  "intent": "stateChange",
  "targetNodeId": "review-otp"
}
```

| Alan | Değer / anlam |
| --- | --- |
| `id` | Kaynak node içindeki bağlantı kimliği. Tam dal anahtarı manifestte `connectionKey = JSON.stringify([sourceNodeId, interactionId, branch])` olur. |
| `trigger` | `click` veya `change`. |
| `action` | `goTo`, `openOverlay`, `closeOverlay`, `show`, `hide`, `toggle`. |
| `intent?` | Yalnızca `goTo` için `formStep`, `navigation`, `stateChange`. Kaynakta yoksa manifestte `null`. |
| `targetNodeId` | `goTo` için normal frame; open/close için kayıtlı modal; görünürlük aksiyonları için node. |

Manifest `connections[]` her kurala şu alanları ekler:

| Alan | Anlam |
| --- | --- |
| `sourceNodeId` | Tetikleyiciyi taşıyan gerçek bileşen. |
| `sourceStateId` | Kaynağı içeren en yakın frame/modal; yoksa `null`. |
| `sourceScopeId`, `targetScopeId` | Ekran grubu kimlikleri; çözümlenemiyorsa `null`. |
| `sourcePageIds` | Kaynağın bağlı olabileceği mantıksal sayfalar. Modal için birden fazla olabilir. |
| `targetPageId` | Hedef normal frame'in mantıksal sayfası; diğer hedeflerde `null`. |
| `order` | Kaynak node'un `interactions` dizisindeki sıra. |
| `effects` | Sırayla yürütülecek `{operation, nodeIds}` dizisi. |

`formStep` yeni/önceki form adımını, `navigation` sayfa geçişini ifade eder. `stateChange` hedef frame'in aynı sayfanın farklı görünümü olduğunu açıkça beyan eder. Üçü de preview'de `goTo` görünürlük işlemini yürütür. `intent` servis çağrısı, validasyon veya router işlemi değildir.

## 4. Mantıksal sayfalar ve form adımları

`pages = [{id, frameIds}]`. Aynı gruptaki, bağlamı tekil olan açık `stateChange` bağlantıları normal frame'leri birleştirir. Bu ilişki sayfa üyeliği bakımından geçişlidir; gerçek bağlantılar yönlerini korur. Görsel benzerlik veya isimlerden eşdeğerlik çıkarılmaz.

`formScopes` açık `formStep` bağlantılarının bağladığı **mantıksal sayfalar** üzerinden hesaplanır:

- `id`: türetilmiş kapsam kimliği; bağlantılar değişirse değişebilir.
- `pageIds`: tekilleştirilmiş mantıksal sayfalar.
- `screenIds`: bu sayfalara ait bütün normal frame varyantları.
- `stepCount`: benzersiz mantıksal sayfa sayısı; modal ve durum varyantları ek adım sayılmaz.
- `connectionKeys`: bu kapsamı kuran `connectionKey` dal anahtarları.
- `derivation: "connected-explicit-form-steps"`, `order: "follow-connections"`.
- `dataScope: "shared-across-steps"`: semantik kapsam beyanı; preview'de ortak form verisi veya provider oluşturulduğunu söylemez.

Dizilerdeki alfabetik sıra kullanıcı yolculuğunun sırası değildir. Gerçek sıralama, geri dönüş, döngü ve dallanmalar `connections` üzerinden okunmalıdır. `stepCount` her yürütmenin aynı sayıda adım izleyeceğini garanti etmez. `navigation` ve belirtilmemiş anlam form kapsamını büyütmez.

`issues` kaydı `{code, connectionId, sourceNodeId}` taşır:

| Kod | Anlam |
| --- | --- |
| `ambiguous-state-context` | Durum değişiminin tek kaynak frame'i veya aynı ekran grubu çözümlenemedi; sayfalar birleştirilmedi. |
| `ambiguous-form-context` | Form bağlantısının tek kaynak frame'i yok. |
| `cross-scope-form-transition` | Form bağlantısı farklı ekran grupları arasında. |
| `page-transition-within-state-group` | Form/navigation bağlantısının iki ucu zaten aynı mantıksal sayfa; ek adım türetilmedi. |

Belirsiz bağlantılar kaybolmaz: bağlantı ve görünürlük effects listeleri dışa aktarılır; yalnızca güvenilir olmayan gruplama yapılmaz. Kullanıcı action editöründe kaynak frame'i hedefleyemez; import edilen eski kendine dönüş kuralları okunabilir ve ilgili semantik çelişki raporlanır.

## 5. Modal kontratı

```json
{
  "ownerFrameId": "review-otp",
  "kind": "smsOtp",
  "initiallyOpen": true,
  "withBackdrop": true
}
```

Modal aynı ekran grubunda `kind: "overlay"` olarak kayıtlı olmalı; sahibi normal bir frame olmalıdır. Yeni designer modalları ortak varsayılanla açık gelir. `withBackdrop` verilmezse `true` kabul edilir. `kind` değerleri `custom`, `confirmation`, `smsOtp`; görsel içerik çocuk node'lardan gelir. Tür hiçbir servis veya doğrulama çalıştırmaz.

`states[]` normal frame/modal kimliği, `kind`, `scopeId`, isim, `overlay` metadata, `pageId`, `baseScreenIds` taşır. Modal bağlamı açık sahipliğinden ve onu açan `openOverlay` bağlantılarından türetilir; modaldan modal açılan döngülerde sabit noktaya kadar yayılır. Eski sahipsiz modallarda `pageId` null kalabilir; `baseScreenIds` ve bağlantıların `sourcePageIds` alanlarını kullanın.

Modal `dismiss` alanı Escape, dış alan ve kapatma düğmesinin hide etkisini ve `restoreFocusTo: "opening-node"` hedefini açıklar. Otomatik başlangıç modalında açan node yoksa veya tetikleyici artık gizliyse odak dönüş hedefi bulunamayabilir. Karartma kapalı olsa da preview modalı odak tuzağını ve dış alana tıklayarak kapatmayı korur.

Designer modalı ayrı ortak gösterim katmanıdır. Native kütüphane overlay bileşenlerinde açık prop adı adapter `defaultProps` ile tanımlanır; core `isOpen` benzeri bir isim varsaymaz. Native dropdown'ın kendi açık durumu her zaman manifestte ayrı ekran durumu değildir.

## 6. Görünürlük yürütücüsü

`stateMachine.model = "visibility-set"`, `visibility = "keep-mounted"`.

1. `stateMachine.initial.hiddenNodeIds` bir kümeye alınır. Normal frame'lerden başlangıç olmayanlar ve başlangıçta açık olmayan modallar gizlidir; `prototypeHidden` da uygulanır.
2. Olayda `sourceNodeId` ve `trigger` eşleşen kuralların koşulları o andaki alan/örnek sonuç değerleriyle bir kez değerlendirilir. Yalnızca seçilen dallar `order` sırasıyla yürütülür. Koşulsuz kurallar her zaman seçilir.
3. Her kuralın `effects` dizisi kendi sırasında yürütülür. `hide` kimliği kümeye ekler; `show` çıkarır; `toggle` üyeliği tersine çevirir.
4. `goTo` **hedef ekran grubunun** bütün frame/modal kimliklerini gizler, hedef frame'i ve onun başlangıçta açık modallarını gösterir.
5. `openOverlay` hedef gruptaki aynı sunum türüne sahip diğer açılır öğeleri gizler, hedefi gösterir; temel frame'i değiştirmez. `closeOverlay` yalnızca hedefi gizler.
6. Üst node veya modalın sahibi frame gizliyse içerik de görünmez. Designer modalının owner'ını göstermeden `openOverlay` uygulamak farklı frame'i açmaz.
7. Gizlenen içerik mounted kalır. Preview'ye yeniden giriş başlangıç görünürlüğünü kurar.

Ekran grupları bağımsız görünürlük kapsamlarıdır. Başka gruba `goTo`, kaynak grubunu kendiliğinden gizlemez. Bu bir URL router değildir. `propagation: "native-react-bubbling"`: etkileşimli üst node'lar da yayılan olayda kendi kurallarını çalıştırabilir. `guards: "not-configured"`: koşul, istek sonucu, OTP doğrulaması, submit başarısı veya zamanlayıcı yoktur.

Aynı mantıksal sayfa olarak işaretlemek iki frame'in input değerlerini eşitlemez. Frame snapshot'ları bağımsızdır; korunma aynı mounted örneğe dönüş için geçerlidir. Standart `show/hide/toggle` için eski, bulunamayan hedefler no-op olabilir; bunlar typed frame/modal referansı gibi importta reddedilmez.

## 7. Kimlik, migration ve tekrar kullanım

- v9, v8, v7, v6, v5 ve eski desteklenen nested belgeler okunur; ileri tasarım sürümleri reddedilir. Flat v1 yalnızca desteklenen `designVersion` ile açılır.
- Eski `flow.kind: form/navigation`, anlamı boş olan `goTo` bağlantılarına taşınır; açık intent korunur. Koleksiyon türü kaldırılır.
- Bilinmeyen trigger/action/intent, `goTo` dışındaki aksiyona intent veya geçersiz typed hedef importta hata verir.
- Tam ekran grubu kopyalanırsa kimlikler, iç bağlantılar ve modal sahipliği yeniden eşlenir. Tek başına kayıtlı tasarım yapılan fragment dışarıdaki frame'in sahipliğini/bağlantılarını taşımaz; içerik korunur. Böylece bağımsız şablon bozuk referans üretmez.
- Frame silme/taşıma sonrası referanslar aynı history adımında onarılır. Modalın sahibi kaybolursa kalan başlangıç frame'ine bağlanıp kapatılır; frame kalmazsa overlay metadata kaldırılır.
- Notlar ve props JSON verisidir. Stringler çalıştırılmaz. Kaynakta olmayan özel alanlar için ileri uyumluluk garantisi yoktur.

## 8. Çalışan örnekler ve doğrulama

application.design.json (geliştirme reposundaki kaynak) ve application.flat.json (geliştirme reposundaki kaynak) aynı belgeyi temsil eder. Örnekte üç mantıksal form adımı, dört frame, bir SMS modalı, stateChange/navigation bağlantıları, inline slot, responsive stil ve ayrı kimlik alanına sahip kayıtlı tasarım vardır. 19 Ekimde desteklenen list/renderItem slotu ve root designerFlow/designerFrame yapısıyla yenilendi; strict validator ile doğrulanır. Bu bir kontrat fixture'ıdır; bitmiş görsel form şablonu değildir.

`npm test -- component-state.test.ts flow-contracts.test.ts flat-contracts.test.ts condition-contracts.test.ts toggle-contracts.test.ts frame-workspace.test.ts text-bindings.test.ts` üç adapterde normalize nested → flat → import eşitliğini ve görünürlük sonuçlarını doğrular. Kanonik application.design.json kaynağından nested/flat/behavior dosyalarını aynı revizyonda yeniden üretmek için `npm run examples:contract` kullanılır; normal test koşumu bu dosyaları değiştirmez. UI testleri gerçek download/import, bağlantı kurma ve preview geçişlerini ayrıca doğrular. Güncel kapsam: E2E senaryoları (geliştirme reposundaki kaynak). Kayıtlı örnek çiftlerini kaynaklarını değiştirmeden karşılaştırmak için `npm run test:example-roundtrips`; 19 Ekim kanıtı (geliştirme reposundaki kaynak).


## 9. Koşullar ve örnek sonuçlar (tasarım v8 / manifest v5)

Kaynak node üzerinde tek karşılaştırmalı bir kural:

```json
{
  "id": "check-amount",
  "trigger": "click",
  "condition": {
    "source": { "kind": "field", "nodeId": "amount" },
    "operator": "between",
    "value": 1,
    "upperValue": 5000
  },
  "action": "goTo",
  "targetNodeId": "recipient",
  "intent": "formStep",
  "otherwise": { "action": "openOverlay", "targetNodeId": "balance-error" }
}
```

`condition` yoksa eski koşulsuz davranış aynen sürer. `otherwise` isteğe bağlıdır; koşul false olduğunda yoksa hiçbir işlem yapılmaz. Koşul varsa ana `action/targetNodeId/intent` doğru dalıdır. `otherwise` aynı üç alanı taşır; kendi koşulu, tetikleyicisi veya iç içe else'i olamaz. Alan ya da dal hedefi silinirse kural bütün olarak kaldırılır; koruyucu koşul sessizce kaldırılıp geçiş koşulsuz hale getirilmez. Clone sırasında iki hedef ve alan kimliği birlikte yeniden eşlenir.

### Değerler ve karşılaştırmalar

- `source.kind: "field"`: `nodeId`, adapter'ın `previewValue` tanımladığı normal ağaçtaki tekil input'u gösterir. Tekrarlanan list/table item şablonları ve inline slot örnekleri kaynak olamaz.
- `source.kind: "example"`: `{label, defaultValue: "success" | "failure"}`; yalnızca `operator: "equals"`, `value: "success" | "failure"` desteklenir. Gerçek istek veya gerçek doğrulama değildir. Preview üstündeki seçici sonucu belirler; görünür metin açıkça örnek olduğunu söyler.
- `equals`, `notEquals`: metin/boolean/null için tür koruyan eşitlik. Beklenen değer number ise numeric input stringleri sayıya çevrilir (Material UI dahil adapter eşliği).
- `greater`, `less`, `atLeast`, `atMost`, `between`: finite sayılar; `between` iki sınırı da içerir. Boş string, null, boolean, eksik veya sayıya çevrilemeyen değer **geçersizdir**; iki dal da çalışmaz ve preview alanı düzeltmeyi ister.
- `empty`, `notEmpty`: null veya yalnızca boşluk içeren string boştur; 0 ve false doludur. Eksik alan değeri geçersizdir.
- `value`: JSON scalar; numeric karşılaştırmada finite number. `upperValue` yalnızca between içindir, alt sınırdan küçük olamaz.
- Kod stringi, eval, servis isteği, async bekleme, tıklama sayısına göre karar, iç içe koşul veya AND/OR grupları yoktur. Bir olay birden fazla kural içerebilir; bu kuralların hepsi kendi koşuluyla bağımsız çalışır.

### Adapter sorumluluğu ve preview ömrü

`ComponentMeta.previewValue = { prop, defaultProp, eventProp, emptyValue, read }`. `read(...nativeEventArgs)` native bileşen olayını scalar değere çevirir; core kütüphane ismini veya event.target şeklini tahmin etmez. Örneğin Mantine NumberInput doğrudan değer, Material UI input native event verir.

Preview girişinde değerler native prop → default prop → adapter default'ları → emptyValue sırasından kurulur. Alan değişimi, o alanın `change` kurallarından **önce** kaydedilir. Gizlenen frame mounted kalır; geri dönüşte kendi alan değeri korunur. Başka frame'deki benzer input'a değer kopyalanmaz. Preview yeniden başlatılınca alanlar ve örnek sonuçlar varsayılanlarına döner. Deneme sırasında yazılan değerler tasarım JSON'una ve undo geçmişine kaydedilmez.

### Manifest tüketimi

- `fieldInputs[] = {nodeId, prop, defaultProp, eventProp, initialValue}`: başlangıç veri kaynakları. Native `read` fonksiyonu JSON'a girmez; adapter'ın çalıştırma sorumluluğudur.
- `exampleResults[] = {key, label, defaultValue}`: `key = JSON.stringify([sourceNodeId, interactionId])`. Aynı etiketli iki kural bağımsız örnek sonuçtur.
- `connections[]` ana kuralı `then` ve varsa `else` olarak açar. Koşulsuz dal `always` olur. `interactionId` orijinal kural kimliğidir; `connectionKey` benzersiz dal kimliğidir. Eski `id` alanı else için `:else` eki taşır; tüketici benzersizlik için `connectionKey` kullanmalıdır.
- `guard = {condition, inputKey, expected, invalid: "skip-both-branches"}`. `inputKey` field için node ID, example için yukarıdaki key'dir. `expected` then için true, else için false. Koşulsuz dalda guard null.
- `stateMachine.guards = "typed-comparisons"`, `evaluation = "once-per-interaction-before-effects"`. Önce değer güncellenir, koşul bir kez değerlendirilir; uygun dalın mevcut görünürlük `effects` listesi çalıştırılır. Bütün dalların effects'ini birlikte çalıştırmayın.
- `pages`/`formScopes` bütün olası dalları inceler; koşullarını kanıtlayarak erişilebilirlik elemesi yapmaz. Adım sayısı mümkün form kapsamını bildirir; her oturumda ziyaret edilecek adım sayısını değil.
- Flat JSON'daki behavior import sırasında yeniden türetilir. Kaynak conditions/otherwise nested veya nodesById içinde korunur. v6 ve öncesi koşulsuz belgeler okunur; yeni export v8/v5 olur.

TSX, aynı v5 manifesti native JSX ile birlikte taşır. Çalışan koşul/geçiş handler'larını, form provider'ı, router'ı veya servis kodunu üretmez. Bu sürümün çalışan yürütücüsü preview'dir; sonraki kod üretici kontrattaki guard ve effects'leri uygulamalıdır.

## 10. Aynı frame’de boolean alan bağları (tasarım v8 / manifest v5)

Kaynak node üzerinde isteğe bağlı `toggleBinding` bulunur:

```json
{
  "id": "draft-switch",
  "toggleBinding": {
    "visibleNodeId": "draft-fields",
    "exclusiveWith": ["schedule-switch", "notification-switch"]
  }
}
```

`visibleNodeId` isteğe bağlı, `exclusiveWith` zorunlu benzersiz ID dizisidir (boş olabilir). Kaynak, adapter’ın boolean `previewValue` yeteneğine sahip benzersiz bir input’tur. Core kütüphane adı veya `checked` prop adı varsaymaz. Hedef ve eşler aynı frame/overlay kapsamındadır. Akış dışındaki normal sayfa da tek kapsamdır. Kaynak kendisini, atasını, frame’i, akış kökünü, modal kökünü veya başka switch’in bağladığı aynı hedefi seçemez. Tekrarlanan item/slot örnekleri kaynak/hedef olamaz. Import geçersiz bağları reddeder; silme/taşıma geçersizleşen referansları temizler; grubu çoğaltmak iç referansları yeni ID’lere taşır.

`exclusiveWith` **iki yönlü ikili ilişki** belirtir, tüm alanların birbiriyle dışlandığı grup değildir. Yukarıdaki örnekte schedule + notification birlikte açık olabilir; yalnızca draft ile ayrı ayrı çakışırlar. İlişki tek tarafta saklanabilir; arayüz iki taraftan gösterir/düzenler. Son kullanıcı tarafından açılan anahtar kazanır. Kapatma önceki anahtarları geri açmaz.

Preview sırası:

1. Adapter’dan güncel input değerini oku.
2. Değer `true` ise doğrudan eşleri `false` yap. Zincirleme change event üretme.
3. Bütün bağlı hedefleri kaynağın değeri `true` ise göster, diğer durumda gizle.
4. Yalnızca kullanıcının değiştirdiği kaynağın `change` kurallarını güncel değerlerle değerlendir.

Tasarım başlangıcında çakışan `true` değerler varsa normal children ağacı sırasındaki ilk açık alan kazanır; başlangıç çözümlemesi etkileşim çalıştırmaz. Normal props/defaultProps/adapter boş değer önceliği değişmez. Bağlı visibility, **aynı hedef için** `prototypeHidden` ve doğrudan show/hide aksiyonundan önceliklidir; gizli üst frame içindeki alanı ekranda gösteremez. Alanlar mounted kalır. Editör bütün grupları düzenlemek için gösterir. Runtime değerleri tasarım JSON’una yazılmaz.

Manifest `fieldBehaviors`:

| Alan | Anlam |
| --- | --- |
| `visibility[]` | `sourceNodeId`, `targetNodeId`, `visibleWhen: boolean`, `otherwise: "hidden"` |
| `exclusions[]` | Tekrarsız/sıralı iki ID içeren `nodeIds`, `policy: "latest-enabled-wins"` |
| `initialVisibility` | Başlangıç çakışmaları çözüldükten sonra hedef ID → boolean |
| `initialConflict` | `first-enabled-in-tree-order-wins` |
| `implicitChanges` | `do-not-dispatch-change-rules` |
| `precedence` | `bound-visibility-overrides-direct-visibility-for-target` |

`fieldInputs.initialValue` çözümlenmiş başlangıç değeridir. `stateMachine.fieldUpdates` sıralamayı belirtir. Bunlar frame geçişi değildir; `connections`, mantıksal sayfa veya form adımı sayısını artırmazlar. Nested/flat import’un kaynağı node’lardaki `toggleBinding`’dir; manifest her export’ta yeniden türetilir. Tek başına bu bağları içeren, akışı olmayan bir sayfanın TSX’i de manifest taşır.

Sınır: bir alan grubu tek boolean kaynağa bağlanır; genel AND/OR ifade editörü, keyfi kod veya servis yürütme yoktur. Birden çok input veya grubu seçip aynı boolean alana bağlayabilirsiniz. TSX’te bu metadata korunur; çalışan state/handler üretimi bu sürüme dahil değildir. Önceki desteklenen tasarımlar v9 olarak okunur; eski tek hedefli `visibleNodeId` bağı desteklenmeye devam eder.


## 11. Ana seviyede frame ve çoklu görünürlük (tasarım v9)

- Tuval bir çalışma alanıdır. Yeni belgede bir başlangıç frame’i vardır. **Frame ekle** seçili bileşenin içine değil, belge köküne kardeş bir frame ekler.
- Kök `flow.layout: "root"` kaydı yalnızca metadata’dır: `children: []`. `flow.screens[].nodeId` aynı belgedeki kök frame/modal kayıtlarına başvurur. Bu metadata node’u tuvalde, bileşen ağacında ve TSX JSX’inde bir Box olarak render edilmez; manifestte korunur.
- Bileşenler frame içinde yaşar. Tuvale boşluğa bırakma kabul edilmez. Paletten ekleme ve boş seçime yapıştırma etkin frame’e gider. Frame içeriği doğrudan tuvale çıkarılamaz; iç içe container’dan çıkarma frame sınırında durur.
- Eski bağımsız bileşenler editöre yüklenirken bir frame içine alınır. Eski flow container’ındaki frame’ler köke taşınır. Mevcut node kimlikleri, içerikleri ve bağlantıları korunur. Eski koleksiyonun stili yeni tuval yerleşimini yönetmez; koleksiyon bilgisi metadata olarak kalır.
- Nested JSON kanonik ağaçtır. Flat JSON aynı verinin türetilmiş indeksidir. Frame’in `parentId` alanı `null`; içindeki bileşenin `parentId` alanı frame kimliğidir. Flat `designVersion` artık 9’dur; flat sürümü 1, davranış manifesti 5 olarak kalır.

### Kullanıcı adımları

1. Aynı frame’deki içerik gruplarını Cmd/Ctrl ile seçin.
2. Sağ panel **Görünürlük → Bağlı alan** üzerinden switch, checkbox veya adapter’ının boolean değer sağladığı başka bir bileşeni seçin.
3. Seçilen bütün içerik tasarımda görünür. Önizlemede kaynak değer `true` ise görünür, `false` ise gizlidir; React örnekleri mounted kalır.
4. **Her zaman göster** seçeneği yalnızca seçili hedeflerin bağını kaldırır. Aynı kaynağın diğer hedefleri korunur. Bağ değiştirme tek geri alma adımıdır.

```json
{
  "id": "schedule-checkbox",
  "type": "checkbox",
  "toggleBinding": {
    "visibleNodeIds": ["date-group", "repeat-group", "note-group"],
    "exclusiveWith": []
  }
}
```

Kaynak, adapter’ın `previewValue` tanımıyla okunur; çekirdekte switch tipi veya `checked` prop adı sabitlenmez. Şimdiki basit görünürlük arayüzü boolean değerlere yöneliktir; keyfi prop veya select değeri için genel koşul editörü değildir. Hedefler kaynakla aynı frame’de olmalı, kaynak veya onun üst kapsayıcısı olamaz. Tek hedef iki farklı kaynak tarafından yönetilemez. Çoklu seçim başka kaynağa bağlanırsa eski sahiplik kaldırılır.

Manifest, `visibleNodeIds` içindeki her hedef için ayrı `fieldBehaviors.visibility` kaydı üretir. Önceki `visibleNodeId` okunur; iki alan beraber varsa benzersiz birleşimleri kullanılır. JSON dışa/içe aktarım ve kaydedilmiş tasarım klonlaması bütün iç hedef kimliklerini korur/yeniden eşler. TSX davranış manifestini ve native JSX’i taşır; bu değişiklik üretim için state/handler üretimi eklemez.

Regresyonlar: `check-frame-workspace.mjs`, `frame-visibility.spec.ts`, `toggle-bindings.spec.ts`, `frame-contract.spec.ts`. Kapsam: switch/checkbox ile üç hedef, tasarım/preview ayrımı, alan değerinin gizle/göster arasında korunması, undo/redo, nested/flat round trip, ana seviye frame ekleme, palet/drop/paste sınırları ve eski frame bağlantıları.


## 12. Yatay çalışma alanı ve bağımsız önizleme

- Normal frame'ler belge sırasıyla **sağa doğru** yerleşir. Yeni ekran köke eklenir ve tuval o ekrana gider. Uzun frame'ler içerikleri boyunca aşağı büyür; çalışma alanı bu boyutlara göre genişler. Serbest/absolute konumlandırma eklenmez; frame içindeki gerçek component ağacı, flex/grid düzeni ve adapter eşlemesi korunur.
- Tuval konumu ve zoom geçici editör durumudur; JSON kontratına koordinat veya yeni alan eklenmez. Modal/overlay, bağlı olduğu ekranın üzerinde mevcut overlay kontratıyla gösterilir.
- Gezinme: **Boşluk + sol sürükle**, **orta tuşla sürükle** veya görünür **El aracı**. **Shift + tekerlek** yatay kaydırır, **Ctrl/Cmd + tekerlek** imlecin bulunduğu noktaya yakınlaşır/uzaklaşır. Normal tekerlek dikey kaydırır. Ctrl/Cmd + tıklama mevcut seçim davranışını korur. **Ekrana sığdır** etkin ekranı genişliğe, **Akışı sığdır** bütün ekranları çalışma alanına sığdırır.
- Üst başlıktaki **Önizle**, `#/preview/<session-id>` adresinde ayrı sekme açar. Düzenleme yapılan akışın başlangıç ekranını kullanır; diğer akışlar gizlidir. Önizleme yalnızca bu ayrı sekmede açılır.
- Yeni sekme, açıldığı andaki tasarımın doğrulanmış bir kopyasını kullanır. Editör, autosave ve MCP senkronizasyonu bu sekmede başlatılmaz. Form girdileri, göster/gizle ve modal/ekran geçişleri yalnızca önizleme belleğinde yaşar. Editördeki daha yeni değişiklikleri görmek için yeniden Önizle'ye basılır.
- Önizleme genişliği gerçek pencere genişliğidir. Uzun sayfa içerikleri kendi kaydırma alanında devam eder. Ekran değişince üstten başlar; modal ve grup görünürlüğü değişince kaydırma korunur. Geri dönülen ekranın mounted input değerleri korunur. **Baştan başlat**, girdileri ve akış durumunu ilk tasarıma döndürür.
- Açılış verisi geçici localStorage anahtarıyla aktarılır, okununca sessionStorage'a alınır ve aktarım anahtarı silinir. Aynı sekme yenilenebilir (24 saat); URL bağımsız paylaşılabilir bir yayın adresi değildir. Eksik/süresi geçmiş veri için tasarım editörünü açmak yerine açıklama gösterilir.
- Kapsam: `canvas-navigation.spec.ts` yatay yerleşim, otomatik odaklama, pan, yatay tekerlek, zoom sonrası drop hedefi; bağımsız önizlemede adımlar, modal, çoklu görünürlük, uzun sayfa, mobil genişlik, yeniden başlatma, yenileme ve editör verisinin korunmasını sınar.


## 13. Ekran bağlamı UI bileşeni değildir (tasarım v10)

Tasarım yüzeyinin ortak minimum yüksekliği 960px'tir; içerikle büyür. Bu bir editör sunum kuralıdır,
`designerFrame.style.minHeight` olarak kaydedilmez. Preview kullanılabilir viewport'u temel alır.

- Tuval, noktalı arka plan, ekran kenarlıkları, editör zoom/pan ve seçim tutamaçları export edilen UI ağacına dahil değildir.
- `type: "designerFrame"` yalnızca bir ekran bağlamıdır; `type: "designerFlow"` akış metadata kaydıdır. Bunlar adapter registry/paletine ait değildir. `props` ve `style` ortak kayıt biçimi nedeniyle boş nesnedir; responsive stil/prop veya slot taşıyamazlar. Frame seçimi İçerik/Düzen veya resize sunmaz. Görünüm için frame içine gerçek Card, Box, Grid vb. eklenir.
- Nested/flat JSON, import ve bağlantı hedeflerinin korunması için bu bağlam kayıtlarının ID, ad, çocuk ilişkileri, not ve akış bilgilerini saklar. Çocukların `type` alanı hâlâ gerçek adapter bileşen anahtarıdır; adlandırma bunu değiştirmez.
- TSX frame/flow için Box, div, section veya başka bir UI kapsayıcısı üretmez. Frame çocukları yalnızca DOM oluşturmayan React fragment içinde çıkar. Gerçek kullanıcı bileşenlerinin import, prop ve stilleri korunur.
- Manifestte `role: "screen-context"` kaydının `contentNodeIds` alanı gerçek içerik köklerini gösterir; `role: "flow-context"` akış metadata'sını ayırır. Bu bağlam ID'leri DOM'da aranmaz. Ekran/adım/durum geçişlerinin hedefi olmayı sürdürürler; gerçek bileşenler `data-designer-id` ile eşleşir.
- v9 ve önceki kayıtlar yüklenirken normal frame'ler native bağlama çevrilir. Eski frame'e verilmiş prop/stil/slot varsa kaybolmaması için gerçek bir içerik bileşenine taşınır. Ekran ID'si, iç bileşen ID'leri ve akış hedefleri sabit kalır; yalnızca bu gerekli içerik kapsayıcısı yeni ID alır. Yeni frame otomatik Box üretmez. Modalların içerik bileşenleri ve overlay kontratı korunur.
- İlgili kontroller: `native-frame.spec.ts`, `check-frame-workspace.mjs`; üç adapter'da native drop, sade panel, gerçek bileşen özellikleri, TSX'te kapsayıcı yokluğu, iki JSON formatı, eski stil göçü ve önizleme.

## 14. Form alanını özet metninde gösterme

Bir metni seçip **İçerik → Bu metinde ne gösterilsin?** listesinden giriş alanını seçin. Alanlar ekran/kapsayıcı/ad yoluyla listelenir. **Kendi yazdığım metin** bağlantıyı kaldırır.

- Kaynak, adapter'ın `previewValue` sözleşmesini destekleyen tekil bir giriş alanıdır. Tekrarlanan liste/table slotları bu bağlantının kapsamı dışındadır.
- Hedefin `textBinding: { sourceNodeId }` bilgisi nested JSON ve flat JSON içinde korunur. `props.children` boş/null alan için yedek metindir. `0` ve `false` boş sayılmaz; string olarak gösterilir. HTML çalıştırılmaz.
- Tasarımda alanın başlangıç değeri, önizlemede o alana gerçekten girilen değer gösterilir. Geri dönüp alanı değiştirmek özeti günceller. Runtime değerler tasarım dosyasına kaydedilmez.
- Tüm ilgili öğeler birlikte kopyalandığında kaynak ID yeniden eşlenir. Kaynaksız kopyalarda bağlantı kaldırılır; kaynak silinirse yedek metin kalır. Geçersiz kaynak/hedef import sırasında reddedilir.
- Türetilmiş davranış kontratındaki `textBindings[]`: `targetNodeId`, `targetProp: "children"`, `sourceNodeId`, `emptyText`. Kaynağın adapter eşlemesi `fieldInputs[]` içindedir.
- TSX mevcut yaklaşımı korur: bileşen JSX'i + davranış manifesti + `data-designertextbinding`. TSX tek başına state runtime'ı üretmez; hedef mimariye dönüştüren tüketici bu açık bağlantıyı kullanır.

### Üç ekranlı onay akışını bağlama

1. İlk ekranın **Devam** butonuna sağ tıklayın → **Akışa bağla** → **Yapılacak işlem: Form adımı** → özet ekranını seçin → **Bağlantıyı kaydet**.
2. Özetin **Devam** butonunda **Modal / bildirim aç** → onay penceresini seçin.
3. Pencerenin **Onayla** butonunda **Form adımı** → başarı ekranını seçin.
4. Pencerenin **Vazgeç** butonunda **Modal / bildirim kapat** seçin. İçinde bulunduğu pencere otomatik hedeflenir. Ekran geçişi yapmaz; özet açık kalır.
5. **Önizle** ayrı sekmede akışın başlangıcını açar. Escape, pencere kapatma ve Vazgeç yalnızca pencereyi gizler. Onayla hedef ekrana geçerken açık pencereyi de gizler.

Başlangıç örneği: `tests/fixtures/confirmation-transfer.json`. Bu dosya bağlantısızdır; E2E senaryosu bağlantıları ve özet alanlarını arayüzden ekler, nested/flat export-import sonrasında iki yolu da üç adapter ve üç tarayıcıda kontrol eder.

### Ters görünürlük koşulu

`toggleBinding.hiddenWhenCheckedNodeIds?: string[]`, aynı kaynağa bağlı hedeflerin
hangi alt kümesinin kaynak **işaretli değilken** gösterileceğini belirtir. Bu alan yoksa
önceki davranış korunur: bütün hedefler işaretliyken gösterilir. Liste benzersiz ID’lerden
oluşur ve yalnızca `visibleNodeId` / `visibleNodeIds` birleşimindeki hedefleri içerebilir.

Örnek: `visibleNodeIds: ["extra-fields", "summary"]`,
`hiddenWhenCheckedNodeIds: ["summary"]`, `exclusiveWith: []`.
Kaynak false olduğunda summary görünür, extra-fields gizlidir; true olduğunda tersidir.
Tasarımda ikisi de düzenlenebilir. Preview gizlenen alanları mounted tutar.
Her hedef manifestte kendi `visibleWhen: true | false` değerini taşır; `otherwise: "hidden"`
değişmez. `initialVisibility` gerçek başlangıç değerinden hesaplanır. Nested/flat JSON,
TSX içindeki davranış manifesti, undo/redo ve kopyalamadaki ID eşlemesi bu koşulu korur.


## 16. Adapter üzerinden Overlays

- Ekleme yolu **Bileşenler → Overlays → Modal / Toast**. Akışlar listesi mevcut öğeleri seçmek ve bağlantıları incelemek içindir.
- `ComponentMeta.category: "overlays"` ve `overlay: { presentation, Surface }` adapter yeteneğidir. `Surface` React bileşenidir; JSON'a yazılmaz. Editör yalnızca ortak `opened`, `designMode`, `title`, `withBackdrop`, `onClose`, `closeLabel`, `children` sözleşmesini kullanır. `opened` / `open` gibi native prop farkları adapter içinde eşlenir.
- Yeni node türleri `modal` ve `notification`; `label` değişse bile `type` korunur. `overlay.presentation` değeri `modal` veya `notification` olur. Eski kayıtlarda alan yoksa `modal` kabul edilir; eski Box modalları da seçili adapter'ın modal yüzeyini kullanır.
- Overlay, frame'in çocuğu değil kökte duran ve `ownerFrameId` ile o frame'e ait olan bir öğedir. Palette tıklamak, klavye ile eklemek veya karta sürüklemek aynı ekleme yolundan geçer. Bir modal içinden yeni overlay eklenirse aynı sahibi kullanır; modal içine modal yuvalanmaz.
- Eklenince tasarım için açılır; `initiallyOpen: false` olduğundan önizlemede bir açma aksiyonunu bekler. İçerisine normal bileşen eklenir. Kullanıcı isterse sağ panelden başlangıçta açık olmasını seçer.
- Tasarım yüzeyi inert'tir: adapter'ın native görsel bileşenleri kullanılır ancak modalın odak kilidi ve body/portal yöneticisi çalışmaz. Native Modal/Dialog önizlemede çalışır. Böylece tasarım araçları ve sürükle/bırak engellenmez.
- Modal eşlemeleri: Mantine `Modal`, Material UI `Dialog`, Ant Design `Modal`. Toast eşlemeleri: Mantine `Notification`, Material UI / Ant Design `Alert` yüzeyi; adapter onu sabit bir bildirim olarak konumlandırır. Bu sürümde otomatik kapanma süresi ve bildirim kuyruğu yoktur; kapatma düğmesi veya aksiyonla kapanır.
- `openOverlay` aynı grupta aynı `presentation` türünü değiştirir. Confirmation → OTP önceki modalı kapatır. Bir Toast açılması modalı kapatmaz. `closeOverlay` sadece hedefini kapatır; `goTo` o grubun bütün ekran/overlay durumlarını değiştirir. Manifest `effects` bu kuralları açıkça içerir; tüketiciler efekt sırasını uygular.
- Nested / flat JSON overlay metadata'yı korur. TSX native bileşenleri, `data-designeroverlay` bilgisini ve davranış manifestini taşır. Mevcut export yaklaşımı gereği aksiyonların uygulama koduna dönüştürülmesi manifest tüketicisine aittir; statik JSX tek başına çalışan bir OTP servisi veya bildirim yöneticisi değildir.


## 17. Akış bağlantısı ile bileşen koşullarının ayrımı

- **Akışa bağla** ekran/form adımı geçişlerini ve pencere açma/kapatmayı tanımlar. Aynı ekranın farklı tasarlanmış frame'ine geçiş `intent: "stateChange"` olarak korunur; arayüzde **Ekranın başka hali** denir.
- **Görünürlük ve aktiflik** hedef öğenin sağ panelinde ve sağ tık menüsünde aynı düzenleyiciyi açar. Birden fazla öğe seçiliyken aynı koşul her hedefe ayrı yazılır. Kaynak checkbox/switch üzerinde ikinci bir görünürlük düzenleyicisi yoktur.
- **Ne zaman görünsün?**: her zaman, önizlemede gizle veya koşula bağlı. **Ne zaman kullanılabilsin?**: her zaman, kullanılamasın veya koşula bağlı. İkinci seçenek yalnızca adapter'ın boolean `disabled` özelliği tanımlı bileşenlerinde sunulur.
- Checkbox/switch'lerin birbirini kapatması ayrı bir seçim ilişkisidir: **Birlikte açık olamasın**. Metinlerin alan değerinden okunması `textBinding` sözleşmesini kullanmaya devam eder.

Nested belge sürümü **11**; flat belge aynı node bilgisini taşır:

```json
{
  "id": "continue-button",
  "type": "button",
  "stateRules": {
    "enabledWhen": {
      "match": "all",
      "conditions": [
        { "source": { "kind": "field", "nodeId": "name-input" }, "operator": "notEmpty" },
        { "source": { "kind": "field", "nodeId": "terms-checkbox" }, "operator": "equals", "value": true }
      ]
    }
  }
}
```

`visibleWhen` aynı grup sözleşmesini kullanır. `match: "all"` tüm koşulları,
`"any"` en az birini gerektirir. Koşullar yalnızca tekil `previewValue` alanlarını
okur; kaynak değeri ve karşılaştırma tipi mevcut `DesignCondition` kurallarına uyar.
Kendi değerini veya kendi altındaki alanı koşul kaynağı yapmak ve tekrarlanan
liste/tablo şablonlarından kaynak/hedef seçmek desteklenmez. Import bunları reddeder.

Önizlemede her alan değişikliğinde yeniden değerlendirilir. `visibleWhen` varsa eski
görünürlük bağları ve olayla gizleme bilgisinden; `enabledWhen` varsa statik `disabled`
özelliğinden önceliklidir. Koşul yoksa statik değer kullanılır. Tasarımda görünürlük
koşulları öğeyi saklamaz. Gizlenen öğe mounted kalır. Boş koşul grubu veya geçersiz/kayıp
kaynak değeri öğeyi gizler/devre dışı bırakır; `any` içinde başka bir doğru koşul olsa da
bozuk kaynak görmezden gelinmez. Kaynak silindiğinde ilgili koşul grubu bütünüyle kaldırılıp
hedef statik gizli/devre dışı yapılır; undo eski bağı geri getirir. Birlikte kopyalanan
öğelerin kaynak ID'leri eşlenir; kaynaksız kopyada aynı güvenli statik sonuç kullanılır.

Manifest sürüm 5'e eklenen `componentStates[]`, `targetNodeId`, `visibleWhen` /
`enabledWhen`, `evaluation: "on-every-field-change"` ve
`invalidInput: "hidden-or-disabled"` alanlarını taşır. TSX çıktısı mevcut yaklaşımı
korur: gerçek bileşen JSX'i + davranış manifesti + `data-designerstate`.
Tek başına koşulların React runtime'ını üretmez; tüketici bu kontratı uygular.

Eski `toggleBinding.visibleNodeIds` / ters görünürlük kayıtları okunur ve hedef
panelinde eşdeğer koşul olarak gösterilir. Hedefin görünürlüğü düzenlenince yeni
`stateRules` kaydına dönüşür, o hedef eski kaynak listesinden çıkarılır. Eski `show` /
`hide` / `toggle` bağlantıları import ve önizlemede korunur; yeni akış bağlantılarının
seçenekleri arasında sunulmaz. Böylece mevcut dosyalar çalışırken yeni tasarımlar tek
hedef sahibi üzerinden düzenlenir.

### Tasarımda bağlantı ve koşulları keşfetme

- Kapalı **Görünürlük ve aktiflik** başlığında tanımlı koşulların sayısı görünür. Koşulsuz gizli/devre dışı ayar veya karşılıklı kapatma ilişkisi varsa **Ayarlı** rozeti gösterilir.
- Tuvalde bordo el ikonu akış bağlantısını, açık mavi ayar ikonu bileşenin görünürlük/kullanım ayarını, not ikonu davranış notlarını açar. Bunlar klavyeyle de kullanılabilen editör düğmeleridir; önizlemede yer almaz ve dokümana yeni davranış yazmaz.
- Bağlantı penceresi önce kayıtlı bağlantıları listeler. Yeni form yalnızca **Yeni bağlantı ekle** ile, mevcut form **Bağlantıyı düzenle** ile açılır. Kaydet veya Vazgeç listeye döner.
- Birden fazla görünürlük/kullanım koşulu kısa özetler halinde listelenir. Bir seferde tek koşul açılır; **Koşul ekle** yeni satırı oluşturup o satırın düzenleyicisini açar.

### Alan seçimi ve ekran kapsamı

Görünürlük ve aktiflik koşulları sağ panelde aynı bölümden düzenlenir. Yeni
koşullarda yalnızca hedefle aynı ekrandaki tekil giriş alanları sunulur; o ekrana
ait açılır pencereler aynı bağlamı paylaşır. Çoklu seçimde alanın tüm hedeflerle
aynı ekranı paylaşması gerekir. Kendi alt öğesine bağlanma engeli korunur.
Eski tasarımlardaki ekranlar arası referanslar düzenlenebilir ve içe/dışa
aktarımda korunur; alan seçiminin daraltılması mevcut kontratı değiştirmez.
`visibleWhen` görünürlüğü, `enabledWhen` ise `disabled` değerinin tersini
belirler. Aktiflik yalnızca adapter'ında `disabled` desteği olan bileşenlerde
sunulur. Metin/seçim alanlarının değerleri ve switch/checkbox işaret durumu,
adapter'ın `previewValue` tanımından okunur.

### Tasarım için örnek bağlı metin (v12)

`textBinding: {sourceNodeId, designText?: string}` içindeki `designText` sadece tasarım tuvalinde
gösterilir. Boş/yalnız boşluk ise `props.children` kullanılır; kaynak input'un default değeri tasarım
metnini ezmez. Önizlemede designText yok sayılır: bağlı scalar değer gösterilir, boş/null olduğunda
önceki gibi `props.children` kullanılır. Böylece örnek isim gerçek veya girilmiş form verisi sayılmaz.
Sağ panelde **Tasarımda gösterilecek örnek** alanından düzenlenir. Nested/flat JSON, autosave, undo/redo
ve birlikte kopyalama bu metni korur. Manifestteki runtime `emptyText` değişmez; TSX'in
`data-designertextbinding` metadata'sında designText bulunabilir fakat runtime'a bağlanmaz.
Eski belgelerde alan yoktur; import sırasında güncel sürüme taşınır.

## MCP node düzenleme 15 Ekim 2026

`update_design` mevcut belgeye node ID hedefli JSON merge patch uygular. Nesneler recursive merge edilir, null anahtarı siler, diziler tam değiştirilir. Node ID değiştirilemez. Bütün sonuç parser/katalog/flow doğrulamasından geçer; clientId/designId/editorId/expectedVersion ve browser içerik revizyonu kontrolü gerekir. Başarı `get_design_import` applied ACK'idir. Tek undo, node kimliği ve etkilenmeyen ağaç korunur. Yeni ekran ekleme `import_design` ile devam eder. Şema sürümü değişmez; seçim ve işlem durumu JSON'a yazılmaz. Agent akışı (MCP reposunda `designer/contracts/prompt-authoring.md`).

### Referans workspace metadata
Referans kaydındaki isteğe bağlı `placement: {x,y,width}` yerel canvas koordinatlarıdır. Yükseklik her zaman `width * image.height / image.width` ile türetilir. Eski kayıtlarda deterministik başlangıç konumu kullanılır. Konum, seçim ve görünür boyut DesignDocument alanı değildir; export/preview ve tasarım undo geçmişine girmez. Resize orijinal normalize PNG baytlarını değiştirmez.

### MCP editor selection and target identity

get_editor_context({clientId, designId?, editorId?}) seçimi ve referansları açık browser’dan anlık okur. Yazılar designId/editorId/expectedVersion/requestId ile korunur; hedef otomatik seçilmez. Aynı profil/origin’de tek editör sahipliği vardır, farklı clientId’ler izoledir. Bağlantı koptuğunda sunucu önbellekteki belgeyi sunmaz. Ayrıntılar [merkezi MCP sözleşmesinde](../backend-mcp.md).

Selection exposes node/parent/sibling/path/frameId and authored/effective/resolved sizing styles, canvasWidth/activeBreakpoint, ordered selectedReferences (row/column/order, source/display dimensions, browser connection readiness). These are not exported document fields. Styles use the same core sizing rules as rendering but are not DOM measurements. Reference rows group nearby top edges with min(80,max(24,one quarter of the shorter height)) tolerance; rows sort by y and row items by x.

## İzole frame render geri bildirimi — 15 Ekim 2026

`render_design_frame` salt okunur MCP aracıdır: açık editorId, expectedVersion, normal root frameId, width ve height gerekir. Context belge hash’i ile eşleşmelidir. Frame’in flow başlangıcı yalnız parse edilmiş ayrı kopyada seçilir; kullanıcı belgesi/history/autosave değişmez. Kaynak sürüm/hash render sonunda yeniden kontrol edilir; değişmiş sonuç hata verir.

PNG ve DOM ölçüleri aynı viewport bağlamında üretilir; çıktı ilk-durum native preview, canlı sekme görüntüsü değildir. Ölçüler/PNG tasarım JSON’una yazılmaz, şema sürümü değişmez. Node ID korunur; tekrar eden DOM örnekleri occurrence ile ayrılır. Detaylı limit, kurulum, kaynak yükleme ve düzeltme semantiği render-feedback (MCP reposunda `prompts/designer/render-feedback.md`) rehberindedir. Agent ölçüleri absolute konumlara çevirmeden props/layout patch yapar; applied ACK ve yeni version sonrası yeniden render eder.

## Katı adapter JSON sınırı — 15 Ekim 2026

JSON `props` anahtarları seçili adapter/bileşenin `defaultProps` ve `propsSchema` kayıtlarından türetilir; TypeScript arayüzleri çalışma anında mevcut değildir. Katalogdaki `authoring.acceptedPropKeys` aynı ortak denetleyiciyi kullanır. `_tableEditor` gibi yalnız panel düzenleyicisi alanları prop değildir. Native kütüphanenin desteklemesi tek başına yeterli değildir. Kayıtlı slot prop’u yalnız saved-design ID/null kabul eder; inline slot adları da kayıtlı olmalıdır.

Bilinmeyen prop, slot veya bileşen bütün importu hata ile reddeder; açık tasarım/history/adapter değiştirilmez. `props.style`, `sx`, `className`, HTML/handler gibi kaçış alanları kabul edilmez. `style` ve her responsive katmanda yalnız katalogdaki `allowedLayoutKeys` değiştirilebilir. Renk/font/weight/line-height gibi görünüm alanları ancak bileşenin kayıtlı prop’uyla verilir. Adapter’ın sabit `defaultStyle` değerleri aynen round-trip olabilir; layout dışındaki değerleri değiştirilemez. Mevcut `item.field` / `{item.field}` veri bağlamaları kayıtlı prop anahtarlarında korunur; bu yollar kod çalıştırmaz.

Örnek: Mantine Typography için `props: {children: "ADIM 2 / 3", c: "black", fw: 400}` geçerlidir. Aynı node’da `props.color` veya `style.color: "#801d2d"` reddedilir. `style.gap: 32` ve `responsiveStyles.sm.padding: 8` geçerlidir. Diğer adapter için aynı prop isimlerini varsayma; kendi kataloğunu oku.

Bu sınır dosya/nested/flat, savedDesigns, yerel şablon/kayıt, preview, MCP import/update ve TSX çıkışında geçerlidir. Eski sürümler muaf değildir; şema sürümü 12 kalır. Geçersiz yerel kayıt uygulanmaz. Özgün JSON `designer-rejected-json:` altında yedeklenir ve kurtarma penceresinden indirilir; yedek yazılamazsa autosave özgün anahtarı ezmez. Bu otomatik bir görünüm dönüşümü değildir: kullanıcı/agent bildirilen alanları kayıtlı prop’lara taşıyıp yeniden import eder. Yeni tasarım mevcut dosyanın görünümünü sessizce taklit etmez.


## Bağımsız tablo hücreleri — 17 Ekim 2026

Mantine, Material ve Ant `dataTable` için ortak temel authoring sözleşmesi:

- Paletten yeni tablo 6 sütun × 10 gövde satırı; `Column1`…`Column6` ve `Row 1-1`…`Row 10-6` ile başlar. `ComponentMeta.initializeNode` yalnız yeni node oluştururken çalışır, import/parser mevcut tabloyu büyütmez.
- Bağımsız mod: `props.columns` benzersiz, değişmez `key` + `header` kayıtları; `props.rows` benzersiz `{id}` kayıtları; `props.data: []`; `slots.cellContents` satır öncelikli düz dizide **her gövde hücresi için bir bağımsız gerçek `box` node'u**. İç bileşenler normal `children`/`slots` ağaçlarıdır. Kapasite 1–20 sütun, 1–100 satır; hücre sayısı tam çarpıma eşittir. Kimlikler başlık ve sıra numarasından bağımsızdır.
- `cellContents` kayıtlı inline slot'tur; saved-design ID bağlanamaz. Bağımsız modda dolu `data`, `renderCell` prop/slot yasaktır. Hatalı model bütün girişlerde atomik reddedilir. Yalnız `columns/data/renderCell` içeren eski mod aynı çalışır; otomatik migration/konversiyon yapılmaz.
- Sona/araya ekleme boş hücreler oluşturur; eski hücreler/row ID/column key ve içerikleri korunur. Toplu uygulama hedefteki bütün hücre ağacını (props, style/responsiveStyles, iç bileşen ve slotlar) bağımsız kopyayla değiştirir. Hedef yapısal hücre kimliği korunur, alt kimlikler/iç referanslar yenilenir; saved slot içerikleri bağımsız inline kopyaya açılır. Dış ağaca bağlı etkileşimler mevcut reusable-clone kuralıyla aktarılmaz. Kaynak değişmez; bir işlem tek undo/redo adımıdır.
- Sütun başlığına tek tık sütun özelliklerini seçer; geçici seçim stabil `columns[].key` ile izlenir, belgeye yazılmaz. `columns[].header` düzenlenebilir. `columns[].align` yalnız `left | center | right` olabilir; alan yoksa native library varsayılanı kullanılır. Panelde Varsayılan seçimi alanı kaldırır. Sütun başlığı ve gövde hücrelerinin native hizası adapter'a eşlenir (Mantine Th/Td textAlign, MUI TableCell align, Ant columns.align); iç bileşenin açık hizalama/layout tercihi korunur. Hizalama hücre ağacını kopyalamaz veya değiştirmez; komşu sütunları etkilemez, tek undo'dur. Başlık/hücre sağ tık menüsü aynı sütun hizasını ayarlar. `ComponentMeta.tableColumnAlignment` yeteneği olmayan library için kontrol gösterilmez ve işlem uygulanmaz. Makine açıklaması `authoring.tableContents.columnAlignment` altındadır.
- Yapısal cell root tek başına sürüklenmez, çoğaltılmaz, sarılmaz veya yeniden sıralanmaz. Delete içeriğini temizler; satır/sütun menüsü bütün ekseni siler. Hücrenin içindeki bileşenler ortak editör araçlarıyla düzenlenir.
- Hücre seçiminin sağ panelindeki **Değer tipi** sütunun dolu hücrelerinden türetilir: hepsi sayıya çevrilebilir basit metin/sayı ise `Sayı`, hepsi metin ise `Metin`, hepsi rich bileşen ise `Özel`, farklı tipler varsa `Karma`. Boşlar atlanır, tamamı boş sütun `Metin` gösterir. Ondalık virgül ve nokta kabul edilir; binlik ayırıcı yorumu yapılmaz. Bilgi salt okunurdur, değer dönüştürmez ve JSON alanı üretmez.
- Native Table yapısı adapter'a aittir. Hücreler tasarım ve preview'de gerçek native td/TableCell içinde ayrı seçilebilir ağaçlar olarak render olur. Satır numarası tutamacı gösterilmez; satır ekleme hücre menüsünde ve alttaki + kontrolündedir. Başlık hücresi gibi görünen kolon ekleme kontrolü başlıkla aynı hizada tablonun son başlığının hemen sağına bağlıdır. Her iki ekleme kontrolü de native tabloyla aynı gerçek canvas zoom oranında çizilir; sabit ekran boyutu uygulanmaz. + kontrolleri, menü odağı ve tip çıkarımı yalnız editördedir; bu görünüm kayıtlı veri/MCP authoringContract anlamını değiştirmez. TSX export hücre ağaçlarını native Table parçaları/Ant columns-render yapısına derler; editör yardımcılarını veya `cellContents` prop'unu export etmez.
- Belge sürümü 12 ve flat sürümü 1 korunur: yeni üst seviye/node alanı yoktur; kayıtlı opsiyonel props/slot yeteneği eklenmiştir. Eski belgeler ileriye dönük veri kaybı olmadan açılır. Yeni bağımsız tablolar eski uygulama sürümlerine import edilemez; eski sürümün bilinmeyen slot reddi korunur.
- Sticky/sorting/filtering/pagination veya uygulama verisi dönüşümü bu fazda eklenmez. Makine özeti katalog `authoring.tableContents`; tarif data-display (MCP reposunda `designer/contracts/data-display.md`). Doğrulama: `npm test -- table-authoring.test.ts`, ilgili üç-adapter E2E ve JSON nested–flat–nested örnekleri.

### Hücre işlemlerine görünür erişim — 18 Ekim 2026

Sağ panel, yapısal hücre seçiliyken mevcut metin düzenleme ve satır/sütuna kopyalama işlemlerini de sunar. Boş/tek basit Typography hücresinde metin düğmesi görünür; rich içerik düzleştirilmez. Kopyalama hedefin tüm içeriğini değiştirir, bağımsız kopyadır; mevcut iç/dış referans kuralları korunur. Bu ek erişim yoludur: değer yazımı, varsayılan, öncelik, JSON/preview/TSX semantiği değişmez; yeni alan veya authoringContract yeteneği eklenmez.

## Doğrudan liste ve Compound sekmeler — 18 Ekim 2026

Üç adapter `itemList` ve `tabs` için `ComponentMeta.collection` yeteneğini bildirir. `collectionEntries` ve `designItemId` yalnız güvenilir renderer girdisidir; kabul edilen JSON prop'u değildir. Native callback/context/provider/ARIA ilişkisi adapter'a aittir.

- `itemList.children` yalnız `listItem` köklerinden oluşur. Palet boş başlar; dört boş çizgi ve + geçici editör yardımcısıdır. İlk ekleme boş içerik, sonraki ekleme son öğenin **tam bağımsız kopyası**dır. Öğenin `children` ve normal slot ağaçları gerçek bileşenlerdir. `listItem` desteklenen düzeni kendi içerik köküne uygular; native List.Item/ListItem sarmalaması adapter'a aittir. Ant aynı ağaçları native `dataSource`/`renderItem` sınırında eşler; kullanıcı callback/veri dizisi yazmaz.
- `tabs.children` yalnız `tabItem` kökleridir. Her `tabItem` bir başlık–panel çiftinin tek mantıksal sahibidir. `props.label` metin, `props.disabled` başlığın native pasifliğidir. İçerik ağacı `children`, panel iç düzeni `style`/`responsiveStyles` içindedir. Ayrı tab value/parent/provider kaydı yazılmaz; değişmez **item node ID** native header ve paneli eşler. Başlığı değiştirme veya sırala bu bağı değiştirmez.
- Yeni Tabs iki boş öğe oluşturur. `props.orientation`: horizontal/vertical; `props.initialItemId` sahip olduğu bir öğe ID'sidir. Boş grubun değeri yalnız `""` olabilir. + boş başlık/panel ekler; Çoğalt ayrı bir tam kopyalama komutudur. Başlangıç öğesi silinirse komşusu seçilir. Son öğe silinebilir; tekrar ekleme geçerli başlangıç oluşturur.
- Tasarımda pasif/kapalı sekme seçilebilir. Geçici seçili panel React editör durumudur; JSON/history/autosave/TSX'e yazılmaz. Başlangıç dropdown'u kalıcı değeri değiştirir, düzenlenen sekmeyi değiştirmez. Önizlemede native disabled/klavye ve panel değiştirme çalışır; paneller mounted kalır, iç form state'i korunur. Native change yalnız farklı etkin sekme seçilince bir kez ortak `change` aksiyonuna iletilir. Yeni veri/filtreleme motoru veya selected-tab değer binding'i eklenmez.
- En fazla 100 öğe. Yanlış parent, farklı tür çocuk, yetim parça, eksik/geçersiz başlangıç ID'si atomik reddedilir; tüm normal prop/slot/style sınırları sürer. Yapısal parça genel taşı/sar/yapıştır/sil yolu ile koparılamaz; grup paneli komutları sahipliği korur. Tek parça saved-design olarak kaydedilmez; grubu veya parça içindeki bileşenleri kaydet. İçerik normal palet/DnD/props araçlarıyla tasarlanır.
- Her koleksiyon işlemi tek undo'dur. Bağımsız kopya iç ID ve davranış referanslarını yeniden eşler, saved slot içeriğini bağımsızlaştırır; dış hedefli davranışları reusable-clone kuralıyla aktarmaz. Grup kopyalanırken `initialItemId` de yeni öğe ID'sine eşlenir. Silme/sıralama diğer öğelerin ID ve içeriğini korur.
- Legacy `list` (data + renderItem) aynen kalır; otomatik dönüşüm yapılmaz. Nested 12 / flat 1 korunur; yeni registry türleri eski uygulama sürümlerince desteklenmez. Yeni üst seviye belge alanı yoktur.
- TSX: Mantine gerçek List/Tabs compound parçaları; Ant List.renderItem ve Tabs.items; Material List/ListItem ve Tabs/Tab + ARIA panel yapısı. Material için üretilen küçük yerel state helper'ı sekme seçimini sürdürür. Native sekme değişimi ve form korunumu bağımsız export sayfasında test edilir. Genel uygulama olayları mevcut davranış manifesti/handoff sınırını korur; backend veya event handler uygulaması tamamlanmış sayılmaz.

Katalog: `authoring.collection` / `authoring.collectionItem`; agent tarifi (MCP reposunda `designer/contracts/data-display.md`). Bu ilk compound diliminde yalnız başlık, disabled, orientation, başlangıç ve içerik düzeni kayıtlıdır; tüm native Tabs.List/Tab API'si, yeni Accordion/Stepper/menü rolleri desteklenmiş değildir.

## Açılır bölüm / collapse-expand — 18 Ekim 2026

Mevcut `accordion` türü korunur; tek başlık ve normal `children` içerik ağacı taşıyan bağımsız açılır bölümdür. Kullanıcı veri listesi, activeKey, native value veya callback yazmaz. Mantine Accordion compound, Material Accordion/Summary/Details ve Ant Collapse.items üretimi adapter'a aittir. Birden fazla bölüm normal yerleşimle yan yana/alt alta eklenebilir; birbirini kapatan çok-bölümlü grup bu kapsamda değildir.

- Kayıtlı `title`, `defaultExpanded` (mevcut varsayılan true) ve `disabled` korunur. `false` geçerli kapalı başlangıçtır. Açılışta editör içeriği düzenleme için açık gösterir; “Tasarımda kapalı görünümü göster” / “İçeriği düzenle” geçici görünümü değiştirir. Bu seçim node props, undo/history, autosave, JSON veya TSX'e yazılmaz. Ağaçtan seçilen alt öğenin kapalı ataları düzenleme için açılır; pasif bölüm de ağaçtan düzenlenebilir. Mini editör içerik erişimi için açık kalır.
- `ComponentMeta.disclosure` başlık ve kayıtlı başlangıç prop anahtarlarını bildirir. `designExpanded` yalnız güvenilir renderer girdisidir; JSON'a kabul edilmez. Native başlık `data-disclosure-trigger` kimliğiyle doğrudan editör seçimine bağlanır; native olay tasarımda çalışmaz. Bu DOM işareti içerik gövdesini başlık sanmak için kullanılmaz; native aria-expanded trigger sınırı kontrol edilir.
- Preview başlangıç tercihini uygular. Header native mouse/klavyeyle aç/kapatır; pasiflik değişimi engeller. Adapter native event/value/key[] farkını tek boolean `onChange(isExpanded)` olayına dönüştürür. Gerçek durum değişiminde bir kez emit edilir; tasarımda emit yoktur. `previewValue` runtime `expanded`, başlangıç `defaultExpanded`, boş değer false, event `onChange`, read yalnız boolean olarak tanımlıdır. Mevcut koşul/toggle altyapısı bu değeri tüketebilir; native runtime `expanded` tasarım JSON'unda yazılmaz.
- Kapanan içerik normal hareket tercihinde mounted kalır, iç form değerleri ve nested bölüm durumu tekrar açmada korunur. Native transition/clipping korunur; yalnız `display:none` kontrolü kapanma kanıtı değildir. Önizlemeyi yeniden başlatma kayıtlı başlangıç/değerleri geri getirir.
- TSX native başlangıç props'una derlenir. Ant forceRender içerik mount politikasını, Material native summary göstergesi ve erişilebilir header/panel kimliklerini taşır. Genel davranışlar mevcut manifest/handoff sınırındadır; dış uygulama handler/servis kodu otomatik tamamlanmış sayılmaz.
- Şema 12 / flat 1 ve eski accordion belgeleri korunur. Yeni tasarım JSON alanı yoktur; metadata/preview değer sözleşmesi ve MCP katalog/rehber birlikte güncellenir. Native kütüphanenin tüm Collapse/Accordion API'si veya başlıksız harici tetiklenen yeni bileşen türü bu kapsamda değildir.


## Bağlı görünümler ve responsive props (v13)

Kanonik belge tek frame/node ağacıdır. Her flow 1440 px satırıyla başlar; son satır altındaki **Responsive görünüm ekle** yalnız eksik presetleri sunar. Frame'ler soldan sağa, görünüm satırları aşağıya sıralanır. Ara genişlikleri sırayla eklemek gerekmez. Satırlar aynı kimlik/content/state/event ağacını gösterir; kopya frame veya responsive köken ID'si üretilmez. Mobilde ek adım/yapısal alternatif bu sürümde yoktur.

Satır listesi yerel editör tercihidir, JSON değildir. Yeni ortamda import varsayılan 1440 satırını açar; tasarlanmış override'lar belgede korunur ve ilgili görünüm eklenince görünür. Boş bir görünüm eklemek belge/history üretmez. Ekranlar seçili genişlikte, aralarında 128 px boşlukla gösterilir; cihaz görseli veya ona ayrılmış kenar/üst/alt pay yoktur.

`responsiveProps` aynı node üzerinde opsiyonel breakpoint → scalar prop haritasıdır. Yalnız adapter `propsSchema.isResponsive: true` anahtarları (`authoring.responsivePropKeys`) kullanılabilir. Kabul edilen katmanlar `wide`, `lg`, `md`, `sm`, `xs`; `xl` reddedilir ve temel değer `props` içindedir. Öncelik **defaultProps → props → wide → lg → md → sm → xs**, aktif aralıkta durur. Aralıklar yukarıdaki style aralıklarıyla aynıdır; 375 bir örnek viewport, eşik değildir. Eksik anahtar miras alır; false/0/boş metin açık değerlerdir. Nesne, dizi, null, bağlama ifadesi, bilinmeyen anahtar/enum/tip reddedilir. Reset anahtarı siler; boş katman temizlenir. Tam belgede null geçersizdir; `update_design` merge patch içinde null silme işlemidir.

Örnek Mantine: `props: {children:"Başlık",size:"xl"}`, `responsiveProps: {md:{size:"lg"},xs:{size:"sm"}}`. 1440'ta xl, 1024'te xl, 768/576'da lg, 575/375'te sm. Başka node kendi değerlerine sahiptir. İçerik, HTML başlık seviyesi, kimlik/type, state/value ve olay/flow bağlantısı bu kanalla değişmez. Şu an opt-in: Mantine typography size/fw/c/ta ve button size/variant/color; Material typography variant/align ve button size/variant/color; Ant typography type/strong/italic ve button type/size.

Adapter `responsiveSemanticElement` veriyorsa HTML elemanı açık temel prop veya temel variant/default eşlemesinden türetilir; responsive görsel variant'tan türetilmez. Material Typography h3→h6 görsel değişimi aynı temel h3 elemanını korur; component prop'u paylaşılan ve responsive olmayan semantik seçimdir.

Nested/flat, saved subtree, clone, autosave, undo, MCP patch aynı alanı korur. Seçim bağlamı authored responsiveProps yanında türetilmiş effectiveProps verir; türetilmiş alan JSON'a geri yazılmaz. Tasarım/preview çözümü gösterilen genişliği kullanır. Aynı browser içindeki native library medya sorguları ayrı iframe viewport'u kazanmaz; özel adapter'ın viewport bağımlı davranışı ayrıca eşlenip test edilmelidir.

Native TSX handoff `data-designerprops` ile override niyetini taşır; bu attribute kendi başına runtime hook değildir. Üretim için React tarifi (MCP reposunda `designer/contracts/react-generation.md`) ve alan sözlüğü (MCP reposunda `designer/contracts/json-field-reference.md`) uygulanır. Kurum hook/mixin API'si profilde doğrulanmalıdır.


### Çoklu davranış notu düzenleyicisi

Editör notları başlık (`title`, isteğe bağlı) ve açıklama (`text`) olarak ayrı ayrı düzenler; tür seçimi göstermez. Yeni notlar mevcut `kind: "behavior"` varsayılanını kullanır. Mevcut türlenmiş notların `kind` değeri düzenlemede korunur; kategori alanı şemadan kaldırılmamıştır. Agent başlık/açıklamayı bağlı sayfa veya node bağlamıyla okur; kategoriye dayanarak eksik kural uydurmaz. Notlar çalıştırılabilir etkileşim veya doğrulama değildir.

Eski `notes`/`pageNotes` girdisi açıkça kaydedilirse başlık ve metni tek yeni `annotations`/`pageAnnotations` girdisine taşınır, eski metin alanı temizlenir. Node dönüşümü tek geri alma işlemidir. Açmak veya kapatmak belgeyi dönüştürmez. Ekle/güncelle/sil işlemleri kaydedilir; henüz eklenmemiş ya da kaydedilmemiş taslak kapatılınca bırakılır. Onay penceresi kapanırsa silme uygulanmaz. Pencerenin açık kalması, liste kaydırması ve geçici başarı mesajı JSON alanı değildir.

## Merkezi HTTP MCP ve browser persistence — 20 Ekim 2026

[Merkezi MCP sözleşmesi](../backend-mcp.md) backend /mcp + /ws, clientId/designId/editorId/content revision ve browser IndexedDB/receipt anlamının yetkili kaynağıdır. Merkezi browser mutation’ı aynı parser/merge patch/store/history yolunu kullanır; yeni DesignNode alanı veya JSON sürümü yoktur. Browser DB envelope revision’ı document.version (13) değildir. isPersisted=true kalıcı browser yazımının kabulüdür; timeout/unknown uygulanmamış anlamına gelmez. Kapanış ve retention sınırları merkezi sözleşmede tanımlıdır.

Merkezi iptal takibi: MCP transport session yalnız protokol korelasyonudur, clientId hedefleme yerini almaz. Başarısız uygulanmış receipt sonraki belge kaydıyla atomik kurtarılır; yanıt zarfı bozuksa INVALID_BROWSER_RESPONSE döner. Kanonik JSON v13 alanları değişmedi. Ayrıntı: [merkezi sözleşme](../backend-mcp.md).

## React 18.3.1 runtime — 22 Ekim 2026

Bu branch Designer runtime'ını React/React DOM **18.3.1** ile çalıştırır. Native bileşen, prop ve event eşlemeleri seçili adaptera aittir; kesin native sürümü kurumun package.json ve package-lock.json dosyaları belirler. Normal npm ci/peer denetimi kullanılır; legacy-peer-deps veya force ile uyumsuz peer kabul edilmez.

Giriş client tarafında react-dom/client createRoot kullanır. StrictMode ve effect mount/cleanup replay açıktır. Editör kimlikleri mevcut useStableId ile mount boyunca sabit ve kökler arasında tekildir; server hydration kontratı yoktur. Editör harici store abonelikleri React.useSyncExternalStore kullanır. React/ReactDOM/react-is ve React tipleri kök manifest overrides/resolutions ile 18.3.1'e eşlenir. Native adapter sürümleri değiştirilmez; editör common UI bu native paketlere bağımlı değildir.

Native tablo/sekme/uyarı eşlemesini seçili adapterın kaynak ve kataloğundan okuyun. Bunları DesignNode.props alanına kayıtlı olmayan native API adları olarak eklemeyin. Hedef uygulamanın native sürümünü kendi manifesti ve adapter sözleşmesiyle doğrulayın.


### Adapter görsel seçenekleri — 21 Ekim 2026
Ortak Düzen paneli yalnız layout alanlarını yazar. Renk, kenarlık ve diğer native görsel özellikler yalnız adapter propsSchema ile sunulur; keyfi style.color/backgroundColor/border/opacity/boxShadow alanları eklenmez.

Native renk seçeneklerinin kaynağı seçili adapterın propsSchema alanıdır. Aynı şema normal ve responsive prop değerlerine uygulanır. Kayıtlı olmayan değerleri başka library örneklerinden türetmeyin. Desteklenmeyen değerler sessizce dönüştürülmez; strict import reddi ve ham kayıt kurtarma yolu korunur. Kanonik JSON alanları/sürümü değişmedi.


## Seçili öğeyi parent içinde hizalama
Sağ tık komutları seçili öğenin kendisini hizalar: sola/sağa yasla, yatayda/dikeyde ortala. Container seçilirse kendi parentına göre hizalanır; çocukları topluca hizalanmaz. Flex ana ekseninde kardeşler ve gap sonrası kalan alan kullanılır; reverse yönler korunur. Grid referansı hücredir. Block/flow-root parent gerekli olduğunda column flex olur; parent padding/gap ve kardeş stilleri korunur. Sabit boyut/min/max korunur, hizalanan eksendeki fill içerik boyutuna döner. Frame yalnız yapısal bağlamdır. Absolute/fixed, overlay, named-slot kökleri desteklenmez. Yalnız mevcut responsive margin/size alanları yazılır; yeni JSON alanı yoktur. Ortak margin seçmek hizalama kenarlarını kaldırır. Parent ve öğe değişimi tek undo işlemidir.


## Geniş hücre tasarım çalışma alanı
Bağımsız tablo gövde hücresinde **Hücreyi tasarla** komutu yalıtılmış bir taslak açar. Native adapter bileşenleri sürükle-bırakla yerleştirilir; aktif görünümün düzen ve adapter opt-in responsive propları o breakpoint'e yazılır, içerik ortaktır. **Bitir**, hedef hücre hâlâ başlangıç içeriğiyle aynıysa yalnız o `slots.cellContents` box ağacını tek undo ile değiştirir; kimliği ve komşu hücreleri korur. Hedef değişmiş/silinmişse taslak uygulanmaz. **İptal** ana belgeyi değiştirmez. Taslak seçimi, geçmişi ve çalışma alanı boyutu JSON alanı değildir.

**Özel bileşen olarak kaydet**, isim verilmiş bağımsız snapshot'ı mevcut savedDesigns kitaplığına kaydeder; hücreye uygulama ayrıca Bitir ile yapılır. Kayıt sonrasında hücre taslağını iptal etmek açıkça kaydedilmiş özel bileşeni silmez. Saved-design referansları taslakta inline içerik olarak bağımsızlaştırılır; mevcut copy/clone sınırıyla dış etkileşim hedefleri yeniden kullanılabilir kopyaya taşınmaz. Satıra/sütuna kopyalama bütün hücre ağacını bağımsız ID'lerle çoğaltır; ortak şablon bağlantısı oluşmaz. Basit metne çift tık metin editörünü açmaya, rich hücreye çift tık ana tuvalde odaklamaya devam eder. Eski data/renderCell modu aynı kalır; yeni şema alanı yoktur.

## Adapter kaydı ve varsayılan seçimi

`src/adapters/index.ts` içindeki UI_ADAPTERS kayıt sırası dropdown ve katalog sırasıdır; ilk kayıt yeni tasarımların varsayılanıdır. Görünen version adapter geliştiricisi tarafından manuel tutulur; bundler sürüm enjekte etmez. Kayıtlı adapterId korunur. Kimliksiz tarihsel belge ve eski storage anahtarları LEGACY_ADAPTER_ID ile yorumlanır; sıralama değişikliği eski veriyi yeni kütüphaneye dönüştürmez. Yeni JSON alanı veya şema değişikliği yoktur.

## MCP ile ikon seçimi

MCP ikon keşfi `search_icons` ile çalışır. `queries` aynı çağrıda en fazla 30 ikon adı veya kısa ifade alır. `results` her ifade için sırayla `query`, kayıtlı `matches` kimlikleri ve kesilmeden önceki `total` sayısını verir. Editördeki ikon seçici aynı kelime eşlemesini ve sıralamayı kullanır. `limit` bütün yanıt için geçerlidir. Varsayılan 20 kimliktir. 21–30 ifade gönderildiğinde varsayılan bütçe ifade sayısına çıkar. Her eşleşen ifade ilk adayını aldıktan sonra sonraki adaylar sırayla dağıtılır. Bileşen ayrıntısındaki `glyph.searchTool` keşif aracını gösterir. Belge doğrulaması kayıtlı glyph kümesine göre yapılır.

## Bağımsız ikon authoring — 22 Ekim 2026

İkonun kullanım açıklaması, görsel ipuçları ve tarifleri aktif `IconLibrary.componentMeta` alanından ortak `icon` kaydına gelir. `description`, `visualHints` ve `recipes` mevcut katalog alanlarıdır; kaydedilen tasarımın alanlarını, varsayılanlarını veya native export anlamını değiştirmez. Kurum tanımları ve ilk taşıma için [ikon metadata rehberi](../icon-library-metadata.md) geçerlidir.

`type: "icon"` bütün aktif UI adapterlarında ortak kayıtlı bir yaprak bileşendir. `props.glyph` yalnız yapılandırılmış ikon kaynağının `libraryId:iconId` seçeneklerini veya açık boş stringi kabul eder; JSX, import yolu ve `item.*` bindingi değildir. `props.size` varsayılan 32 CSS piksel, 1–1024; `props.accessibleLabel` isteğe bağlıdır. Native görünüm `currentColor` mirasını kullanır; genel görünüm CSS’i açılmaz.

`src/adapters/iconLibrary/index.ts` içindeki tek `DESIGN_ICON_LIBRARY` teslimde `null` başlar. Böyleyken `ICON_CATALOG` ve MCP `iconLibraries` dizisi boştur, `ICON_GLYPH_OPTIONS` yalnız boş string içerir. Kurum kaynağı eklendiğinde katalog/arama/picker yalnız bu kaynağın öğelerini sunar; yeni varsayılan ilk kayıtlı öğedir. MCP alanının dizi biçimi korunur ve sıfır veya bir kaynak metadata’sı taşır. Kurulum [ikon kaynağı rehberindedir](../../src/adapters/iconLibrary/README.md).

Editör kontrollerinin Tabler ikonları `components/common/EditorIcon` alanında ayrıdır; tasarım içeriği `components/DesignIcons` yüzeyini kullanır. Lucide ve eski Tabler tasarım kaynakları `archive/iconLibrary` altında pasif örnektir. Runtime arşivden import yapmaz; arşivde bulunmak glyph’i geçerli yapmaz. Kayıtlı olmayan kimlik strict doğrulamada reddedilir, başka pakete sessizce dönüştürülmez.

İkonlar normal child ve adapterın desteklediği slot/hücre ağaçlarında aynı DesignNode’dur; nested/flat/autosave/MCP aynı kimliği korur. Native metadata, asenkron yükleme ve gerçek import/JSX eşlemesi seçilen kaynağa aittir. Açık boş glyph boyutu runtime ve TSX span kökünde korunur; açık layout width/height, size kaynaklı ölçüden önceliklidir. Açıklama kök erişilebilir etikete, açıklamasız ikon dekoratif davranışa eşlenir. Belge alanı veya şema sürümü değişmez.

Picker açılma/draft/search/scroll durumu belge değildir. Popover seçimi Tamam’a kadar taslaktır; iptal/dış tık/Escape belgeyi değiştirmez. Sağ panel seçimi tek prop/history işlemi uygular. 32px belge ölçüsüyle 22px katalog önizlemesi ayrıdır.
## Seçili tam ekranları dışa aktarma

Frame başlığı yanındaki checkbox bütün ekran içeriğini seçer/çıkarır; birden fazla ekran Cmd/Ctrl gerekmeksizin işaretlenir. Ekran sekmesi yalnız düzenleme/kamera odağıdır. Bileşen seçimi, bütün kök çocukları elle seçmek bile, otomatik frame seçimi değildir. Boş ekran düğmesiyle seçilebilir. Kısmi, karışık (referans görüntüsü dahil), eski/silinmiş, preview veya boş seçimde UI pasiftir, MCP hata verir. `selectedFrameIds` geçici editör bağlamıdır; belgeye/autosave/history'ye yazılmaz.

`export_selected_frames` öncesinde `get_editor_context` ready=true ve `frameExport.eligible=true` okunur. `frameIds`, o yanıtın **tam** `frameExport.frameIds` kümesi; `expectedVersion`, içerik revizyonudur. clientId/designId/editorId zorunludur. Seçim çağrı arasında değişmişse `FRAME_SELECTION_CHANGED`, belge değişmişse `DESIGN_CONFLICT` döner. Diğer seçim hataları `FRAME_SELECTION_REQUIRED`, `INCOMPLETE_FRAME_SELECTION`, `MIXED_SELECTION`, `STALE_FRAME_SELECTION`, `PREVIEW_DISABLED` kodlarıdır. Agent bileşenin parent frame'ini tahmin ederek kapsamı genişletemez.

Yanıt `document` (format nested varsayılan veya flat) ve `scope: {kind:'selected-frames', frameIds, overlayIds, omitted:{interactions,bindings}}` taşır. Yalnız document import edilir; scope yeni belge alanı değildir. Canonical sıra korunur; tam alt ağaç, slotlar, responsive değerler, frame/node notları ve sahip olunan overlay'ler dahil edilir. İlgili flow kayıtları daraltılır; başlangıç seçilmediyse ilk kalan normal ekran başlangıç olur. İlgisiz sayfa notları/annotations ve kayıtlı tasarım kitaplığı çıkarılır; yalnız kullanılan slot şablonları ve onların geçişli bağımlılıkları sabit ID ile korunur; eksik/döngüsel şablon INVALID_SAVED_CONTENT hatasıdır.

Kullanıcı kararıyla **seçilmeyen ekrana giden aksiyon dahil edilmez**. İç hedefli aksiyonun dış otherwise dalı çıkarılır; dış koşul kaynağı kullanan aksiyon bütünüyle çıkarılır. Dış kaynaklı textBinding/stateRules kaldırılır; authored fallback metin/görünürlük korunur. toggleBinding hedef listeleri kalan ID'lere daraltılır, tamamen boş binding kaldırılır. Çıkarılan kurallar scope.omitted ile raporlanır. Seçilen ekranlar arası ve sahip overlay'e bağlantılar korunur. Seçilmeyen ekran/stub/dış referans listesi eklenmez. Asıl belge, revision ve undo değişmez; `get_design` ve mevcut tam exportlar tam belgeyi vermeyi sürdürür.


23 Ekim ikon varsayılanı: yeni ikon ilk kayıtlı katalog öğesiyle oluşturulur; seçim penceresi açılmaya devam eder ve iptal varsayılanı korur. Açık boş glyph eski belgeler için geçerlidir; size ölçüsü boş ikon dahil runtime ve TSX köküne uygulanır, açık layout width/height değerleri önceliklidir.

Seçili ekran exportunda kullanılan özel slot şablonlarının geçişli bağımlılıkları da ayıklanır: her şablonun kendi iç hedefleri ve dahil ekran hedefleri korunur; dış hedefler çıkarılır ve omission raporuna eklenir. Kaynak şablonlar değiştirilmez.

## Adapter renk tokenları (v14)

DesignNode.styleTokens ve responsiveStyleTokens yalnız aktif adapter colorPalette
kimliklerini backgroundColor/color/borderColor anahtarlarına eşler. usagе izinleri
zorunludur; ham görünüm CSS yasağı devam eder. Frame/flow token taşıyamaz.
Desktop-first miras, sıfırlama, CSS var ve Sass/codegen ayrımı,
native root önceliği ve TSX aktarımı [renk kontratında](../adapter-colors.md).
Palette metadata runtime registry ile ilişkilidir; UI, MCP ve parser aynı kaynağı kullanır.
Adapter backgroundColor, palet örneği/frame/preview ortak varsayılanıdır; katalog aynı adlı token ID veya null döner. Bileşen renklerini ezmez, belge alanı/migrasyonu değildir. Hedef sayfa yüzeyi ve export sınırı renk kontratında tanımlıdır.

23 Ekim responsive seçim takip: checkbox yalnız her akışın en üst (en geniş mevcut) responsive satırında gösterilir. Seçim çerçevesi tüm görünüm kopyalarında canonical frame kimliğiyle görünür. İpucu tüm responsive görünümlerin dahil olduğunu açıklar. JSON/MCP/export içeriği değişmedi; yalnız kontrolün görünürlüğü değişti, authoringContract/guide güncellemesi gerekmedi.

23 Ekim frame-only seçim düzeltmesi: checkbox selectedFrameIds yazar, selectedNodeIds boşaltılır; iç bileşenlerde selection/resize işareti oluşmaz. Cmd/Ctrl ile ayrıca bileşen eklenirse karışık/kısmi seçim exportu kapatır. Yalnız frame ID seçimi export için yeterlidir; eski tam çocuk seçim temsili uyumluluk için okunabilir. Dış frame çizgisi 2px→2.5px. JSON belge şeması değişmez; editor context selectedNodeIds artık frame checkbox seçiminde boş döner. authoringContract ve JSON/react/prompt rehberleri güncellendi.

## Yerel tam belge kaydı — 23 Ekim

Lokal ve sunucu kullanımında IndexedDB `designs` tam belgenin tek kaynağıdır.
Kaydet mevcut designId'yi günceller; Kopyasını kaydet yeni aktif kimlik üretir.
Dosya → Tasarımlarım ve açılış modalı aynı listeyi açar. Yeni Akış önceki belgeyi
korur. Eski localStorage nodes şablonları taşınmaz; eski aktif taslak yalnız
IDB belgesi yoksa boot uyumluluğunda okunur. Client kimlik yedekleri, tercihler
ve yeniden kullanılabilir özel bileşen kitaplığı ayrı yerel kayıt amaçlarıdır;
tam belgeyle yarışan başka bir otomatik taslak yazılmaz. Şema/JSON alanı yok.
[MCP/kayıt ayrıntısı](../backend-mcp.md#indexeddb-ve-işlem-sonucu).

### 23 Ekim kayıt politikası güncellemesi
Tam belgeler ve özel bileşen kitaplığı yalnız IndexedDB'ye yazılır. Manuel Kaydet ve Ctrl/Cmd+S aynı designId'yi kaydeder; varsayılan kapalı otomatik kayıt son belge düzenlemesinden 5 saniye sonra işler. Boş yeni taslaklar kendiliğinden kayıt üretmez. Yeni/import/library geçişi mevcut kayıtları korur; kaydedilmemiş değişiklikleri bırakmadan önce kaydet/devam/iptal sorulur. Dirty/pending/error çıkış uyarısı ve hata sonrası read-only liste erişimi vardır. MCP mutation açık işlem olduğu için belge+receipt atomik kalıcılığı tercih kapalıyken de sürer. Canonical JSON sürümü değişmez; IDB metadata tercihi/özel bileşen kitaplığı export alanı değildir, savedDesigns tanımları JSON içinde korunur. localStorage'a yeni belge veya özel bileşen yazılmaz; legacy boot okumaları eski veriyi silmez.

23 Ekim ikon inspector notu: `accessibleLabel` sağ panelde düzenleme kontrolü olarak sunulmaz. Mevcut JSON değerleri kabul edilir ve runtime/export eşlemesi korunur; boş varsayılan değişmez.
