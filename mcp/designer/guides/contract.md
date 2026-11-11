# JSON kontratı

`get_design_catalog` güncel schema sürümünü ve gerçek registry prop/slot/state/export metadata'sını döndürür.
`validate_design` editörün kendi `parseDesignDocument` fonksiyonunu kullanır, normalize eder ve
flat belgeyi/manifesti aynı export kodundan türetir. Ayrı bir hayali import şeması yoktur.

## Minimal nested örnek
```json
{
  "version": 13,
  "adapterId": "mantine",
  "pageName": "Transfer",
  "pageNotes": "",
  "pageAnnotations": [],
  "nodes": [
    {"id":"flow-1","type":"designerFlow","label":"Transfer","props":{},"style":{},"children":[],"flow":{"layout":"root","startScreenId":"screen-1","screens":[{"nodeId":"screen-1","kind":"screen"}]}},
    {"id":"screen-1","type":"designerFrame","label":"Transfer bilgileri","props":{},"style":{},"children":[
      {"id":"card-1","type":"card","props":{},"style":{"display":"flex","flexDirection":"column","gap":16},"children":[
        {"id":"name-1","type":"textInput","props":{"label":"Ad soyad"},"style":{},"children":[]},
        {"id":"next-1","type":"button","props":{"children":"Devam"},"style":{},"children":[]}
      ]}
    ]}
  ]
}
```
Örnek minimaldir; üretimde component defaults ve geçerli native prop seçeneklerini katalogdan al.
`type` gerçek component anahtarıdır; `label` sadece kullanıcı adıdır. ID'ler belge içinde tekil ve kalıcıdır.
`designerFrame` ve `designerFlow` editör bağlamıdır; `props: {}` ve `style: {}` boş tutulur,
`responsiveStyles` ve `slots` verilmez.
Frame hedef React component'i değildir; sayfa/domain bileşenine içeriği yerleştirilir.
Bileşenler frame altında olmalı. Modal/notification kökte ve ownerFrameId ile sahip frame'e bağlıdır.

## Akış
Tek ekran dahil her belgede, root-level frame/overlay'lerle aynı nodes listesine boş children'lı bir `designerFlow` ekle:
`flow: {layout:"root",startScreenId:"screen-1",screens:[{nodeId:"screen-1",kind:"screen"},...]}`.
Her frame/overlay yalnız bir akışın screens listesinde bulunur. Frame içine frame koyma.
Akış kaydı olmayan frame editörün eski-belge dönüşümünde yeni frame içine sarılabilir;
MCP validator bunu üretim hatası olarak reddeder. Minimal örneği akış kaydıyla birlikte kullan.
Aksiyon gerçek tetikleyici node üzerinde:
`interactions:[{id:"next",trigger:"click",action:"goTo",intent:"formStep",targetNodeId:"screen-2"}]`.
`intent`: formStep / navigation / stateChange. Modal: action openOverlay veya closeOverlay; intent verilmez.
Modal node: type modal, overlay `{ownerFrameId:"screen-2",kind:"confirmation",initiallyOpen:false,withBackdrop:true}`.
Diğer kind'lar custom/smsOtp; notification için presentation notification. Frame isimleriyle hedef arama.

## State ve veri
Hedef node'da `stateRules.visibleWhen` / `enabledWhen`: `{match:"all"|"any",conditions:[...]}`.
Koşul `{source:{kind:"field",nodeId:"name-1"},operator:"notEmpty"}` veya equals + boolean/string/number value.
Destekli scalar field metadata'sı katalogdaki previewValue'dan gelir. `textBinding:{sourceNodeId:"name-1"}`
özet metnini bağlar. `prototypeHidden:true` başlangıç gizliliğidir. Bu alanlar tasarımda node'u saklamaz.

## Slots, notlar ve flat
`children` normal sıralı çocuklar; `slots:{slotKey:[nodes...]}` isimli içeriklerdir. Slot adlarını katalogdan al.
`annotations:[{id,kind:"behavior"|"validation"|"data"|"dependency"|"interaction",title?,text}]`; metinler kod değildir.
`responsiveStyles` anahtarları katalogdaki breakpoint'lerdir. Nested esas alınabilir; flat çıktı validator'dan alınır.

Yerleşim değerlerini yazmadan `layout` rehberini ve katalogdaki `authoringContract.styleResolution`
bilgisini oku: toplu boşlukların kenarları sıfırlama önceliği, özel kenar başlangıçları ve fill/auto
niyeti orada tanımlıdır. UI etiketleri veya 960px editör frame minimumu belge alanı değildir.
Flat `nodesById/rootIds/parentId/childIds/slotChildIds` tutarlılığı aynı parser ile doğrulanır.
Türetilmiş `behavior` manifestini elle değiştirme; kaynak interactions/stateRules/flow alanlarını düzenle.
Tam yürütme kuralları `execution-contract` rehberindedir; flow/state/slot varsa onu da oku.

Validator yalnız şema, referans, registry prop ve yerleşim kurallarını kontrol eder.
Tarayıcıdaki görünüm, native prop semantiği ve gerçek backend davranışı ayrıca doğrulanmalıdır.

`textBinding.designText` isteğe bağlı canvas örneğidir; üretim/runtime verisi değildir. Önizleme ve hedef React yalnız sourceNodeId değerini, boşken props.children fallback metnini kullanır.

## acceptedPropKeys: enforced input boundary

JSON `props` anahtarları seçili adapter/bileşenin `defaultProps` ve `propsSchema` kayıtlarından türetilir; TypeScript arayüzleri çalışma anında mevcut değildir. Katalogdaki `authoring.acceptedPropKeys` aynı ortak denetleyiciyi kullanır. `_tableEditor` gibi yalnız panel düzenleyicisi alanları prop değildir. Native kütüphanenin desteklemesi tek başına yeterli değildir. Kayıtlı slot prop’u yalnız saved-design ID/null kabul eder; inline slot adları da kayıtlı olmalıdır.

Bilinmeyen prop, slot veya bileşen bütün importu hata ile reddeder; açık tasarım/history/adapter değiştirilmez. `props.style`, `sx`, `className`, HTML/handler gibi kaçış alanları kabul edilmez. `style` ve her responsive katmanda yalnız katalogdaki `allowedLayoutKeys` değiştirilebilir. Renk/font/weight/line-height gibi görünüm alanları ancak bileşenin kayıtlı prop’uyla verilir. Adapter’ın sabit `defaultStyle` değerleri aynen round-trip olabilir; layout dışındaki değerleri değiştirilemez. Mevcut `item.field` / `{item.field}` veri bağlamaları kayıtlı prop anahtarlarında korunur; bu yollar kod çalıştırmaz.

Örnek: Mantine Typography için `props: {children: "ADIM 2 / 3", c: "black", fw: 400}` geçerlidir. Aynı node’da `props.color` veya `style.color: "#801d2d"` reddedilir. `style.gap: 32` ve `responsiveStyles.sm.padding: 8` geçerlidir. Diğer adapter için aynı prop isimlerini varsayma; kendi kataloğunu oku.

Bu sınır dosya/nested/flat, savedDesigns, yerel şablon/kayıt, preview, MCP import/update ve TSX çıkışında geçerlidir. Eski sürümler muaf değildir; güncel şema sürümü katalogdan alınır. Geçersiz yerel kayıt uygulanmaz. Özgün JSON `designer-rejected-json:` altında yedeklenir ve kurtarma penceresinden indirilir; yedek yazılamazsa autosave özgün anahtarı ezmez. Bu otomatik bir görünüm dönüşümü değildir: kullanıcı/agent bildirilen alanları kayıtlı prop’lara taşıyıp yeniden import eder. Yeni tasarım mevcut dosyanın görünümünü sessizce taklit etmez.
