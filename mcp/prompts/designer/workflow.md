<!-- rule
{
  "id": "designer-workflow",
  "title": "Designer oluşturma ve düzenleme",
  "when": "always",
  "phases": [
    "implement",
    "verify"
  ]
}
-->

# Designer oluşturma ve düzenleme

1. Ekran yapısı için ilgili pattern'ın tasarım tarifini ve gerçek adapter bileşenlerini kullan. Kaynak kod provider/router/API dosyaları Designer çizimi için önkoşul değildir.
2. catalog.authoringContract.jsonGeneration.steps ve styleResolution.sizingRules sırasını izle. Node/props/slot/layout/renk/responsive/ilişki alanlarını yalnız güncel teknik kontrat ve kayıtlı adapter yetenekleriyle oluştur. İzinli semantik Flex düzenini kullan; görsel piksellerini x/y kutularına çevirme.
3. Yeni ekranı validate_design ile doğrula. Mevcut ekranı değiştireceksen güncel context/document, kimlikler ve revision ile yalnız istenen node'ları patch et. Yeni ekran import_design, mevcut ekran update_design yolunu kullanır.
4. Canlı yazımda clientId, designId/editorId/version ve requestId sözleşmesini koru. get_design_import sonucunda applied ve isPersisted=true, ardından get_design readback doğrula. Belirsiz sonuçta aynı requestId ile durumu oku; körlemesine yeni işlem başlatma.
5. Mod kapsamındaki akışları ve kayıt/undo sonucunu doğrula. Görsel karşılaştırma istendiyse render-feedback ile istenen kapsamda incele. Validator/ACK görsel benzerlik kanıtı değildir.

## Form başlangıçları
Adapter previewValue.defaultProp bilgisini kullan; defaultValue/defaultChecked yalnız gerçek metadata öyle diyorsa yazılır. Placeholder doldurulmuş veri değildir; false ve 0 korunur. Save/Cancel etiketleri kendiliğinden submit/reset anlamı kazanmaz. Designer davranışı yalnız desteklenen JSON ilişkileriyle anlatılır; kaynak kod fonksiyonları JSON'a yazılmaz.

## Yerleşimi JSON'a çevirme

Her grup için dıştan içe ilerle: gerçek parent/slot → parent yönü → çocukların boyut niyeti → hizalanacak öğe veya grup → boşluk. Teknik alanları ve öncelikleri zorunlu `layout` rehberi ile `authoringContract.styleResolution.sizingRules` belirler; bu prompt yeni CSS/JSON yeteneği tanımlamaz.

- “Ortala” kararında neyin nereye göre ortalandığını belirle: parent'ın tüm çocukları mı, tek bir çocuk mu, native komponentin kendi metni mi? Başlığı ortalamak için bütün form alanlarını ortalama; sağdaki aksiyon için bütün parent'ı sağa yaslama.
- Native label/header/action slotunun iç düzenini keyfi wrapper'larla yeniden kurma. Komponent detayındaki sahiplik ve tarifleri uygula; bağımsız layout grubu yalnız gerçek bir ilişkiyi temsil etsin.
- Üretimi bitirmeden her değişen node için parent, etkin breakpoint, fill/auto/sabit boyut, min/max, margin ve adapter varsayılanlarının birlikte amaçlanan hizayı verdiğini denetle. `width:100% + maxWidth + alignItems:center` tek başına ortalama değildir; teknik rehberdeki niyete uygun örneği kullan.
- Aynı kontrolü kardeşlere de uygula: yalnız hedefe odaklanıp başlığı, diğer alanları veya aksiyon sırasını kaydırma. Validator sonucu bu görsel niyet kontrolünün yerine geçmez.
