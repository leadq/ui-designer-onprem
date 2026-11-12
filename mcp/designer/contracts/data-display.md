# Tablo, liste ve veri gösterimi

DataTable ve bağımsız itemList native adapter eşlemelerini kullanır. Legacy list mevcut veri/şablon sözleşmesini korur. Tablo için iki ayrı sözleşme vardır; karıştırma.

## Bağımsız hücreli tablo — temel tasarım deneyimi

Palet yeni tabloyu 6 sütun × 10 gövde satırı, `Column1`…`Column6`, `Row 1-1`…`Row 10-6` ile oluşturur.
Hücreyi seçip sağ panelde Hücre metnini düzenle düğmesini kullan; yalnız boş veya tek basit metinli hücrelerde sunulur. Rich hücrede alt bileşeni seçerek kendi özelliklerini/etkileşimlerini düzenle.
Başlığı/hücreyi çift tıklayarak metin düzenleme de korunur; başlık sağ tık menüsü veya sağdaki + ile sütun,
hücre sağ tık menüsü veya alttaki + ile satır ekle. Solda satır numaraları yoktur. Kolon ekleme kontrolü
başlık hücresi görünümünde ve başlıkla aynı hizada son sütunun hemen sağındadır; yatay kaydırmada başlıklarla birlikte hareket eder. Yeni satır/kolon ekleme kontrolleri yazı, boşluk ve kenarlıklarıyla native tabloyla aynı zoom oranında küçülüp büyür. Araya/sona eklenen hücreler **boştur**; mevcut kimlik ve içerik değişmez.
Hücre seçiliyken sağ panelden veya hücre menüsünden bütün içeriği satıra/sütuna bağımsız kopyala. Panel hedef içeriğin değişeceğini ve geri alınabileceğini açıklar. Hücre dışına bağlı davranışlar mevcut reusable-clone kuralıyla kopyalanmaz; hücre içindeki hedefler yeni kimliklere eşlenir. Birden fazla bileşen ve iç düzen birlikte kopyalanır;
hedef içerik değiştirilir, kaynak korunur. Bir işlem tek undo'dur. Hücreye bileşen eklemek için hücre menüsünü seç,
sonra ortak paleti kullan. Rich hücrenin iç bileşenleri normal seçim/props/ağaç araçlarıyla düzenlenir.

Sütun başlığına tek tık sağda Sütun özellikleri panelini açar; başlığı ve destek varsa Sütun içeriği hizası değerini değiştir.
Başlık veya gövde hücresi sağ tık menüsündeki sola/ortaya/sağa hizalama yalnız o sütunun native hizasını değiştirir.
JSON: `columns[].align` = `left | center | right`; alanı kaldırmak native varsayılanı geri getirir. Örnek: `{"key":"city","header":"Şehir","align":"right"}`.
`authoring.tableContents.columnAlignment` yok/null ise destek varmış gibi davranma. Mevcut üç adapter bu yeteneği bildirir.
Başlık ve gövde hizalanır; iç bileşenlerin açık hizalama/yerleşimleri ezilmez, hücre ağaçları değiştirilmez.
Seçili sütun key'i editor context'tir, JSON alanı değildir. Yeniden açılışta sütunu tekrar seç; header çift tık metin düzenleme de korunur.

