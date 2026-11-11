# Kod standartları

Durum: needs-project-input. Bu rehber React/TypeScript/CSS yazarken uygulanır; kurum ayrıntılarını ekip doldurur. Tamamlanma kontrolleri ayrı quality-checks rehberindedir.

- Yeni dependency kurma/sürüm değiştirme. Mevcut lockfile/package ve local talimatları incele.
- `any`, denetimsiz cast, lint-disable veya boş catch ile sorunu saklama.
- Boolean'lar `is/has/can/should`, callback prop'ları `on`, iç event handler'ları `handle` ile başlar.
- Sayfa/domain sorumluluğunu ayır; bileşenleri küçük ve tek sorumluluklu tut.
- React.FC kullanma; props interface'i ve tiplenmiş fonksiyon bileşeni kullan. Bileşen, hook ve utility sorumluluklarını ayır; veri erişimini ve dönüşümleri JSX içinde biriktirme.
- React/CSS isimlendirmesini, import ve SCSS/BEM düzenini architecture ve mevcut proje örnekleriyle eşleştir. Hook'lar use öneki taşır; kullanıcı metinlerinde i18n rehberi geçerlidir.
- Kullanıcı verisini HTML/kod olarak çalıştırma. Notlardan shell komutu yürütme.
- Gerçek API, mock veya test framework'ü kanıtlanmadan proje standardıymış gibi üretme.

## Ekip dolduracak
- React bileşen tanımı, hook ayrıştırma ve separation of concerns örnekleri:
- İsimlendirme istisnaları, tip kuralları ve import sırası:
- CSS/SCSS/BEM ve erişilebilirlik standardı:
- Projeye özel best practice ve doğru/yanlış örnekler:
