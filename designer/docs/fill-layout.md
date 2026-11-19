# Alanı doldur

> Bu teknik rehberdeki test komutları geliştirme reposuna aittir. Teslim branch’inde test runner yoktur; kurum adapterı kabulü docs/component-adapter-checklist.md üzerinden yapılır.

`Alanı doldur`, parent'ın tamamı değil; padding, gap, margin, kardeşler ve boyut sınırlarından sonra kullanılabilir alan demektir. Birden fazla fill öğesi serbest alanı paylaşır. Minimum/maksimum sınırlar ve içerik gereksinimleri payları etkileyebilir.

## Sözleşme

- Mevcut `style.width/height: "100%"` ve responsive karşılığı inspector'ın fill temsilidir. Yeni bir belge alanı/sürümü eklenmedi. Keyfi yüzde değerleri aynen kalır.
- Render sırasında `src/utils/layout/getNodeSizingStyle.ts` parent'ın güncel breakpoint düzenine göre CSS üretir. Kaydedilen stil değiştirilmez; parent yönü veya hiyerarşi değişince tekrar çözülür.
- Flex ana ekseni grow ile kalan alanı paylaşır; çapraz eksen stretch kullanır. Dikeyde içerik tabanı korunur, böylece minimum yüksekliği olan frame uzun içerikle büyür.
- Grid modunda öğe kendi hücresini doldurur. Normal akışta yatay fill auto block genişlik kullanır; dikey fill çocuğu olan normal kapsayıcı column Flex dağıtım bağlamı sağlar.
- Native container varsayılanları adapter'da belirtilir. Prop'a bağlı varsayılanlar `ComponentMeta.getDefaultLayoutStyle` üzerinden gelir; çekirdek library adını bilmez.
- Ant Card'ın iç body katmanı yerleşimi devralır ve native padding'i korur. Diğer native slot/wrapper'lar kendi adapter sözleşmesinden sorumludur; slot kökü normal child'ın parent Flex bağlamını yanlışlıkla devralmaz.
- `İçeriğe göre` açık `auto` kaydeder. Böylece küçük breakpoint'teki seçim JSON round-trip sırasında üst breakpoint'teki fill değerine geri dönmez.
- Eski `flexGrow:1` belgeleri desteklenmeye devam eder. Bunlarda ayrı eksen niyeti bulunmaz; yeni fill seçimi ekseni width/height üzerinden kalıcılaştırır.

## Agent için çözüm sırası ve hizalama

1. Aktif breakpoint'te native props ve adapter layout varsayılanlarını, ardından `style` ve
   responsive katmanları çöz. Parent yönünü de aynı breakpoint'te belirle. Eksik anahtar miras alır;
   `auto` fill dönüşümünü kaldırır; ayrıca yazılmış flexGrow/alignSelf ve parent hizalaması
   uygulanmaya devam eder. Niyet değiştiğinde bu kısıtları da kontrol et.
   Yalnız **width/height içindeki tam `"100%"`** fill tetikler;
   `maxWidth: "100%"` normal bir sınırdır.
2. Ana eksen fill, yazılmış flexGrow/flexShrink/flexBasis değerlerinin önüne geçer:
   row/row-reverse width → `width:auto, flexGrow:1, flexShrink:1, flexBasis:0`;
   column/column-reverse height → `height:auto, flexGrow:1, flexShrink:1, flexBasis:auto`.
   Dikey fill kendi başına parent'a kesin yükseklik vermez.
3. Çapraz eksen fill, `alignSelf:stretch` ve o boyutta `auto` üretir. Böylece parent'ın
   `alignItems:center` ve çocuğun yazılmış `alignSelf:center` değeri geçersiz kalır.
   İlgili eksende auto margin veya margin shorthand içinde herhangi bir auto varsa boyut
   `100%` tutulur ve border-box uygulanır; konumu CSS auto margin belirler.
   Grid fill, hücrede width için justifySelf:stretch, height için alignSelf:stretch üretir.
4. Min/max ve margin korunur. **Max sınırı konum belirlemez.** Native içerik, padding/border,
   kardeşler ve kullanılabilir alan son geometriyi belirler. Bu türetilmiş CSS'i JSON'a geri yazma.

Ortalanmış, en çok 640px dış genişlikte bölge için sıradan bir parent/child örneği:

```json
{
  "parentStyle": {"display":"flex","flexDirection":"column","alignItems":"center","padding":32},
  "style": {"width":640,"maxWidth":"100%","minWidth":0,"boxSizing":"border-box"}
}
```

Buradaki `parentStyle` yalnız örnek etiketidir; gerçek parent node'un `style` alanına uygulanır.
Yapısal frame/flow'a stil yazılmaz. 1440px parent'ta child x=400,width=640; 375px parent'ta
32px iki yan padding sonrası x=32,width=311 (native margin/border veya ek kısıt yoksa).
Fill niyetini koruyarak aynı konum için çocukta `width:"100%", maxWidth:640,
marginLeft:"auto", marginRight:"auto"` kullanılabilir.

Karşı örnek: column parent'ta `alignItems:center` ve çocukta `width:"100%", maxWidth:640`
birlikte **ortalamaz**; stretch, maxWidth'a kadar genişletir ve artan alan varsa çocuk başta kalır.
Bu geçerli JSON'dur; validator tasarım niyetini tahmin edip reddetmez.

MCP `authoringContract.styleResolution.sizingRules` bu mevcut davranışı koşul/sonuç/öncelik
ve test edilen örnekler olarak sunar. Component recipe native bileşimin sahibidir; ortak sizing
anlamını değiştiremez. Şema ve resolver davranışı bu açıklamayla değişmemiştir.

## Frame ve çıktı

Frame editör bağlamıdır; native Box değildir. Tasarımda minimum 960px, preview'da kullanılabilir viewport yüksekliği temel alınır; uzun içerik doğal olarak büyüyüp scroll eder.

JSON fill niyetini saklar. TSX aynı çözümleyiciyle temel breakpoint CSS'ini çıkarır, responsive metadata'yı korur. Frame TSX'e wrapper olarak eklenmez. Bu nedenle doğrudan frame'in dikey fill çocuklarını kullanan **hedef sayfa host'u column Flex ve kullanılabilir yükseklik sağlamalıdır**; çıktı bunu yorumla belirtir. Responsive metadata'nın runtime uygulanması mevcut TSX handoff sözleşmesindeki gibi hedef projeye aittir.

## Doğrulama

- `npm test -- responsive-fixtures.test.ts fill-layout.test.ts center-layout.test.ts responsive-props.test.ts`: breakpoint, kalan alan hesabı, min/max, yön değişimi, JSON ve TSX kontrolü.
- `npm run test:layout` (`tests/layout/fill-layout.spec.ts`): üç native adapter için piksel ölçümleri; bağımsız fixture, editör storage'ına dokunmaz. Kendi geliştirme sunucusunu kullanır; üretim preview sunucusunda test kaynakları bulunmaz.
- Fixture `/tests/fixtures/fill-layout.html`: frame, row, column, grid, max sınırı, nested, Card, büyüyen içerik ve normal akış örnekleri.
- 2026-10-14: in-app browser'da üç adapter için 45 geometri kontrolü geçti (39 boyut + 6 Card gap/padding); gerçek kullanıcının preview'ında viewport/frame/Box yükseklik eşitliği doğrulandı. Bu tarihli kontrol bütün tarayıcı motorlarının testi değildir. Ayrı Playwright motor matrisi bu oturumda çalıştırılmadı.
