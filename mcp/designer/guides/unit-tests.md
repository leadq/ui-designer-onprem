# Unit test rehberi — implementasyondan sonra

Durum: needs-project-input. UI/bileşenler ve davranışlar oturmadan test kodu üretme.
Önce bu rehberi ve hedef projedeki mevcut test örneklerini oku. Framework, render helper,
provider wrapper, mock sistemi, test dosyası konumu ve komutlar doğrulanınca testleri yaz.

Testler implementasyon satırlarını kopyalamaz; kullanıcı sonucu ve önemli kontratları denetler:
form verisinin korunması, geri dönüş, koşullu görünürlük/aktiflik, modal cancel'ın aynı adımda kalması,
confirmation → OTP değişimi, başarı ve hata dalı; ihtiyaç duyulan API/mock davranışları.
UI tasarımı screenshot-only ise olmayan servis/OTP doğrulaması için test uydurma.

## Ekip dolduracak
- Test runner ve dosya yerleşimi:
- Ortak render/provider helper:
- API mock setup ve reset/cleanup:
- Asenkron test yaklaşımı ve tercih edilmeyen yöntemler:
- Varsa coverage kuralları ve test komutları (genel kalite kapıları quality-checks rehberinde):
- İyi bir bileşen testi örneği:
