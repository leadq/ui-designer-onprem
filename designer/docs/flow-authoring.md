# Frame ve bağlantı tasarlama

> Bu teknik rehberdeki test komutları geliştirme reposuna aittir. Teslim branch’inde test runner yoktur; kurum adapterı kabulü docs/component-adapter-checklist.md üzerinden yapılır.

8 Ekim 2026. Önce ekranları tasarlayın; form adımı, sayfa geçişi veya durum değişimi anlamını **bağlantıyı kurarken** seçin. Aynı ekran grubunda üçü de bulunabilir.

## Aynı ekranda bağımsız açılan alanlar

Switch kombinasyonları için yeni frame çizmeniz gerekmez. Alanları aynı frame içinde Box gibi bir grubun içine koyun; ağacındaki adına çift tıklayıp anlaşılır bir isim verin.

1. Switch’i seçin → **Etkileşimler → Bu ekranda alan aç**.
2. **Açıkken gösterilecek alan** listesinden grubunu seçin. Bu seçim hemen kaydedilir; ayrıca Kural ekle’ye basılmaz.
3. İkinci switch için başka bir grup seçin. İkisi bağımsızdır, birlikte açık kalabilir.
4. Üçüncü switch’in **Birlikte açık kalmasın** bölümünde ilk ikisini işaretleyin. Üçüncü açılınca ikisi kapanır; ilk ikisinden birini açmak da üçüncüyü kapatır. Bir switch’i kapatmak öncekileri otomatik açmaz.

Tasarımda bütün alanlar düzenlenebilir görünür. Preview’de anahtar değerine göre gizlenir/gösterilir; gizlenen input silinmez, aynı preview oturumunda değeri korunur. Yeni preview veya sayfa yenilemesi tasarımın başlangıç değerlerine döner. Bağlanmamış switch yalnızca kendi native davranışını sürdürür; tasarım aracı kendiliğinden iş kuralı üretmez.

**Durum değişimi → başka frame** tüm ekranın alternatif tasarımını göstermek içindir. **Bu ekranda alan aç** aynı component örneklerini kullanarak küçük, birleşebilir görünürlük değişimlerini yönetir. İkisi aynı akışta kullanılabilir.

Mevcut para transferine arayüzden eklenen 3 + 2 + 1 alanlı örnek ve import dosyaları (geliştirme reposundaki kaynak).

## Arayüzde kullanım

1. **Akışlar → Frame oluştur** ile başlayın. İlk frame `Frame 1` adını alır. **Frame ekle** sonraki frame'i oluşturur. Üstteki **Frame adı** alanından veya soldaki listeden ismini değiştirin.
2. **Tasarla** ile frame'e odaklanın ve bileşenleri sürükleyin. **Tüm ekranları göster** tasarım odağını kaldırır.
3. Butona sağ tıklayıp **Aksiyon ekle** seçin. Aynı işlem bileşen ağacında da vardır. Tetikleyiciyi, geçişin anlamını ve hedef frame'i seçin. Hedef listesinde kaynak frame bulunmaz.
4. **Form adımı** başka bir form adımını; **Sayfa geçişi** başka sayfayı; **Durum değişimi** aynı sayfanın başka frame'de tasarlanmış görünümünü ifade eder. Anlamı boş bırakmak da mümkündür; boş bağlantıdan form veya navigasyon çıkarılmaz.
5. Aksiyon taşıyan öğenin yanında küçük basma işareti görünür. Bu yalnızca editör bilgisidir: tıklamayı/sürüklemeyi engellemez, preview ve export'a girmez.
6. **Başlangıç ekranı** seçip önizlemeyi açın. Önizleme bu başlangıçlardan başlar; seçili tasarım frame'inden otomatik başlamaz. Butonlar tanımlanan bağlantıları çalıştırır; input ve Select gibi bileşenler kendi normal etkileşimlerini sürdürür.

## Örnek: üç adım ve SMS görünümü

| Kaynak | Geçişin anlamı | Hedef |
| --- | --- | --- |
| Bilgiler / Devam | Form adımı | Özet |
| Özet / Geri | Form adımı | Bilgiler |
| Özet / Devam | Durum değişimi | Özet + SMS |
| Özet + SMS / Modal içindeki Onay | Form adımı | Sonuç |
| Sonuç / Ana sayfa | Sayfa geçişi | Ana sayfa |

`Özet` ve `Özet + SMS` iki ayrı tasarım frame'idir; açık durum değişimi bağlantısı bunları **tek mantıksal sayfa** olarak işaretler. Bu yüzden Bilgiler–Özet–Sonuç formu üç adımdır. Ana sayfaya navigasyon formun adım sayısını artırmaz. Bağlantı yönleri, geri dönüş ve dallanmalar ayrıca korunur.

Frame'ler bağımsız tasarım görüntüleridir. Birinci frame'deki input'a yazılan değer ikinci frame'deki başka input'a kendiliğinden taşınmaz. Görünmeyen frame'ler mounted kalır; aynı frame'e dönüldüğünde o örnekteki değer korunur. Görsel benzerlikten component eşleme veya otomatik diff yapılmaz.

## Modal tasarımı

**Modal ekle** aktif normal frame'e bağlı, açık bir modal oluşturur. Aktif seçim başka bir modal ise başlangıç frame'i kullanılır; **Ait olduğu frame** alanından değiştirilebilir.

