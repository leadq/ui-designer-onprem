# Filtreleme

Kapsam: domain/ilişki/servis uygulaması yalnız Detailed modda, kullanıcı cevabı veya doğrulanmış proje kuralıyla yapılır. Bu rehberin servis/iş kuralları Basic kapsamını genişletmez; Basic yapısal form/wizard altyapısı için forms/wizard kullanır. authoring-modes önceliklidir.

Filtre alanları + etkilediği sonuç listesi/tablosunu tek bağlamda yorumla. Çok input olması wizard demek değildir.
Apply/reset varsa taslak filtre ile uygulanmış filtreyi ayır. Anlık filtre/debounce/URL sync screenshot'tan kesinleşmez.
Select seçenekleri ve backend query parametreleri için kontrat gerekir. Sonuç sayısı bir alan girdisi değildir.

## Ekip dolduracak
- Filtre state/query mapping, submit/reset ve URL sync örneği:
- Debounce, cache reset, sayfa numarası sıfırlama politikası:
