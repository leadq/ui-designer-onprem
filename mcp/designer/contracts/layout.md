# Yerleşim ve responsive

## Öncelik: sade CSS ve Flex

- Yerleşimi anlamlı iç içe Flex grupları, gap, padding, alignItems/justifyContent ve doğal boyutlarla kur. Basit bir Box eklemek hesabı kaldırıyorsa tercih et; anlamsız wrapper zinciri üretme.
- Örneğin yanlardan boşluk için width: calc(100% - ...) yerine uygun kapsayıcı padding'i ve alanı dolduran çocuk kullan. Parent-child ilişkisini CSS aritmetiğine dönüştürme.
- Ortalamada önce Flex hizalamasını düşün; bağımsız bir blokta margin:auto gerekiyorsa kullanılabilir.
- Kart/form içi düzenlerde Grid kullanma. Gerçek iki boyutlu büyük sayfa ihtiyacı veya açık kullanıcı talebi dışında Grid seçme; ihtiyaç varsa gerekçesini açıkla. Mevcut Grid belgeleri desteklenmeye devam eder.
- calc() ve karmaşık iç içe ölçü ifadeleri başlangıç çözümü değildir. Sade Flex/spacing ile çözülemeyen gerçek zorunlulukta gerekçesini belirt.

## Hizalamanın sahibi ve ekseni

Önce etkin parent yönünü çöz. Flex row'da ana eksen yatay, column'da dikeydir; reverse yönlerde başlangıç/bitiş tersine döner. `justifyContent` ana eksende çocuk grubunu, `alignItems` çapraz eksende çocukları hizalar. Bunlar container'ın kendi parent'ındaki konumunu belirlemez.

- Bütün kardeşlerin ortak hizası parent'a aittir. Tek çocuğun çapraz eksen istisnası `alignSelf` olabilir; fill dönüşümü ve auto margin önceliğini aşağıdaki boyutlandırma kurallarından denetle.
- Tek çocuğun ana eksen yerleşimi için `alignSelf` kullanma; uygun eksendeki auto margin kalan alanı paylaşır. Auto margin varken parent hizalaması aynı boşluğu ikinci kez dağıtmaz. Kardeşler varsa referans tüm parent'ın geometrik merkezi değil kalan alandır; bütün bir grubu ortalamak gerekiyorsa grubu temsil eden kapsayıcıyı hizala.
- Komponent kutusunun konumu ile içindeki metin/ikonun hizası ayrıdır. Native içerik hizasını yalnız katalogda sunulan prop/slot tarifiyle ayarla; dış Flex hizasının label veya başlık metnini de ortalayacağını varsayma.
- Named-slot kökü, native header/label ve yapısal frame sıradan layout parent'ı değildir. Slot için component kontratı geçerlidir; frame props/style alanlarını boş tut, gerektiğinde içine gerçek bir layout container ekle.

## Boyutlandırma
`defaultStyle` → `node.style` sırasıyla birleşir; style boşsa varsayılanlar kaybolmaz.
Box'ın varsayılan minHeight/padding değerleri küçük buton gruplarını da büyütebilir.
Sıkı bir grup için bunları açıkça `minHeight: 0, padding: 0` yap, sonra gap/padding ekle.
Card'ın padding/radius/shadow değerlerini katalogdaki native seçeneklerden seç.
`style` yalnız yerleşim içindir; renk/font/radius ile görselin temasını kopyalama.
Sayısal boyutlar px, flexGrow gibi birimsiz CSS özellikleri birimsizdir; `"100%"`, `"auto"`
gibi yerleşim değerleri string olabilir. Genişlik + padding için boxSizing: border-box kullan.

### Alanı doldur
`width: "100%"` / `height: "100%"` editörün **kalan alanı doldur** niyetidir.
Parent'ın güncel yönü ve breakpoint'i üzerinden çözülür: Flex ana ekseninde alan paylaşımı,
çapraz eksende stretch, Grid'de hücreyi doldurma. Normal akışta dikey fill için column bağlamı sağlanır.
Kardeşler, padding/gap/margin ve min/max sınırları hesaba katılır. Kaydedilen niyet yerine
ölçülmüş px veya türetilmiş flex CSS yazma. İçeriğe göre boyuta dönmek için `"auto"` yaz;
alanı silmek küçük breakpoint'te üst boyutun fill değerini yeniden devralabilir.
`auto` yalnız fill dönüşümünü kaldırır; ayrıca yazılmış flexGrow/alignSelf veya parent stretch
devam edebilir. Mevcut tasarımı değiştirirken bu kısıtları da amaçlanan hizalamaya göre düzenle.

