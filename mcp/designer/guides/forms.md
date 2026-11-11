# Form

Kapsam: iki modda da formun yapısal altyapısı verilen mimari strateji/örnekten kurulur. Basic provider/context/stepper, ortak form değerleri ve ileri/geri geçişini içerir. Alan bağımlılığı, validation, servis ve iş kuralları Detailed kapsamıdır. authoring-modes önceliklidir.

Alanları domain ve bölüm bazında grupla; label, hint, required ve error görünümlerini ayır.
Input türünü semantik role göre seç. Screenshot yalnız initial state için kanıttır.
Hedef projede form provider varsa architecture rehberindeki doğrulanmış provider ile sar;
kütüphane/import bilinmiyorsa yeni form paketi veya provider uydurma.
Görünürlük ve enabledWhen kuralları alan state'inden türetilir; disabled = !enabledWhen.
Required yıldızından otomatik olarak submit-disabled veya servis doğrulaması çıkarma.

## Başlangıç verisi ve önizleme
Metin input/textarea örnek içeriğini `previewValue.defaultProp` alanına yaz (`defaultValue` gibi).
Switch/checkbox için aynı metadata `defaultChecked` gösterebilir; false/true boolean kullan.
Placeholder doldurulmuş veri değildir. Runtime prop (`value`/`checked`) yerine başlangıç prop'unu
kullan; değişiklikleri önizleme yönetir. Baştan başlat ilk değerleri geri yükler.
Save/Cancel butonları isimlerinden submit/reset kazanmaz. Bağlanmamışsa görsel rol olduklarını bildir.
Input içi ikon, prefix, upload ve rich-text için capability-gaps rehberini uygula.

## Ekip dolduracak
- Form provider, field controller, validation ve submit örneği:
- Alan isimleri, hata gösterimi, reset ve default değer politikası:
