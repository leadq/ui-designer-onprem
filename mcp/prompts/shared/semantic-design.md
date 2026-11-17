<!-- rule
{
  "id": "semantic-design",
  "title": "Semantik tasarım ve tema",
  "when": "always",
  "status": "ready",
  "targets": [
    "design",
    "react"
  ],
  "phases": [
    "implement"
  ]
}
-->

# Görseli bileşenlerle yorumlama

- Önce sayfanın işini bul: bilgi girişi, filtre/arama, veri gösterimi, dashboard veya adımlı işlem.
- Ana bölümleri ve yakınlık ilişkilerini çıkar. Card, Button, Select, DataTable gibi registry türlerini kullan.
- Birincil/ikincil/tehlikeli buton rollerini ayırt et; seçili adapter'ın geçerli varyantını seç.
- Varsayılan mevcut UI kütüphanesi temasıdır: görselde mor olan primary buton, hedef temada kırmızıysa kırmızı kalır. Rolü ve native varyantı eşleştir.
- Tasarım motorunun kendi bordo editör tokenları hedef UI kütüphanesinin tokenları değildir.
- Önce defaultProps/defaultStyle, sonra propsSchema'nın izin verdiği seçenekler. Native kütüphanenin
  keyfi CSS kabul etmesi serbest tema değiştirme izni değildir. Katalogda olmayan prop icat etme.
- Yalnız yerleşim için öncelikle iç içe Flex, gap/padding ve doğal boyut kullan; absolute koordinatlarla ekranı çizme. Sade bir Box grubu karmaşık CSS hesabından önce gelir; Grid'i varsayılan çözüm seçme.
- İzinli spacing/radius seçenekleri biliniyorsa onlardan seç. Katalogda bulunmuyorsa keyfi tema değeri verme;
  mimari profilin token rehberini sor veya default bırak.
- Required yıldızı zorunlu alan ipucudur; Next'in disabled olması, API validasyonu veya regex için kanıt değildir.
- Dekorasyonun anlamı belirsizse not düş. Sahte asset URL'si, ikon paketi veya yeni bağımlılık oluşturma.
- Önizlemede ve export'ta desteklenmeyen native davranışları açıkça bildir.

## Tema tercihi

Varsayılan seçili UI kütüphanesi temasıdır; tema sorusu sorma. Kullanıcı açıkça tema uyarlaması isterse aşağıdaki destek sınırları uygulanır. Kart padding, kardeş gap, hizalama ve ölçü oranları tema değildir; referansın yerleşimine yaklaştırılır.

Kaynak aynı kütüphaneden geliyorsa önce gerçek komponenti ve görünür durumuna uygun kayıtlı prop/slot/recipe'yi bul. Başka kütüphaneden geliyorsa rolü ve yapısı en yakın desteklenen komponenti seç; benzer silüet uğruna input'u Box/Text ile taklit etme. İki durumda da içerik, hiyerarşi, hizalar ve oranlar korunur. Kaynağın font/radius/gölgesini kopyalamak için ek tema üretme; katalogdaki native seçenekler yetmiyorsa kalan farkı bildir. Tema farkı, yanlış parent veya eksik label için gerekçe değildir.

- **Mevcut tema:** renkleri kopyalama; primary/secondary, Card ve native boyut/varyantları kullan.
- **Görsele yaklaş:** yine gerçek komponentleri kullan. Önce katalogdaki izinli seçenekleri ve hedef projenin mevcut tema/token API'sini incele. Gerekli tema ayarını ortak provider/token katmanında, kullanıcının istediği kapsamda öner; component başına rastgele renk/style ekleme. Global temayı etkileyecek kapsam belirsizse sor.
- Designer JSON'da keyfi renk/font/radius stilleri ve tema yapılandırma alanı desteklenmez; validate_design sınırları aynen geçerlidir. İstenen eşleşme katalogla mümkün değilse farkı bildir ve kullanıcıyla mevcut temalı taslak veya hedef React projesinde tema uyarlaması yolunu netleştir. Yeni JSON alanı uydurma, validator'ı atlama.

## Ölçek referansı

Görsel pikseli her zaman CSS pikseli değildir: retina/DPR, browser zoom, kırpma ve yeniden boyutlandırma etkiler. Dosya width/height bilgisini otomatik viewport kabul etme; MCP normalize edilmiş görselin ölçülerini verir.

1. Önce verilen bilgiyi kullan. Bilgi yoksa tercihen görselin yaklaşık yarısı genişliğindeki sınırları belirgin modal/kart/panelin yaklaşık CSS genişliğini sor; width height'a tercih edilir. Bunun da bilinmediği durumda orijinal screenshot browser'ının CSS viewport genişliğine geç (aynı capture koşulunda window.innerWidth/document.documentElement.clientWidth). Body max-width/scroll yüzünden viewport olmayabilir; dosya pikselinden veya ilgisiz güncel sekmeden eski capture genişliği okunamaz. Kaynak CSS viewport veya aynı düzlemde kart/modal referans genişliği güvenilir biçimde bilinmiyorsa Basic ve Detailed iki modda da mutlaka “Bu görüntü hangi viewport genişliğinde alındı; bilmiyorsanız modal/kartın yaklaşık genişliği belli mi?” diye sor. Gerekliyse yükseklik, kırpma ve zoom bilgisini aynı soruda iste; kullanıcının inspect yapmasını zorunlu kılma.
2. Aynı görüntü düzlemindeki bilinen bir uzunluğu kullanarak oranla. Örneğin tam viewport görüntüsü 1200 CSS px ise yarısını kaplayan modal yaklaşık 600 CSS px olabilir. Kırpılmış bir görselin tümünü 1200 sanma; farklı ekran görüntülerinin ölçeğini paylaşılmış varsayma.
3. Hesaplanan ölçü analiz referansıdır; doğrudan calc() veya sabit piksel koordinatları üretme. Önce katalogdaki modal size gibi native seçenekleri kontrol et; md'nin her library'de 600px olduğunu varsayma. Desteklenen en yakın seçenek veya sade maxWidth/Flex/padding düzeni kullan.
4. Soruyu sormadan tahmine geçme. Kullanıcı ölçüyü bilmediğini söylediyse akışı kilitleme. Oranları ve içerik hiyerarşisini yaklaşık yorumla; kabul ettiğin ölçek varsayımını belirt ve yalnız kullanıcı görsel inceleme istiyorsa render sonucuyla düzelt. Görünmeyen yüksekliği veya kesin breakpoint'i uydurma.

## Güncel varsayılan ve düzenleme

Kullanıcı belirtmediyse seçili library teması kullanılır; tema sorusu tekrarlanmaz. Tema tercihiyle ilgili önceki soru adımları bu varsayılanla değiştirilmiştir. Kaynağın oranı, hiyerarşisi ve spacing yaklaştırılır. Yalnız prompt da giriş olabilir; prompt-authoring rehberini izle. Mevcut tasarımda değişiklik update_design ile, yeni ekran ekleme import_design ile yapılır.

Önce screen-understanding rehberinin kısa özet ve soru bütçesini uygula. Açık ekran amacı veya her küçük boşluk için onay isteme.


### Recipe görsellerini seçerek okuma

Overview içindeki `description` ve `visualHints` ile adayları seç. Adayların details yanıtında `recipes` kayıtlarının `when`, `instructions`, `example` ve varsa `images` alanlarını oku. Birbirine benzeyen iki görünümü ayırmak için gerekiyorsa `get_recipe_image(adapterId, componentType, recipeId, imageId, contractRevision)` ile yalnız ilgili referansı getir. Görseli kayıtlı prop, slot ve alt bileşen tarifiyle birlikte değerlendir. Görsel sağlanmamışsa metin tarifiyle devam et. Referans görüntüsü tek başına gizli davranışı kanıtlamaz. PNG ve görsel metadata'sı tasarım JSON'una yazılmaz.