Her node ve hedef breakpoint için `authoringContract.styleResolution.sizingRules` sırasını
uygula: native/default + authored katmanlar → aynı breakpoint'teki parent → fill dönüşümü →
min/max ve margin. Fill ana eksende yazılmış flexGrow/flexShrink/flexBasis'i, çapraz eksende
alignSelf'i geçersiz kılar. **maxWidth konum değil sınırdır.** Column parent'ın alignItems:center
değeri, width:100% çocuğun alignSelf:stretch dönüşümünü engellemez.

Ortalanmış, dar ekrana sığan 640px bölge için sıradan parent node'da
`{"display":"flex","flexDirection":"column","alignItems":"center","padding":32}`;
çocuk node'da `{"width":640,"maxWidth":"100%","minWidth":0,"boxSizing":"border-box"}` kullan.
Burada maxWidth:100% fill değildir. Fill korunacaksa çocukta
`{"width":"100%","maxWidth":640,"marginLeft":"auto","marginRight":"auto","minWidth":0,"boxSizing":"border-box"}`
kullan; paired auto margin kalan yatay alanı paylaşır. Aynı çözüm Card'a özel değildir.
Yalnız width:100% + maxWidth:640 + parent alignItems:center kullanmak ortalama sağlamaz.
Native margin/border ve minWidth gibi ek kısıtları kullanılan component details'ten denetle.

### Toplu ve özel kenar boşlukları
Editör seçenekleri 0–120 px, 4 px adımlıdır; yalnız margin için `"auto"` sunulur.
Bunlar JSON şema sınırı değildir; mevcut diğer geçerli CSS ölçüleri korunur.
`"Özel Değerler"`, `"Boşluk yok"`, bölümün açık/kapalı durumu gibi UI metinlerini JSON'a yazma.

- Toplu değer: ilgili style katmanına `padding` veya `margin` yaz; aynı katmandaki dört kenar
  anahtarını kaldır. Responsive katmanda bir shorthand, üst katmandan gelen o grubun
  kenar override'larını da temizler. Diğer stilleri koru.
- Ortak ve custom boşluk modları birbirini dışlar. Custom moda geçerken shorthand'ı kaldır;
  mevcut çözülmüş boşluktan dört kenarı doldur ve seçilen kenarı değiştir. Yalnız dört kenar
  değeri uygulanır; üst katman shorthand'ı bu tam kenar grubuna karışmaz. Boş custom alan 0px olur.
- Bölümü açmak veri değişikliği değildir. Var olan bir belgede kenar tanımsızsa mevcut
  shorthand veya adapter varsayılanından hesaplanır. Eski kayıtları sırf göstermek
  için sıfırlama. Tam JSON'da silinen anahtarlar bulunmaz; `undefined` yazılmaz.

