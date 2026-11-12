<!-- rule
{
  "id": "forms-code",
  "title": "Form kodlama yaklaşımı",
  "when": "form",
  "targets": [
    "react"
  ],
  "status": "needs-project-input"
}
-->

# Form kodlama yaklaşımı

Tasarım rehberindeki alan ve eylem yapısını mevcut projenin gerçek form altyapısına bağla. Basic yapısal form state ve doğal input davranışını kapsar; Detailed yalnız teyit edilmiş validation/servis/iş kurallarını ekler. Eksik paket/import/API adını tahmin etme.

## Projede doldurulacak çalışan örnek
- Provider, field controller ve gerçek importlar:
- Alan kimliği, default değerler, hata gösterimi ve reset:
- Validation/submit ve varsa API bağlantısı:

Bileşenin native prop/event eşlemesini adapterdan al. Designer JSON alanlarını native props diye yayma. Yapılan entegrasyonu mevcut proje build/test komutlarıyla doğrula; eksik bağlantıları açıkça bildir.
