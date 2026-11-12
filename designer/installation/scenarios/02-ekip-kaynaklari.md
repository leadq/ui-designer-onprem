# Senaryo 02 — Ekip kaynakları, rich tablo ve rezervasyon

**Amaç:** list/Tabs/disclosure/table içerik sahipliği, layout/stil sınırları, modal/portal ve editör geometri kontrolleri. **Mod:** Detailed; açık demo geçişleri aşağıda. **Genişlik:** 1440, 768, 375 CSS px. Gerçek liste servisi/filtreleme/sorting/pagination motoru gerektirmez.

## Agent'a yapıştırılacak ekran görevi

```text
Yeni kurum adapterıyla UI Designer'da “Ekip Kaynakları” ekranını oluştur. installation/scenarios/02-ekip-kaynaklari.md gereksinimlerini ve bütün kabul adımlarını uygula. Mod Detailed, kaynak prompt; başlangıç genişliği 1440 CSS px, ayrıca 768/375 kontrolü.
Gerçek native Card/Box/Text/Button/Badge/Alert, Tabs ve bağımsız liste öğeleri, tek açılır bölüm, rich hücreli tablo ve native modal kullan. İki sekme “Envanter” ve “Kullanım notları” olsun; kullanıcı öğe/hücreyi normal bileşenlerle düzenleyebilsin. Kullanıcıya renderItem/renderCell callback veya veri array'i yazdırma; gerekli native dönüşüm adapter'a ait.
Aşağıdaki üç kaynak kaydını ve örnek rezervasyon akışını tasarla. Sıralama/filtre/pagination veya gerçek kayıt servisi icat etme. Tablo dışındaki “Atlas için rezervasyon” butonu açıkça Atlas kaynağını hedeflesin; genel satır-seçimi runtime'ı varmış gibi davranma. validate + MCP applied ACK sonrası gerçek browser'da senaryoyu çalıştır; sonra editör authoring/undo/zoom/scroll ve export/reload kontrollerini yap. Önce kanıt topla; eksik yeteneği başka library ya da taklit tabloyla kapatma. Sonuçları senaryo ve kapsam raporuna yaz.
```

## Ekran gereksinimleri

- Başlık “Ekip Kaynakları”, açıklama, toplam “3 kaynak” Badge; üstte Card içinde “Demo veri, gerçek rezervasyon yapılmaz” Alert.
- Tabs: başlangıç **Envanter**, ikinci **Kullanım notları**. Native disabled tab desteği kapsamdaysa geçici üçüncü “Arşiv” disabled sekmesi ekle; bu seçim ayrı kabul satırı olsun.
- Envanter panelinde 4 sütun × 3 veri satırlı bağımsız rich tablo. Paletten 6×10 başlangıç gelmesi doğrudur; ortak tablo authoring ile 4×3'e düzenle veya doğrulanmış yeni belgeyi aynı kontratla kur.

| Kaynak | Tür | Durum | Kapasite |
| --- | --- | --- | --- |
| Atlas | Toplantı odası | Uygun Badge | 8 |
| Bora | Projeksiyon | Kullanımda Badge | 1 |
| Ceren | Çalışma alanı | Uygun Badge | 4 |

- Kaynak hücresinde Text + küçük yardımcı metin; durum hücresinde native Badge. Kapasite sütunu hizalama capability'si varsa sağa. Rich hücreleri düz stringe çevirme.
- Tablo altında ayrı ve açık isimli “Atlas için rezervasyon” ana butonu, “Kullanım notlarını oku” yardımcı metni. Yardımcı metni desteklenmeyen sekme geçiş handler'ıyla çalışıyormuş gibi sunma; kullanıcı ikinci native sekmeyi tıklar.
- Kullanım notları panelinde **bağımsız** üç liste öğesi: “En fazla 2 saat”, “Kablo kontrolü”, “Çıkışta temizlik”. Her öğede Text + Badge veya küçük native içerik. İlk öğede farklı açıklama, ikincide daha uzun açıklama kullan; tek şablona bağlı görünmesin.
- Aynı panelde “Rezervasyon koşulları” açılır bölümü; kapalı başlangıç, içinde açıklama ve “Not” Textarea. Native aç/kapat/klavye, değer koruma ve kapalı alt öğeyi editörde seçme denenecek.
- “Atlas için rezervasyon” → native Modal: başlık “Atlas rezervasyonu”, “Demo: bugün 14:00–15:00”, Checkbox “Koşulları okudum” (false), Vazgeç ve Onayla. Onayla yalnız checkbox true iken enabled; Vazgeç/close/Escape kapatır. Checkbox modalın normal içerik ağacında tekil kaynak olmalı; desteklenmeyen tekrarlı slot state kaynağı kurma.
- Onayla → “Rezervasyon özeti” normal frame'i; Atlas ve demo saat metni, başarı Alert ve “Kaynaklara dön” butonu. Geçişler navigation; modal ayrı form adımı değil. Geri dönüş ilk ekranı gösterir; tablo verisi mutate edilmez, sayaç 3 kalır.

