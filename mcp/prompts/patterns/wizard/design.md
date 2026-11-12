<!-- rule
{
  "id": "wizard",
  "title": "Adımlı form ve pencereler",
  "when": "wizard",
  "status": "needs-project-input",
  "summary": "Aynı işi tamamlayan sıralı ekranlar; forms ile birlikte provider, stepper, ileri/geri ve ortak değerler.",
  "targets": [
    "design",
    "react"
  ],
  "phases": [
    "implement"
  ]
}
-->

# Adımlı form tasarım yaklaşımı

Açık formStep ilişkileri adım grubunu ve sırasını belirler. Aynı anda verilen ekranlar veya canvas sırası tek başına wizard kanıtı değildir. Ok yoksa numaralı adımlar, ortak amaç ve içerik devamlılığıyla plan çıkar; belirsiz gruplamayı sor. Modal ve aynı ekranın farklı görünümü yeni adım değildir.

Bilgiler → adres → özet ve özet üzerinde modal: üç adım ve bir modal durumudur. İleri/geri sırasında girilmiş değerlerin korunması beklenir; son düğmenin adından gerçek submit/OTP servisi çıkarılmaz. Çıkarılan planı kaynak JSON'un açık ilişkisi diye sunma.

## Projede doldurulacak tasarım örneği
- Adım göstergesi, kartlar ve başlıkların yerleşimi:
- Geri/devam/iptal eylemlerinin konumu ve görünümü:
- Özet, modal ve dar ekran davranışı:

Yalnız kayıtlı bileşen yetenekleriyle uygula. Gerçek Stepper yoksa native API uydurma; eksik yeteneği bildir. Provider/import/validation uygulaması kaynak kod rehberinin konusudur.
