<!-- rule
{
  "id": "codegen-workflow",
  "title": "Kaynak kod üretimi",
  "when": "always",
  "phases": [
    "implement",
    "verify"
  ]
}
-->

# Kaynak kod üretimi

1. Kaynak prompt/image ise ekranı doğrudan yorumla; Designer açma/import etme/ara JSON üretme zorunluluğu yoktur. Kaynak editor ise güncel belge veya açık seçili ekran exportunu oku; node/slot/responsive/state/flow anlamını react-generation kontratına göre çöz.
2. İlgili pattern'ın tasarım ve kod tariflerini, architecture rehberlerini ve gerçek hedef projedeki çalışan örneği kullan. Eksik provider/import/router/API bilgisi tahmin edilmez; bağımsız UI tamamlanabilir, kalan entegrasyon açık bildirilir.
3. Component native import/props/event/provider/CSS bilgilerini gerçek adapter ve paket API'sinden al. Designer props nesnesini native JSX'e topluca yayma. Şema/JSON alanları yalnız Designer kaynaklı dönüşümde anlam kaybını önlemek için kullanılır.
4. Hedef mimarinin page/component/style/routing düzeninde gerçek dosyaları yaz. Basic UI ve verilen yapısal form/wizard akışını; Detailed ayrıca teyit edilmiş validation/domain/API/mock bağlarını kapsar. Scaffold kullanılıyorsa dry-run ve completionChecklist tamamlanır; boş iskelet çalışan ekran değildir.
5. taskPhase=verify içindeki proje test/kalite rehberlerini uygula. İlgili build/typecheck/test ile ekranın davranışlarını doğrula. Görsel inceleme istenmişse hedef uygulamayı render ederek karşılaştır. Designer doğrulamasını hedef uygulama kabulü yerine kullanma.
