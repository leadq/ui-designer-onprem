# Basic / Detailed

Bu rehber mod kapsamı ve soru bütçesinde yetkilidir. Mod, phase (anla/uygula) ve goal (tasarım/React) birbirinden bağımsızdır. Kullanıcı birini söylemediyse önce sor: “Basic: tasarım ve yapısal form akışı mı; Detailed: ayrıca iş kurallarını birlikte netleştirerek mi ilerleyelim?” Yanıt gelmeden mod seçme veya implementasyona geçme. Verilmiş tercihi tekrar sorma; sonraki start_design_task çağrılarına mode: basic|detailed taşı. Mod seçimi bu MCP sürecinde saklanmaz; agent kısa görev özetinde tutar.

## İki modun ortak soruları

1. Mod bilinmiyorsa yukarıdaki seçimi sor.
2. Kaynak tasarımın CSS viewport veya aynı düzlemde modal/kart referans genişliği bilinmiyorsa yaklaşık ölçüyü bir kez sor: “Bu tasarım hangi ekran genişliğine göre hazırlandı: örneğin 1440, 1200 veya 390 CSS px?” Görsel dosyasının piksel genişliği, normalizasyon ölçüsü, canvas zoom'u, browser penceresi veya desktop/mobile görünümü kesin kanıt değildir. Kullanıcının verdiği ölçü ya da tasarımın açık frame/viewport metadata'sı varsa tekrar sorma. Screenshot'ın header'ındaki sayı yalnız kaynak viewport olduğu açıkça anlaşılıyorsa kanıttır.
3. Ekranın amacı/temsil ettiği adım belli değilse kısa amaç sorusu sor. Açık form/dashboard için onay isteme.

Genişlik sorusuna cevap gelmeden kendin 1440 seçme. Kullanıcı bilmiyorsa bir kere bilinen kart/modal ölçüsü veya açık bir yaklaşık referans öner; kesin ölçü diye sunma, aynı soruyu tekrarlama. Tam ekran mı kırpım mı olduğu ölçeği etkiliyorsa genişlik sorusunda netleştir. Yüksekliği width'ten uydurma: aynı düzlemde oran çıkar; scroll/kırpma nedeniyle bilinmeyen kısmı bildir. Farklı ölçekteki referansları aynı viewport sanma; aynı genişlikteki grupları birlikte sor.

## Basic — tasarım ve yapısal form akışı

Seçili ekranların görünür bölgeleri, metinleri, değerleri, hiyerarşi, spacing, native varyantlar ve gösterilen state'i kur. Gerekirse mevcut mimari template'i kullan; React veya düzenlenebilir Designer çıktısı üret. Doğal input/Tabs/collapse kullanımı yanında, açıkça anlaşılan çok ekranlı form için forms/wizard ve kurum örneklerini oku. Verilen stratejideki FormProvider/context/stepper, ileri/geri geçişi ve adımlar arasında değerlerin korunması Basic kapsamıdır; görünmez altyapı olması bunu değiştirmez. Tasarımda ok çizilmemiş olması tek başına engel değildir. Mimari import/paket/örnek eksikse uydurma; yalnız eksik entegrasyonu belirt. Ekranda disabled bir düğme görünüyorsa o görünümü koru; yeni dinamik disabled koşulu üretme.

İl-ilçe bağımlılığı, query/API/mutation, iş kuralı handlerı, submit validation, gerçek OTP/confirmation işlemi ve loading/error servis akışı çıkarma veya sorma. İleri/geri için yapısal handler ve ortak form state’i bu yasağa dahil değildir. Görünür seçenek/metin/tablo satırı statik sunum verisidir, servis gereksinimi değildir. Servis ve iş kuralı entegrasyonunu geliştiriciye bırak; form/stepper altyapısını verilen strateji kadar tamamla. Örneğin üç form adımı ve bir modal görünümü üç adımlı wizard'dır; modal dördüncü adım olmaz. Görsel ve JSON'dan desteklenen adım planını kısa not et; co-delivery veya canvas sırası tek başına ilişki kanıtı değildir. Basic'te kapsamı büyüten istek gelirse Detailed'a geçmeyi öner; sessizce geçme.

Mevcut Designer belgesini düzenlerken açık ilişkileri/notları/ID'leri silme. Basic kod çıktısında domain davranışlarını uygulamadığını bildir; kaynakta var diye bunları yeniden yorumlayıp API'ye bağlama. Yeni JSON alanı ile mod kaydetme. Kullanılan component authoring/slot kurallarını Basic de okumalıdır.

Basic ortak soru bütçesi en fazla 3 kısa soru; verilmiş bilgiler sayılmaz/tekrar sorulmaz. Eksik kaynak nedeniyle devam edilemiyorsa sınırı bildir; soru kotasını aşmak için tek maddede uzun bir anket gizleme.

## Detailed — teyit edilmiş davranış ve domain

