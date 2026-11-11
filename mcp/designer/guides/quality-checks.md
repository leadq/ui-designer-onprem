# Kalite kontrolü — implementasyondan sonra

Durum: needs-project-input. UI, davranışlar ve gerekli test kodu tamamlandıktan sonra uygulanır.
Kod yazım kuralları standards rehberindedir; testin nasıl yazılacağı unit-tests rehberindedir.

- Hedef projenin package scriptleri, mevcut config ve yerel talimatlarından komutları belirle. Tanımlı lint/ESLint, tip kontrolü, ilgili testler ve build kontrollerini çalıştır. Yeni linter/test paketi kurma; bulunmayan komutu varmış gibi sunma.
- Değişikliğin oluşturduğu hataları düzelt; ilgisiz mevcut hataları kapsamıyla ayrı raporla. Kuralları kapatarak geçirme.
- Sonar yalnız projede gerçekten yapılandırılmış ve yönergesi verilmişse uygulanır. Kural, eşik veya coverage hedefi tahmin etme.
- Yalnız kullanıcı görsel inceleme/karşılaştırma istiyorsa ilgili ekranı görsel olarak doğrula: hizalama/taşma, gerçek component davranışı, çeviri anahtarları ve mock üzerinden loading/error/empty durumları (tanımlıysa).
- Teslimde çalıştırılan komutları, sonuçları ve çalıştırılamayan kontrolleri nedenleriyle belirt. Build başarısı görsel doğrulama değildir.

## Ekip dolduracak
- Lint/ESLint, typecheck, test ve build komutları / çalışma dizini:
- Zorunlu teslim/CI kapıları ve varsa kalite eşikleri:
- Varsa Sonar entegrasyonu ve kurum kuralları:
- Görsel/erişilebilirlik kabul adımları:
