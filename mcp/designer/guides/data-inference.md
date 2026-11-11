# Ekrandan veri ve mock içeriği

Kapsam: domain/ilişki/servis uygulaması yalnız Detailed modda, kullanıcı cevabı veya doğrulanmış proje kuralıyla yapılır. Bu rehberin servis/iş kuralları Basic kapsamını genişletmez; Basic yapısal form/wizard altyapısı için forms/wizard kullanır. authoring-modes önceliklidir.

Bu rehber neyin doldurulacağını öğretir. Dosya yolu, envelope, field convention, base API ve interceptor düzeni kullanıcının architecture/api-mocks örneklerinden gelir; bunları yeniden tasarlama.

## Kanıtı ve taslağı ayır

Her veri ihtiyacını kısa bir tabloda izle: görünür alan/rol → önerilen field/tip → kaynak (input, sabit, lookup, sonuç, türetilmiş) → bağımlılık → kanıt/durum. Teknik field adını label'dan, mevcut form/API örneği varsa ondan türet; bütün isimleri kullanıcıya tek tek sordurma. Tipleri para/tarih/ID gösterimine bakarak dikkatle seç; görünen format backend tipi kanıtı değildir.

- Doğrulanmış kontrat varsa field, URL, method ve response biçimini aynen kullan; görüntüye uydurmak için kontratı değiştirme.
- Kontrat yoksa ekranın gerektirdiği veri modelini ve query/mutation ihtiyacını öner. Demo/mock kapsamı yetkiliyse yerel taslak veriyi tamamla; gerçek backend uyumu iddia etme.
- Geçici mock endpoint/response yalnız profilin demo convention'ı veya açık kullanıcı kararı varsa uygulanır. Kural yoksa veri/field planını ve görünür örnek içeriği hazırla, engelli API bağlantısını tek kısa soruda netleştir. Gerçek production URL veya method uydurma.
- Endpoint veya servis kaynağını görselden kesinleştirmeme kuralı, örnek mock satırlarını boş bırakma gerekçesi değildir. Doğrulanmış format varsa görünür verileri doldur; ek sentetik değerleri örnek olarak işaretle.

## Örnek: il ve ilçe

İki Select ve başlıkları gözlemdir; ilçe seçeneklerinin ile bağlı olması güçlü ama doğrulanabilir bir çıkarımdır. Profil/API kanıtı varsa cities lookup, seçili cityId ile districts lookup, ID-label eşlemesi ve geçersiz eski ilçe seçiminin temizlenmesini uygula. Kanıt yoksa bunları demo davranışı önerisi olarak kaydet; iki dropdown görmek iki gerçek endpoint'in varlığını kanıtlamaz. Mock satırlarında cityId/districtId ilişkisi tutarlı, değerler seçim ve özette aynı olmalı. İlçe isteğinin il seçilene kadar beklemesi, loading/empty/error davranışı profil/kararla belirlenir; sessiz iş kuralı ekleme.

## Örnek: filtre + tablo / wizard

Filtre girdilerini sonuç alanlarından ayır; tablo kolonlarını ve görünür satır değerlerini eksiksiz taşı. Uygula butonu varsa yazılan filtre ile uygulanan filtreyi ayırt et; server pagination/sort/query sözleşmesi yalnız kanıtla gelir. Wizard'da adım alanlarını ve ortak form modelini çıkar; provider/stepper örneğini oku, geri dönüşte değerleri koru. Özet/submit payload'u için aynı field'ları kullan; görselde yok diye gerekli ama bilinmeyen servis alanını uydurma.

## Tamamlama

Fixture'lar kullanıcının formatına uysun; field tipleri, ilişkiler, görüntüdeki içerik, boş/null ve gereken loading/error/empty örnekleri tutarlı olsun. Bir query için fixture yazmak hook, kayıt veya dev interceptor'ı bağlamış olmak değildir. API → hook → ekrandaki tüketim → mock eşlemesini izleyip çalıştır. Yerel UI sabitlerini gereksiz servise dönüştürme. Form input değerlerini lookup response veya backend sonucu ile karıştırma. Sadece Designer JSON isteniyorsa veri görsel örnektir; API dosyası üretme.

## Eksik CardAction menüsünden entegrasyona

Detailed cevaplarıyla menü öğeleri ve eylemlerini ayrı kaydet: sabit liste / servis listesi; her öğenin yerel eylemi / navigasyonu / servis işlemi. Sabit bir menüde servis kullanan eylem bulunması liste query'si gerektirmez. Yalnız doğrulanmış ihtiyaçlar için architecture/api-mocks örneğindeki endpoint, query veya mutation, export edilen hook, component import/tüketimi ve dev fixture eşlemesini tamamla. Query adı, response envelope veya izin alanı uydurma. Mock dosyasının içini teyit edilmiş öğelerle doldur; hedef profil hook'u otomatik üretiyorsa örnekteki export/import yolunu izle. İstek ve loading/error durumlarını yalnız netleşmiş kapsamda bağla. UI-only Designer çıktısı için API dosyası üretme.
