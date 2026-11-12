<!-- rule
{
  "id": "template-completion",
  "title": "Şablondan tamamlanmış ekrana",
  "when": "react",
  "status": "ready",
  "targets": [
    "react"
  ],
  "phases": [
    "implement"
  ]
}
-->

# Şablondan tamamlanmış ekrana

Kullanıcı klasör, BEM, mock formatı, provider/stepper ve örnek kod kurallarının sahibidir. Agent bu kuralları ve ilgili çalışan örneği okuyup ekran içeriğini tamamlar. needs-project-input tüm işi durdurmaz; yalnız ihtiyaç duyulan eksik entegrasyonu ayır. Bu rehber o kuralları doldurmaz.

Basic: scaffold config.api verme; UI/style ve görünür statik içeriği tamamla. Form/wizard stratejisi varsa tanımlı provider/context/stepper, ileri/geri handlerı ve ortak form state bağlantısını tamamla; bunlar görünmez olsa da Basic kapsamındadır. İş kuralı handlerı, validation veya mock servis zinciri kurma. Detailed: aşağıdaki entegrasyon adımları yalnız teyit edilmiş kapsam için geçerlidir. Mevcut kullanıcı API/davranış kodunu Basic gerekçesiyle silme.

1. Kısa ekran özeti ve patterns → ilgili kurum rehberi ve minimal çalışan örnek. Doğrulanmış import/alias/primitive/styleFile/domain ile scaffold planını oluştur. Örnek domain adını körlemesine kopyalama.
2. Asset hash/revision kontrolü → dry-run → yalnız istenen kapsamda write. Mevcut dosyayı template ile ezme; güncelleme görevinde mevcut yapıyı koru. Yeni paket kurma, dependency sürümü değiştirme.
3. Dönen completionChecklist bir yapılacaklar listesidir; status= pending maddesi bitmiş iş değildir. Mevcut üretici page/domain UI/style ve isteğe bağlı API/types/mock üretir; provider, hook veya util ürettiğini varsayma.
4. Domain UI placeholder'ını gerçek bileşen/alan/metinlerle; stil iskeletini doğal Flex ve ölçülü spacing ile; API tip/fixture taslaklarını doğrulanmış veya açıkça demo olarak kabul edilmiş veriyle tamamla. Router/provider/stepper ve dev mock kayıtlarını profil örneğine göre bağla. Şablonun dışında ihtiyaç duyulan hook/util yalnız gerçek sorumluluğu varsa eklenir.
5. Kullanıcının ileride eklediği dummy hook/util örneklerini gerçek göreve uyarla veya kullanılmıyorsa yalnız üretilmiş dummy dosyayı kaldır. Mevcut kullanıcı dosyasını kaldırma. Boş hook/util, boş fixture, örnek endpoint/domain ve DESIGNER_PLACEHOLDER işaretlerini tamamlanmış çıktı diye bırakma; gerçek engeli raporla.
6. Mevcut common/UI bileşenlerini tüket. Yeni bileşen varsayılan olarak domain içinde kalır; aynı akışın iki tab'ında tekrarlanması global common gerekçesi değildir. Farklı bağımsız sayfalarda kanıtlanmış kullanım ve proje kuralı olmadıkça global soyutlama oluşturma. Benzer görünen ama iş anlamı farklı kartları zorla birleştirme.
7. Her görünür alan/aksiyon → component → gerektiğinde state/hook/API/fixture eşlemesini kontrol et. Import derlenmesi router kaydı veya çalışan mock kanıtı değildir. Projenin test/quality rehberini oku; görsel, davranış, loading/error ve ilgili entegrasyonları doğrula.

Tamamlama notu kısa olsun: tamamlanan ekranlar; kapanan placeholderlar; kalan engeller; yapılan kontroller. Üretici completionChecklist'i otomatik kod analizi yapmaz ve güncellemez; agent her madde için dosya/test/render kanıtı sağlar. Mimari örnekle sapma varsa nedeni kaydet; kendi tercih ettiğin framework'e geçme.

## JSON girdisiyle çalışma

React implementasyonunda `json-field-reference` rehberini outline/sectionId ile kullanılan alanlar için, `react-generation` rehberini sıralı uygulama için oku. Bu kaynaklar JSON → props/style/slot/state/flow eşlemesini anlatır; kurum mimari profilini doldurmaz. Katalogdaki hasCustomRenderer/wrapsChildren veya native event read bilgisi yalnız flag/ad düzeyindeyse ilgili native kullanım örneği gerekir. Source string/TSX export tek başına çalışan handler, responsive CSS veya hedef provider değildir.
