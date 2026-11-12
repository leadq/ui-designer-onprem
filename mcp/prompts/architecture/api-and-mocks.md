<!-- rule
{
  "id": "api-mocks",
  "title": "RTK Query ve dev mock",
  "when": "detailed-react",
  "status": "needs-project-input",
  "targets": [
    "react"
  ],
  "phases": [
    "implement"
  ],
  "modes": [
    "detailed"
  ]
}
-->

# API ve geliştirme mock'ları

Kapsam: domain/ilişki/servis uygulaması yalnız Detailed modda, kullanıcı cevabı veya doğrulanmış proje kuralıyla yapılır. Bu rehberin servis/iş kuralları Basic kapsamını genişletmez; Basic yapısal form/wizard altyapısı için forms/wizard kullanır. authoring-modes önceliklidir.

Durum: needs-project-input. Görsel API URL, method, response veya interceptor kontratı vermez.

RTK Query için hedef projenin mevcut base API/injectEndpoints örneğini kullan. Yeni store veya
ikinci API client kurma. Generator'a base API importu/exportu, endpoint adı ve URL ancak doğrulandıktan
sonra verilir. Script boş response tipini `unknown` bırakır; servis kontratı öğrenilince daraltılır.

Mock fixture `src/mocks/<api-name>.json` içindedir. Ekipte dev modunda URL eşleme ile interception yapılır.
Hangi matcher/loader olduğu bilinmiyorsa MSW veya başka paket seçme. Fixture yaratmak interceptor'ı bağlamaz.
Mock'ları üretim trafiğine bağlama. Production/dev ayrımını proje örneğiyle doğrula.

Örnek servis verisini component içinde const dizi/nesne tanımlayıp doğrudan UI'a verme.
Ekran gerçek istek yapıyormuş gibi src/apis altındaki RTK Query servisini/hook'unu kullanır;
dev interceptor URL/metot eşlemesiyle src/mocks fixture'ına yönlendirir. Bu zincirin kayıt noktası
bilinmiyorsa sor; sadece JSON dosyası oluşturarak mock altyapısı kurulmuş sayılmaz.
Bu kural servis verisi içindir; yerel UI sabitleriyle karıştırma. Screenshot'taki örnek değerler
JSON tasarımında kullanılabilir; bunlardan gerçek endpoint kontratı türetilmez.

## Ekip dolduracak
- Base API ve endpoint örneği (query/mutation):
- URL constants ve cache/tag kuralları:
- Mock JSON şeması, URL matcher, HTTP method eşlemesi:
- Dev-only interceptor'ın kayıt noktası ve dev flag:
- Loading/error/empty senaryoları ve fixture örnekleri:

## Ekran içeriğini tamamlama

data-inference rehberiyle alan/lookup/bağımlılıkları ve fixture içeriğini çıkar. Yukarıdaki gerçek servis doğrulaması sınırı, mock verisini boş bırakmak anlamına gelmez. Ekip demo kontratını ve mock formatını tanımladıysa örnek satırları/ilişkileri doldur; demo olduğunu belirt. Gerçek API kontratı bulunmuyorsa production endpoint gibi sunma. Kuruma özgü boşlukları bu rehberin sahibi tamamlar.