## Deterministik kabul adımları

| ID | Gerçek işlem | Beklenen |
| --- | --- | --- |
| R01 | Envanteri 1440'ta aç; header/üç satır/rich içerikleri incele | Native tablo; hücreler ve rozetler hizalı/okunur, uzun isim komşuyu ezmez; kapasite yalnız capability varsa sağa |
| R02 | Native Tabs ile Kullanım notları'na geç; klavyeyle sekmeleri değiştir | Etiket/panel eşleşir; başlangıç doğru; varsa disabled Arşiv açılamaz |
| R03 | Açılır bölümü aç, Not'a “Kablo ayrıldı” yaz, kapa/aç; başka sekmeye git ve dön | İlgili içerik ve input değeri korunur; başka öğe/tab state'i sızmaz |
| R04 | Envantere dön, Atlas modalını aç; Onayla'ya bas | Modal native portal/tema ile açılır; checkbox false iken geçiş olmaz |
| R05 | Checkbox aç; Escape ile kapat; tekrar aç; Vazgeç ile kapat | Tek boolean event; native focus geri dönüşü; modal/backdrop kalıntısı yok. Yeniden açılış değeri mevcut preview ömrüne göre korunur, keyfi reset eklenmez |
| R06 | Modalı tekrar aç, gerekiyorsa checkbox aç, Onayla; sonra Kaynaklara dön | Doğru özet, modal kapalı; geri dönüşte 3 kayıt aynı, gerçek rezervasyon çağrısı yok |
| R07 | Editörde ilk liste öğesini çoğalt, kopyanın metnini değiştir, sırala; undo/redo | Kaynak ve diğer öğeler değişmez; bağımsız yeni ID ve doğru sıralama/history |
| R08 | Editörde sekme ekle/çoğalt/sırala, kopya paneli değiştir; başlangıcı ayarla, sil; undo | Başlık/panel birlikte hareket eder; kopya bağımsız, geçici seçim kayıtlı başlangıcı değiştirmez; native value key indeks/label değil stabil item ID |
| R09 | Kapalı disclosure'ın iç Textarea'sını ağaçtan seç; tasarımda aç/kapat | Düzenlenebilir; geçici açık tasarım durumu JSON başlangıcını değiştirmez |
| R10 | Rich tablo hücresini satıra, ardından ayrı denemede sütuna tam kopyala; bir kopyayı değiştir; undo | Bütün alt ağaç/değerler kopyalanır, ID'ler bağımsızdır; kaynak/diğer hedefler değişmez. Undo sonunda demo verisini geri getir |
| R11 | Tabloya başa/araya/sona satır ve sütun ekle; birini sil; undo/redo | Yeni hücre boş; eski hücre içerik/row ID/column key korunur; row-major sıra doğru |
| R12 | Header tek/çift/sağ tık ve varsa sütun hizalama; iç Text'in açık hizasını dene | Sütun inspector/header düzenleme/menü doğru; header ve body native hizası tutarlı, inner component'in açık hizası ezilmez |
| R13 | Canvas'ı %75 ve %125 zoom yap, gerçek yatay/dikey scroll uygula, + kolon/+ satır kullan | Yardımcılar native hücreye hizalı, tıklama doğru yere gider, araç katmanının scrollLeft/scrollTop'u 0; sabit beklemeyle ölçüm maskelenmez |
| R14 | 768/375 ve bağlı alt görünümde seçim/drop/tabloda ekleme/modalı dene; cihaz çerçevesini göster/gizle | Yanlış view instance'ı seçilmez; geometri kaymaz; tablo kendi alanında gerekirse scroll eder, sayfa/portal taşmaz |
| R15 | Save/reload, aynı revizyon nested/flat+behavior, TSX kontrolü | Üç bağımsız öğe, tab başlık/panel ilişkisi, rich hücre ağacı, modal hedefleri/başlangıç ve kayıtlı içerik kayıpsız |
| R16 | Console, ağ ve klavye odağını iki akış boyunca incele | Render döngüsü, provider/duplicate key uyarısı, kayıp CSS/font veya cleanup hatası yok; varsa ilk kanıt korunur |

R07–R12 geçici bozma denemelerinden sonra undo ile fixture'ı geri getir; final exportun hangi revizyonu anlattığını kaydet. Katalogda olup senaryoda kullanılmayan seçilmiş componentler için anlamlı ek kabul durumu ekle; kullanılmayan hedefi doğrulandı sayma.

[Tablo rehberi](../../docs/table-adapter-guide.md), data-display (MCP reposunda `designer/contracts/data-display.md`), [checklist](../../docs/component-adapter-checklist.md) native ve model sınırlarının sahibidir. Sonuçta her Rxx adımının geçti/başarısız/engelli durumunu ve kanıtını kısa raporla; hatalara beklenen/gözlenen sonuç ve tekrar adımları ekle.
