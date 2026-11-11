# Senaryo 01 — Üç adımlı ekip atölyesi başvurusu

**Amaç:** native inputlar, farklı buton görünümleri, layout, state/flow, bağlı özet ve modalı birlikte değerlendirmek. **Mod:** Detailed; aşağıdaki demo kuralları açık gereksinimdir. **Tasarım:** 1440 CSS px; sonra 768 ve 375 kontrolü. **Tema:** yeni kurum library'sinin varsayılan teması. Gerçek API/ödeme/SMS yok.

## Agent'a yapıştırılacak ekran görevi

```text
Yeni kurum adapterıyla UI Designer'da düzenlenebilir bir “Ekip Atölyesi Başvurusu” tasarla. installation/scenarios/01-atolye-basvurusu.md dosyasının bütün gereksinim ve kabul adımlarını uygula. Mod Detailed; kaynak prompt; başlangıç genişliği 1440 CSS px. 768 ve 375 genişlikte de kullanılır olsun. Yalnız bu kurulumda kabul kapsamına alınmış gerçek native komponentleri ve katalogdaki geçerli propsları kullan.
Üç mantıksal form adımı (iletişim → tercihler → özet), ayrıca bir başarı ekranı ve özetten açılan onay modalı oluştur. Form adımlarını formStep, başarıya geçişi navigation olarak açık bağla; başarı ekranı dördüncü form adımı değildir. Modal da adım değildir. Native stepper kapsamda yoksa metin ve layout ile adım bilgisini göster; yeni stepper API'si uydurma.
Input/checkbox/switch/select/number/textarea değerlerini, aşağıdaki ilk değer ve koşulları kur. Özet metinlerini gerçek kaynak node ID'lerine bağla. Tasarımı validate et, MCP ile import et, applied ACK ve frame ID'lerini doğrula. Preview'da kabul tablosunu gerçekten çalıştır. Sonra editörde prop/layout/undo ve export/reload kontrollerini yap. Kurum library'sinde eksik zorunlu rol varsa başka library ile doldurma; ilgili ölçütü eksik bırak ve raporla. Kanıtları scenarios/01 ve evidence/ altında, hataları bugs/ altında kaydet.
```

## Ekran ve davranış gereksinimleri

| Bölüm | İçerik | Açık davranış / başlangıç |
| --- | --- | --- |
| Ortak başlık | “Ekip Atölyesi”, kısa açıklama, 1/3–2/3–3/3 adım bilgisi; Card/Box, Text, Divider | İç içe Flex, gap/padding; library native görünümü. Varsa Progress ile adım göstergesi |
| 1 — İletişim | Ad soyad, iş e-postası, katılım koşulları Checkbox; “Devam” ana butonu | Ad/e-posta boş, checkbox false. Devam yalnız ad ve e-posta notEmpty **ve** checkbox true iken enabled. E-posta format kontrolü yok |
| 2 — Tercihler | Select: `tasarim` → “Tasarım Sistemleri”, `erisilebilirlik` → “Erişilebilirlik”; NumberInput “Ek katılımcı”; Textarea “Not”; Switch “Kurum bilgisi ekle”; koşullu “Kurum adı” TextInput | Select başlangıç `tasarim`, sayı 0, not boş, switch false. Kurum alanı yalnız switch true iken görünür; gizlenince değeri korunur. Kurum adı submit koşulu değildir |
| 2 — Aksiyonlar | “Geri” ikincil, “Özete geç” ana buton | Geri adım 1'e; Özete geç yalnız Select notEmpty iken enabled. Sayı 0 geçerli. Min 0/max 10 yalnız native destekle sunulur; yeni iş kuralı uydurma |
| 3 — Özet | Ad, e-posta, atölye, ek katılımcı, not; kurum bilgisi bölümü | Normal ağaçtaki kaynak inputlara textBinding. Boş not “Belirtilmedi”. 0 metin olarak görünür; boş sayılmaz. Select özeti mevcut binding'de değer kodu dönerse bunu açık etiketle; label dönüşüm motoru icat etme |
| 3 — Aksiyonlar | “Tercihleri düzenle” ikincil, “Başvuruyu onayla” ana | Düzenle adım 2'ye. Onayla özete ait native modalı açar |
| Onay modalı | “Başvuruyu kaydedelim mi?”, kısa açıklama; “Vazgeç” hafif/ikincil ve “Onayla” ana | Vazgeç/close/Escape modalı kapatır ve özette kalır; Onayla başarı ekranına geçer ve modal kapanır. Backdrop politikası native/adapter kontratına göre kaydedilir |
| Başarı | Başarı Alert/Badge, “Başvuru alındı”, demo işlem açıklaması | Yeni formStep değil. Gerçek kayıt çağrısı yok; yeniden başlatma preview kontrolüyle yapılır |

