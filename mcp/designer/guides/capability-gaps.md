# Destek sınırları ve eksik bilgi

MCP kataloğu upstream UI kütüphanesinin bütün API'si değildir. Özet listedeki type'ları keşfet,
sonra gereken ayrıntıları iste. Component authoring.acceptedPropKeys / slotKeys, defaultProps,
propsSchema ve previewValue birlikte okunur. Default prop şemada editör kontrolü olmadan da
geçerli olabilir (örn. defaultChecked veya tablonun columns/data alanları).

## Eksik rol veya özellik gördüğünde
1. Önce katalog özetinde uygun bileşen, sonra prop/slot karşılığı var mı kontrol et.
2. Yoksa props icat etme; JSX, fonksiyon, sahte asset URL'si veya özel CSS ile taklit etme.
3. Bilgiyi eksik dokümantasyon mu, desteklenmeyen özellik mi olarak ayır. Kanıt yoksa belirsiz yaz.
4. `annotations` içinde kind: dependency ile referanstaki rolü, eksik karşılığı ve yapılan
   sadeleştirmeyi belirt. Önemli davranışları kullanıcıya da bildir.
5. Native bir alternatif varsa açıkça belirt: rich-text yerine Textarea, input prefix yerine
   description. Avatar yokken süslü Box ile avatar varmış gibi yapma.
6. Kritik özellik yoksa kapsamı daraltmayı öner. Görsel taslakta yer tutucu kullanılırsa bunun
   çalışmadığı anlaşılır olsun; etkin Upload/Save görünümü gerçek upload/persistence kanıtı değildir.

Fotoğraf yükleme, avatar, input adornment, zengin metin, tablo hücre rozeti, sayfalama gibi
özellikler native pakette bulunabilir; yalnız katalogda gerçekten açılanlar üretilebilir.
Bileşen type adını tahmin ederek çağırmak yerine özet listesini esas al.

## Deneme kaydı
Referans URL'si, adapter, bundleRevision, okunan guide/type listesi, gözlenen/çıkarılan ayrımı,
unsupported/sadeleştirilmiş alanlar, validator sonucu ve tarayıcı kontrollerini kaydet.
Yalnız MCP denemesinde tasarım JSON'u hazır olana kadar adapter/renderer/store kaynaklarını okuma.
Eksikleri ürüne beslemek için kaynak incelemesi gerekiyorsa bunu ayrı bir sonraki aşama olarak
kaydet; sonradan öğrendiğin bilgiyi ilk denemede MCP sağlamış gibi sunma.