Ortak sorular dahil genellikle 5 civarı, görev için toplam en fazla 10 soru. Bunlar minimum sayılar değil; cevaplar zaten belliyse daha az soru sor. Soruları 3–5 maddelik kısa gruplara böl; sonraki soruyu önceki cevaba göre seç. Sorulan/cevaplanan ve kalan bütçeyi kısa görev notunda tut. Onuncu sorudan sonra yeni varsayımsal özellik açma; çözülmeyen kuralı açık bırak ve bağımsız kapsamı tamamla. Yeni kullanıcı kapsamı gelmedikçe bütçeyi her turda sıfırlama.

Aşağıdaki banka göre sadece ekranda anlamlı olan eksikleri seç:
- Zorunlu alanlar/hatalar: Devam düğmesi hangi koşulda disabled veya enabled; kontrol yazarken mi devamda mı?
- Alan ilişkisi: İl seçimi ilçe listesini değiştirir mi; değişince önceki ilçe ne olur?
- Wizard: Adım geçişini engelleyen domain koşulları veya özel reset politikası; normal ileri/geri ve değer koruma Basic dahil forms/wizard stratejisinden gelir. Örnek projedeyse yeniden sorma.
- Onay/OTP: Eylem doğrudan mı, confirmation veya SMS OTP ile mi tamamlanır; gerçek servis mi demo mu?
- API: Mevcut servis tanımı veya sözleşme/link var mı? Varsa önce projedeki API/constants/query/mutation örneklerini oku; kullanıcıya zaten dosyada olan importları sordurma.
- Servis durumları: Loading sırasında hangi işlem bekler; hata/boş sonuç/yeniden deneme nasıl görünür?
- Filtre/tablo: Uygula mı anlık filtre mi; sıralama/sayfalama yerel mi servis üzerinden mi?
- Tamamlama: Başarı sonrası gösterilecek görünüm/hedef ve korunacak/sıfırlanacak alanlar.

Banka bir kontrol listesi değildir; tüm soruları her ekranda sorma. Olası ilişkiyi “Şöyle görünüyor, bu kural geçerli mi?” şeklinde aday olarak sun; cevap/proje kanıtı olmadan uygulama. API linkini otomatik production erişimi/işlem izni sayma. Gerçek kontrat yoksa açıkça kabul edilmiş demo sınırında kal. Yanıtlar → kısa kural/field/state özeti → ilgili form/wizard/API rehber ve örneklerini oku → template'i doldur → test et. Yeni mimari/paket icat etme.

Designer çıktısında yalnız mevcut JSON/preview kontratının desteklediği teyit edilmiş davranışları yaz; gerçek backend/OTP'yi çalışıyormuş gibi gösterme. React'te verilen mimariyle domain/handler/servis bağlantısını uygula. Kullanıcı cevaplarının özetini göster; yeni bir genel onay turu zorunlu değildir.

## Görünen tetikleyici, eksik açılan içerik

CardAction/üç nokta, dropdown veya başka bir tetikleyicinin kimliğini ve teknik kullanımını önce adapter/MCP kataloğundan doğrula; screen-understanding içindeki opsiyonel brief yalnız görsel tanımaya yardımcıdır. Önce kapsamdaki bütün verilen ekranları incele; açık hali veya tanımlı içeriği başka ekranda/proje örneğinde varsa tekrar sorma. “Açık görünüm yok” ile “bu özellik yok” farklıdır.

Basic: kapalı CardAction görünümünü doğrulanmış native kullanımla kur. Açılan içerik verilmemişse popover veya Düzenle/Sil gibi örnek menü öğeleri, click eylemi, API ve veri ilişkisi icat etme; bunları sormak için Detailed kapsamına girme. Eksik açık durum/entegrasyonu teslimde kısa bildir. Native parçaları koru; yalnız kapalı kullanım desteklenmiyorsa boş items, yapay disabled veya sessiz noop ile çalışan özellik iddiasında bulunma.

Detailed: belirsizliği kısa aday tespitiyle belirt: “Kartın sağ üstündeki kontrol CardAction gibi görünüyor; verilen ekranlarda açık menü görünmüyor.” Kurum brief'i kimliği kesinleştiriyorsa gereksiz kimlik onayı isteme. Ortaklar dahil toplam en fazla 10 soru bütçesi içinde cevaba göre ilerle:
1. Açılınca hangi seçenekler görünecek ve bunlar ne yapacak? Açık tasarım varsa onu kullan.
2. Seçenek listesi sabit mi, servisten mi geliyor? Statik menü öğesinin tıklanınca servis çağırması ayrı bir karardır.
3. Servis gerekiyorsa önce proje kontratını/örneklerini ara; eksikse mevcut servis tanımı veya sözleşme bağlantısını iste. Yalnız gerçek kapsamda gereken payload, loading/error veya yetki belirsizliğini sor.

Bu sıra zorunlu anket değildir; cevaplananları atla, aynı CardAction ailesi için ortak cevabı yeniden sorma, kart bazındaki istisnayı koru. Servis yoksa API sorusuna geçme. Bütçe biterse bilinmeyen davranışı tamamlanmış sayma; bağımsız UI'ı bitir ve kalanları bildir. API bağlantısı bilinmiyorsa tahmini production endpoint üretme. Kullanıcı kararı/proje örneği kadar uygula; kaydetme/silme/onay gibi ek kuralları kendiliğinden büyütme.