Butonların ana/ikincil/hafif rolleri için native enum isimlerini katalogdan seç; `primary` gibi varsayımsal prop değeri yazma. Farklı görünümler normal/hover/focus/disabled durumlarında okunur olmalı. Onay modalının layout'u gerçek portal yüzeyinde kalmalı.

## Deterministik kabul adımları

Her satıra **geçti / başarısız / engelli / kapsam dışı + kanıt yolu** yaz. Aşağıdaki fixture verileri tamamen demodur.

| ID | Gerçek işlem | Beklenen |
| --- | --- | --- |
| W01 | Preview başlat, Devam'a tıkla; Tab ile alanları dolaş | Adım 1'de kalır, Devam disabled; klavye sırası doğal, label/odak görünür |
| W02 | Ad “Ada Yılmaz”, e-posta “ada@example.test” yaz; checkbox'ı kapalı tut | Devam hâlâ disabled. Checkbox'ı açınca tek değişimle enabled |
| W03 | Adı boşalt ve yeniden yaz; Devam'a bas | Boşken disabled, yeniden dolunca adım 2'ye geçer; kural eski değerle çalışmaz |
| W04 | Sayı 0 ve Select varsayılanını incele; varsa clear ile Select'i boşalt, tekrar Erişilebilirlik seç | 0 korunur; desteklenen clear'da Özete geç disabled olur, seçince açılır. Native clear yoksa enum desteği eksikliği olarak kaydet, varmış gibi test yazma |
| W05 | Switch aç; kurum “Örnek Ekip” yaz; switch kapat ve yeniden aç | Alan gizlenir/geri görünür, değer korunur; diğer alanlar etkilenmez |
| W06 | Notu boş tut, switch kapalıyken özete geç | Özet Ada/e-posta ve seçimi gösterir; ek katılımcı “0”, not “Belirtilmedi”; kurum bölümü gizli |
| W07 | Düzenle ile 2'ye, Geri ile 1'e dön | Ad/e-posta/checkbox/Select/sayı/switch değerleri korunur; kopya input node'larıyla eşitleme yapılmaz |
| W08 | Yeniden 2'ye geç; sayı 2, not “Altyazı desteği”, switch true yap; özete geç | Özet yeni değerleri ve “Örnek Ekip” bilgisini gösterir; textBinding kaynak ID'leri doğru |
| W09 | Onay modalını aç; Tab/Shift+Tab, Escape, tekrar aç ve Vazgeç dene | Focus modalda tutulur, kapanınca tetikleyiciye döner; özet ve form değerleri korunur; arkadaki frame tıklamayla bozulmaz |
| W10 | Modalı tekrar aç, Onayla'ya bas | Yalnız başarı ekranı görünür; modal/backdrop kalıntısı ve çift olay yok |
| W11 | Preview yeniden başlat | Adım 1 başlangıcı, boş inputlar ve checkbox false; adım 2 ilk değerleri 0/tasarim/false. Demo deneme değerleri tasarım JSON'una yazılmamış |
| W12 | Editörde buton variant ve parent gap/padding değiştir; undo/redo | Görünüm beklenen native prop/layout etkisini gösterir; komşu input sınırları/label'lar ezilmez; undo tek doğru işlemi geri alır |
| W13 | 1440/768/375'te form, uzun metin, select portalı ve modalı incele | Üst üste binme, kırpılmış label/buton veya sayfa yatay taşması yok; mobilde sütunlar doğal akar, modal kullanılabilir |
| W14 | Save/reload, nested/flat+behavior eşitliği ve güncel manifest türetimini kontrol et | Bağlantılar, kaynak ID'leri, ilk değerler ve modal sahipliği korunur; formScopes üç adım, başarı/modal fazladan form adımı değil |

Raw TSX'te bu ilişkilerin taşınması ayrı, çalışan hedef React'te yürütülmesi ayrı kapıdır. Sadece export metnine bakıp form handlerları çalışıyor deme. İlgili kaynaklar: [flow authoring](../../docs/flow-authoring.md), [kontrat](../../docs/contracts/README.md), wizard guide (MCP reposunda `designer/guides/wizard.md`).

Sonra [senaryo 02](02-ekip-kaynaklari.md). Sonuçta her Wxx adımının geçti/başarısız/engelli durumunu ve kanıtını kısa raporla; hata varsa beklenen/gözlenen sonucu, tekrar adımlarını, adapter/library sürümünü ve screenshot/log bilgisini ekle. Test edilmemiş ölçütü geçmiş sayma.
