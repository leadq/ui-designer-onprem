<!-- rule
{
  "id": "forms",
  "title": "Form alanları ve provider",
  "when": "form",
  "status": "needs-project-input",
  "summary": "Düzenlenebilir alanlar, form grupları ve kurumun provider/form-state yaklaşımı; wizard için de kullanılır.",
  "targets": [
    "design",
    "react"
  ],
  "phases": [
    "implement"
  ]
}
-->

# Form tasarım yaklaşımı

Alanları domain ve bölüm bazında grupla; label, hint, required ve error görünümlerini ayır. Input türünü semantik role ve gerçek adapter kataloğuna göre seç. Screenshot yalnız gösterilen durum için kanıttır; required yıldızı tek başına submit veya servis kuralı değildir.

## Projede doldurulacak tasarım örneği
- Alan grupları, kart/bölüm kullanımı ve dar görünüm davranışı:
- Label, yardım ve hata görünümü; ana/ikincil eylem yerleşimi:
- Tek sayfalık veya adımlı form seçiminin koşulları:

Bu örnek tamamlanana kadar tasarımda açık olan bilgiyi kullan; eksik tercihi kurum standardı diye sunma. Designer çıktısında teknik alanlar kontrat ve adapter kataloğundan gelir. Kaynak kodda form bağlantısı aynı pattern'ın code rehberinden gelir.
