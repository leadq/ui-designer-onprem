# Responsive görünümü kaldırma önerisi

9 Kasım 2026 — Değerlendirme; henüz uygulanmadı.

## Sorun

Responsive satırları ayrı ekran kopyaları değildir. Tek kanonik ekran/bileşen ağacı farklı genişliklerde gösterilir. `widthsByFlow` yerel editör tercihidir; responsive stil ve prop override'ları tasarım belgesinde kalır. Mevcut store yalnız `addView` sunar. Bu yüzden eklenen satırın kaldırma kontrolü yoktur.

## Önerilen davranış

- Eklenen satırın başlığında “Görünümü kaldır” kontrolü bulunur. İşlem yalnız ilgili akışın o genişlikteki satırını kapatır; o satırda görünen bütün frame gösterimleri birlikte kaybolur.
- Kanonik frame/bileşen, not, bağlantı, stil ve responsive prop override'ları korunur. Aynı genişlik tekrar eklenince düzen olduğu gibi görünür. İşlem tasarım silmek değildir; geri alma geçmişine belge mutasyonu eklemez.
- İlk 1440 görünümü korunur. En az bir görünüm her zaman kalır.
- Kaldırılan satır aktifse önce düzenleme genişliği 1440'a alınır. Aksi halde `ResponsiveFlowViews` içindeki aktif genişliği ekleyen effect kapatılan satırı yeniden ekler. Birden çok akışta aktif akış/ekran korunmalıdır.
- Başka satır kaldırılıyorsa aktif görünüm ve seçili bileşen korunur. Geçici resize/drag veya o satıra bağlı popup açıkken kaldırma etkileşimi bunları tutarlı biçimde kapatmalıdır.
- Kalıcılık mevcut localStorage tercih mekanizmasındadır. Yenilemede kapalı kalır; başka makinede JSON importu mevcut kurala göre ana görünümle açılır.
- Basit bir kapatma için onay modalı gerekmez: veri kaybı yoktur ve aynı ekleme menüsüyle geri gelir. Kontrolün açıklaması “Yalnız bu görünümü kapatır; tasarım ve responsive ayarlar korunur” olur.

## Ayrı tutulması gereken işlem

“Bu boyuta özel ayarları sıfırla” belgeyi değiştirir. Görünümü kapatma ile birleştirilmemeli; ayrıca kapsam, onay ve tek adımlı undo gerektirir. İlk çözüm için gerekli değildir.

## Uygulamadan önce kabul kapsamı

Aktif/pasif satır, iki ayrı akış, en son/ana görünüm koruması, reload, yeniden eklemede override korunumu, aynı node kimlikleri/not/bağlantılar, belge ve undo geçmişinin değişmezliği; görünüm dışı kalan popup ve seçimin temizliği. JSON/MCP şeması değişmez.
