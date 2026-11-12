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
