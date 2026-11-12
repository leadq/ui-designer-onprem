<!-- rule
{
  "id": "wizard-code",
  "title": "Adımlı form kodlama yaklaşımı",
  "when": "wizard",
  "targets": [
    "react"
  ],
  "status": "needs-project-input"
}
-->

# Adımlı form kodlama yaklaşımı

Form state'ini bütün adımların üzerinde yaşayan gerçek proje provider/store yapısında tut. Stepper'a gerçek adımları ver; ileri/geri geçişinde değerleri koru. Modal veya aynı adımın görünümü yeni adım/route değildir. Field kimliklerini açık tasarım/veri sözleşmesinden al; aynı label alanları birleştirmek için yeterli değildir.

## Projede doldurulacak çalışan örnek
- Provider/context/manager importları ve minimal kullanım:
- Adım geçişleri, form state yaşam süresi ve geri dönüş:
- Modal, submit, validation ve routing bağlantıları:

Basic bu yapısal akışı içerir; servis, geçiş engeli ve iş kuralları Detailed'da teyit edilmişse uygulanır. Kabul: adım sırası, ileri/geri, değerlerin korunması ve modalın adım sayısını artırmaması. Provider bilgisi eksikse doğrulanmış bağımsız UI'yı tamamla ve entegrasyon eksikliğini bildir.