Katalogdaki `authoring.tableContents` yeteneğini kontrol et. MCP/JSON tarifi (2×2 küçük örnek; tüm ID'ler benzersiz):

```json
{
  "id": "table", "type": "dataTable", "style": {}, "children": [],
  "props": {
    "columns": [{"key":"name","header":"Ad"},{"key":"city","header":"Şehir"}],
    "rows": [{"id":"row-a"},{"id":"row-b"}], "data": []
  },
  "slots": {
    "cellContents": [
      {"id":"a-name","type":"box","props":{},"style":{"minHeight":28},"children":[{"id":"a-name-text","type":"typography","props":{"children":"Ada"},"style":{},"children":[]}]},
      {"id":"a-city","type":"box","props":{},"style":{"minHeight":28},"children":[{"id":"a-city-text","type":"typography","props":{"children":"İstanbul"},"style":{},"children":[]}]},
      {"id":"b-name","type":"box","props":{},"style":{"minHeight":28},"children":[]},
      {"id":"b-city","type":"box","props":{},"style":{"minHeight":28},"children":[]}
    ]
  }
}
```

Bu node'u normal frame/flow içine yerleştir. `cellContents` satır önceliklidir; tam rows × columns sayısında
inline box kökü gerekir. Her kök kendi props/style/children/slots içeriğini taşır. Sütun `key` ve satır `id`
başlık/sıra indeksinden bağımsızdır. 1–20 sütun ve 1–100 satır desteklenir. Bağımsız modda `data` boş olmalı;
`renderCell` veya saved-design `cellContents` bağlama. Yeni satır eklerken yalnız `rows` değil ilgili boş
box köklerini de aynı değişiklikte ekle. Nested/flat export bütün alt ağaçları korur; TSX gerçek native tabloyu üretir.

Sağ panelde Değer tipi dolu sütun hücrelerinden otomatik çıkar: Sayı/Metin/Özel/Karma.
Boşlar atlanır (tamamı boşsa Metin); ondalık virgül/nokta sayılabilir; binlik ayırıcı tahmin edilmez.
Bu salt okunur bilgidir; değerleri değiştirmez. Tip/menü/+ kontrolleri JSON'a yazılmaz.

## Eski scalar/şablon tablolar

`rows` ve `slots.cellContents` yoksa `columns` + `data` aynı kalır. Plain hücreler değerleri string'e çevirir.
Kayıtlı `renderCell` slot tasarımda yalnız ilk hücrede örneklenir; önizlemede her hücreye uygulanır.
Bu eski belgeler açılınca 6×10'a büyütülmez veya sessizce yeni modele çevrilmez. Slot callback/context için
execution-contract rehberini oku. Liste `renderItem` davranışı değişmedi.

## Kapsam sınırı

Sorting, filtreleme, pagination, sticky header/row ve seçim bu fazda eklenmez.
Filtre inputları veya PDF/CSV düğmeleri tabloya kendiliğinden bağlanmaz. Screenshot'tan endpoint uydurma.
Eksik yeteneği not et; native kütüphanenin bütün API'sinin katalogda bulunduğunu varsayma.

## Tasarım-first liste ve sekmeler

Bağımsız öğeler için `itemList`; eski veri + ortak `renderItem` şablonu için `list` kullan. Birini diğerine sessizce dönüştürme. Kullanıcı paletten **Item List** ekler, **İlk öğeyi oluştur** ile boş öğeyi açar; ortak paletten içerik ekler. **Son öğeden kopyala** son öğenin bağımsız kopyasını ekler. İkinci öğenin metni/props/olay hedefi birinciyi değiştirmez. Dört boş rehber satırı gerçek içerik değildir.

**Tabs** iki sekmeyle başlar. Başlığa tıkla veya sağ panelde öğeyi seç; başlığı ve kendi özelliklerini düzenle, içine normal bileşenleri ekle. Pasif başlık tasarımda seçilebilir, native davranış önizlemede geçerlidir. **Yeni sekme** boş bir çift ekler; **Çoğalt** mevcut çiftin içeriğini de kopyalar. Panelde yukarı/aşağı/sil ve ayrı **Önizlemede ilk açılan sekme** bulunur. Tuvaldeki seçili sekme bu başlangıç tercihini değiştirmez.

MCP önce `itemList/listItem/tabs/tabItem` kataloğunu oku. Native callback/context yazma; `collectionEntries` veya `designItemId` JSON'a yazma. Örnek node (normal frame/flow içine yerleştir):

```json
{
  "id":"tabs-orders", "type":"tabs", "props":{"initialItemId":"tab-orders","orientation":"horizontal"}, "style":{},
  "children":[
    {"id":"tab-orders","type":"tabItem","props":{"label":"Siparişler","disabled":false},"style":{"padding":16},"children":[
      {"id":"orders","type":"itemList","props":{},"style":{},"children":[
        {"id":"order-a","type":"listItem","props":{},"style":{"padding":12},"children":[
          {"id":"customer-a","type":"typography","props":{"children":"Ada Tasarım"},"style":{},"children":[]}
        ]}
      ]}
    ]},
    {"id":"tab-delivery","type":"tabItem","props":{"label":"Teslimat","disabled":false},"style":{"padding":16},"children":[]}
  ]
}
```

- Her item node ID benzersizdir. Başlık/indeks ID değildir. `initialItemId` grubun kendi çocuğuna işaret eder; sıfır çocukta boş string kullan. Yeni sekmede label zorunlu metindir; disabled yoksa false.
- En fazla 100 öğe. Yetim listItem/tabItem, yanlış parent/çocuk türü ve bozuk başlangıç reddedilir. Yeni başlık/paneli ayrı eşleşme kayıtlarıyla oluşturma: tabItem ikisinin mantıksal sahibidir. Ekle/sil/sırala patch'i çocuklar ve gerekiyorsa initialItemId'yi atomik günceller.
- Kopyada bütün alt ID'leri ve iç referansları yenile; dış davranış hedefleri taşınmaz. Grup kopyasında initialItemId'yi de eşle. Saved slot'u bağımsızlaştırmadan “bağımsız kopya” deme.
- Kapalı panel içeriği nested/flat/TSX'te korunur. Başlık seçimi geçici editör durumudur; `get_editor_context` gerçek item node ID/path/parent bilgisini verir.
- Native `change` callback adapter tarafından tek ortak olaya çevrilir. UI davranışının JSON anlamı mevcut interactions kontratıdır. TSX native sekme geçişini üretir; genel olay/servis mantığı hâlâ tüketici uygulamanın sorumluluğudur.
- Yalnız kayıtlı başlık, disabled, orientation, başlangıç ve içerik düzenini kullan. Native kütüphanenin bütün compound API'si veya yeni Accordion/Stepper rolleri varmış gibi davranma.

## Açılır bölüm / Collapse, Expandable

`accordion` kataloğunu oku. Tasarımcı yalnız `title`, `defaultExpanded` ve normal `children` içeriği verir; native liste/activeKey/value/callback yazma. Örnek:

```json
{"id":"delivery-details","type":"accordion","props":{"title":"Teslimat ayrıntıları","defaultExpanded":false,"disabled":false},"style":{"width":480,"maxWidth":"100%"},"children":[{"id":"delivery-note","type":"typography","props":{"children":"Kapıya teslim"},"style":{},"children":[]}]}
```

Normal frame/flow içine yerleştir. Başlıkta tek tık bölüm özelliklerini seçer. “İçeriği düzenle” içeriği açar ve normal paletten eklemeye odaklar; “Tasarımda kapalı görünümü göster” yalnız editör görünümüdür. Kapalı/pasif içeriğe ağaçtan seçimle eriş; kapalı atalar açılır. `defaultExpanded` önizlemenin başlangıç tercihidir, tasarımda aç/kapat bunu değiştirmez. `designExpanded` veya runtime `expanded` JSON'a yazılmaz. Birkaç bağımsız bölüm için normal container çocukları olarak birkaç accordion ekle; tek açık grup davranışı varsayma.

Native render: Mantine Accordion.Item/Control/Panel, Material Accordion/Summary/Details, Ant Collapse.items. Adapter change olayını tek boolean açık/kapalı değerine normalize eder; previewValue.defaultProp=defaultExpanded ve prop=expanded. `disabled` preview toggle'ını engeller; tasarım düzenlemesini engellemez. Kapat/aç iç form değerlerini ve iç bölüm durumunu korur; Restart kayıtlı başlangıcı geri getirir. Render ve TSX kütüphanenin kendi görünümünü korur. Genel olay/servis uygulaması davranış manifestinden geliştiriciye aktarılır.


## Geniş hücre tasarım çalışma alanı
Bağımsız tablo gövde hücresinde **Hücreyi tasarla** komutu yalıtılmış bir taslak açar. Native adapter bileşenleri sürükle-bırakla yerleştirilir; aktif görünümün düzen ve adapter opt-in responsive propları o breakpoint'e yazılır, içerik ortaktır. **Bitir**, hedef hücre hâlâ başlangıç içeriğiyle aynıysa yalnız o `slots.cellContents` box ağacını tek undo ile değiştirir; kimliği ve komşu hücreleri korur. Hedef değişmiş/silinmişse taslak uygulanmaz. **İptal** ana belgeyi değiştirmez. Taslak seçimi, geçmişi ve çalışma alanı boyutu JSON alanı değildir.

**Özel bileşen olarak kaydet**, isim verilmiş bağımsız snapshot'ı mevcut savedDesigns kitaplığına kaydeder; hücreye uygulama ayrıca Bitir ile yapılır. Kayıt sonrasında hücre taslağını iptal etmek açıkça kaydedilmiş özel bileşeni silmez. Saved-design referansları taslakta inline içerik olarak bağımsızlaştırılır; mevcut copy/clone sınırıyla dış etkileşim hedefleri yeniden kullanılabilir kopyaya taşınmaz. Satıra/sütuna kopyalama bütün hücre ağacını bağımsız ID'lerle çoğaltır; ortak şablon bağlantısı oluşmaz. Basit metne çift tık metin editörünü açmaya, rich hücreye çift tık ana tuvalde odaklamaya devam eder. Eski data/renderCell modu aynı kalır; yeni şema alanı yoktur.