Özel kenarlar → küçük boyutta toplu değer örneği (node'un stil alanları):
```json
{"style":{"paddingTop":"0px","paddingRight":"48px","paddingBottom":"0px","paddingLeft":"48px"},
 "responsiveStyles":{"sm":{"padding":"12px"}}}
```
Bu örnekte sm/xs'de dört kenar 12px'tir; üst boyuttaki 48px kenarlar taşınmaz.

### Editör bağlamı
Frame tasarım yüzeyinin minimum yüksekliği 960px'tir ve içerikle büyür. Bu değer
`designerFrame.style` içine yazılmaz; yapısal props/style boş kalır. Preview kendi viewport'unu
kullanır, TSX frame için DOM wrapper üretmez. Gerçek uygulama yüksekliği gerekiyorsa hedef
sayfa host'unda belirlenir. Zoom, focus, panel başlıkları ve açılır bölüm durumu JSON'a girmez.

## Breakpoint mirası
Bu sistem desktop-first çalışır. `style` temel/XL görünümüdür; `responsiveStyles.xl` kullanılmaz.
Aktif aralık genişliğe göre belirlenir: xl >=1440, wide 1200–1439, lg 1024–1199,
md 768–1023, sm 576–767, xs <576. Katalogdaki 375, telefonun örnek viewport genişliğidir.
Temelden sonra wide → lg → md → sm → xs ekleri yalnız aktif anahtara kadar birleşir.
Örneğin md override'ı sm/xs'de de geçerlidir; xs override'ı desktop'ta uygulanmaz.

```json
{"style":{"display":"flex","flexDirection":"row","gap":24},
 "responsiveStyles":{"sm":{"flexDirection":"column","gap":16}}}
```
Bu örnek 768 ve üzeri iki kolon, 768 altı tek kolondur. `responsiveStyles` yalnız style
özellikleri taşır, bileşenin props değerlerini değiştirmez. İki çocuk olduğunda bu düzen yan yana/alt alta görünür;
çocukların boyutlarını ayrıca içerik veya alan paylaşımı niyetine göre belirle. Gerektiğinde flexWrap kullan.

## Kontrol
- Referans veya istek ortalanmış içerik gerektiriyorsa maxWidth içerik grubunu uygun hizalama kuralıyla ortala. Sola yaslı ekranı kendiliğinden ortalama; ilişkilere göre iç içe Flex kur.
- Daralması gereken flex/grid çocuklarına minWidth: 0 ver. Geniş tabloyu overflowX: auto olan
  ayrı grupta tut; sayfanın tamamını yatay taşırma.
- Yalnız desktop görüntüsünden mobil kuralları kesinmiş gibi çıkarma; varsayım olarak not et.
- Editörde seçilen ekran genişliği ve bağımsız önizlemenin gerçek viewport'u ayrı şeylerdir.
  Mobil kanıtı için gerçek dar viewport'ta test et, sonra testi sıfırla.
- Validator geçmesi yerleşim kanıtı değildir: sarma, taşma, içerik yüksekliği ve native kontrolleri
  tarayıcıda kontrol et. Frame adı/ID/hiyerarşisinin import sonrasında korunduğunu da karşılaştır.


JSON sınırı bütün yükleme yollarında zorunludur: yalnız bileşenin `authoring.acceptedPropKeys` anahtarlarını yaz. Layout için `authoringContract.allowedLayoutKeys` kullan; renk/font değerini style/responsive içine kaçırma. Hata node/alan yolunu gösterir; desteklenen prop varsa ona taşı, yoksa yetenek eksikliğini belirt. Hatalı belge uygulanmaz. `contract` rehberindeki katı JSON sınırını oku.


Bağlı görünüm satırları aynı frame ağacını paylaşır; satır/cihaz kabuğu editör tercihidir. Stil dışındaki native görünüm değişimleri için yalnız katalog responsivePropKeys izinleriyle responsiveProps kullan; [alan sözlüğü](json-field-reference.md#responsive-props) ve [React hook tarifi](react-generation.md#responsive-propları-kurum-hookuna-çevir) geçerlidir.


## Seçili öğeyi parent içinde hizalama
Sağ tık komutları seçili öğenin kendisini hizalar: sola/sağa yasla, yatayda/dikeyde ortala. Container seçilirse kendi parentına göre hizalanır; çocukları topluca hizalanmaz. Flex ana ekseninde kardeşler ve gap sonrası kalan alan kullanılır; reverse yönler korunur. Grid referansı hücredir. Block/flow-root parent gerekli olduğunda column flex olur; parent padding/gap ve kardeş stilleri korunur. Sabit boyut/min/max korunur, hizalanan eksendeki fill içerik boyutuna döner. Frame yalnız yapısal bağlamdır. Absolute/fixed, overlay, named-slot kökleri desteklenmez. Yalnız mevcut responsive margin/size alanları yazılır; yeni JSON alanı yoktur. Ortak margin seçmek hizalama kenarlarını kaldırır. Parent ve öğe değişimi tek undo işlemidir.