- Sağ panelde isim, ait olduğu frame, tür, başlangıçta açıklık ve arka plan karartması düzenlenir.
- Türler: **Özel**, **Onay**, **SMS OTP**. Tür bilgisi semantiktir; SMS gönderme, kod doğrulama veya geri sayım çalıştırmaz.
- Kapalı modal bileşen ağacında kalır. Ağaçtan seçmek düzenleme için gösterir; kayıtlı açık/kapalı tercihini değiştirmez.
- Tasarımda modal canvas içinde gösterilir. İçine sürükleme ve seçili çerçeve gerçek içerik kökünü hedefler. Karartılan bütün frame modalın seçili alanı sayılmaz.
- Preview'de gerçek portal, odak yönetimi ve Escape/dış alan/kapatma düğmesi çalışır. Karartmayı kapatmak modalı kapatmaz ve onu modeless yapmaz.
- Eski **Pencereyi aç / Pencereyi kapat** aksiyonları da desteklenir. Bunlar doğrudan modal görünürlüğünü değiştirir; durum değişimiyle başka frame seçmekten farklıdır.

Designer modalının ortak başlangıç değerleri `src/constants/flows/overlayDefaults.ts` içindedir. Yeni native overlay bileşenleri eklenirken kütüphanenin gerçek `opened`, `open`, `visible` vb. prop'u adapter'ın `defaultProps` alanında tanımlanmalıdır; core prop adı tahmin etmez. Bu sürüm yeni native toast/popover katalog bileşenleri eklemez. Mevcut Select popup'ları kendi native davranışlarını korur.

## İki tam JSON çıktısı

**İşlemler → JSON dışa aktar:** nested tasarım v8. Ağaç, props, stiller, responsive stiller, slotlar, kayıtlı tasarımlar, notlar ve bağlantılar bulunur. Editörün asıl modeli budur.

**İşlemler → Düz JSON + kontrat indir:** flat v1, `designVersion: 8`. Aynı tasarım `nodesById`/`rootIds` şeklindedir; ayrıca türetilmiş `behavior` v5 bulunur. Tam tasarımı ve davranışı tek dosyada incelemek içindir. Her iki çıktı aynı **JSON içe aktar** işlemiyle açılabilir.

**TSX dışa aktar → Manifest JSON indir:** yalnızca davranış özeti v5. Tam tasarım veya import dosyası değildir. Ham TSX, native bileşenleri ve aynı manifesti içerir; çalışan geçiş handler'ları veya uygulama servisleri üretmez. Çalışan görünürlük yürütücüsü preview'dedir.

Alanlar, yürütme kuralları, migration ve sınırlar: [Tasarım ve davranış kontratı](./contracts/README.md). Gerçek exporter çıktıları: nested örnek (geliştirme reposundaki kaynak), flat örnek (geliştirme reposundaki kaynak).

## Doğrulama

- `npm test -- component-state.test.ts flow-contracts.test.ts flat-contracts.test.ts condition-contracts.test.ts toggle-contracts.test.ts frame-workspace.test.ts text-bindings.test.ts`: üç adapterde import/migration, flat round-trip, slotlar, notlar, referans bütünlüğü, modal sahipliği, durum grupları, form adım sayısı, döngü/belirsizlik ve preview/export etkilerinin eşliği.
- `flow-authoring.spec.ts`: mevcut yedi ortak authoring senaryosu.
- `frame-contract.spec.ts`: üç ek senaryo; sağ tıkla bağlantı kurma, iki JSON indir/import, durum görünümü ve otomatik modal, üç geçiş anlamı, isim değiştirme, kapalı modalı ağaçtan düzenleme, gerçek drop ve seçim geometrisi, bozuk flat importta mevcut tasarımın korunması.
- Testler Mantine, Material UI ve Ant Design üzerinde Chromium, Firefox ve WebKit ile çalışır. Sonuçların kapsamı doğrulama kaydında (geliştirme reposundaki kaynak) belirtilir.


## Aynı adımdan hata ve başarı yolları

Aksiyon editöründe **Koşula göre** seçin. Kaynak **Alan değeri** ise input ve karşılaştırma seçilir. Kaynak **Örnek sonuç** ise isim ve başlangıç sonucu seçilir. **Koşul sağlanırsa** hedefini ve isteğe bağlı **Değilse yapılacak işlemi** tanımlayın. Her dal kendi geçiş anlamını taşır.

Tutar örneği: 1–5000 aralığı → Alıcı frame'i (Form adımı); değilse → Bakiye modalını aç. Modalın Tamam butonu sadece modalı kapatır. Tutar değiştirildikten sonra aynı Devam butonu yeniden değerlendirilir. Boş/sayı olmayan bir değer numeric karşılaştırmada iki dala da girmez.

Alıcı/servis sonucunu simüle etmek için preview üstündeki **örnek sonuç** seçicisini Hatalı yapın, aksiyonu deneyin, modalı kapatın; Başarılı seçip aynı aksiyonu tekrar deneyin. Bu seçim gerçek IBAN doğrulaması veya servis yanıtı değildir.

Arayüzde sürükle–bırakla hazırlanan dört adımlı para transferi örneği (geliştirme reposundaki kaynak) hem nested hem flat olarak indirilebilir. Bu yaklaşımda ana adımlar bir kez tasarlanır; hata modalları kendi adımlarına bağlıdır. Ayrı satırlar yalnızca sunum gruplaması olarak düşünülebilir; tekrar deneme için ekran kopyalamak gerekmez. Figma da [koşullu prototip aksiyonları](https://help.figma.com/hc/en-us/articles/15253220891799-Multiple-actions-and-conditionals) sunar; burada tek karşılaştırma ve iki sonuçla sınırlı bir model kullanıyoruz.
