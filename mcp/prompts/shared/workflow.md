<!-- rule
{
  "id": "workflow",
  "title": "Çalışma sırası",
  "when": "always",
  "phases": [
    "understand",
    "implement",
    "verify"
  ]
}
-->

# Çalışma sırası

1. Girişi (prompt/image/editor), hedefi (design/react) ve istenen kapsamı belirle. Bilinen adapterı kullan; bilinmiyorsa katalog listesinden veya mevcut belgeden öğren.
2. get_design_contract overview çağrısına goal/source/mode değerlerini taşı. guidance.required içindeki metinler zorunlu çalışma girdisidir; indeks okumak içerik okumak değildir. Mod/ölçek belirsizliğini authoring-modes ve screen-understanding ile çöz.
3. Ekranın bölgelerini, ilişkilerini ve gereken pattern'ları belirle. guideIndex'teki when/summary alanlarını kullan; gereken bütün pattern adlarını details isteğinin patterns alanına koy. Yeni dosyalar otomatik keşfedilir; mevcut bir kuralın kimliğini ezerek teknik kontratı değiştiremezsin.
4. details ile seçilen componentTypes, patterns ve aynı contractRevision üzerinden ilerle. Dönen guidance.required hedef ve pattern için zorunlu kuralları içerir. needs-project-input örnekleri gerçek proje bilgisiyle tamamlanmadan hazır standart sayılmaz. Yeni pattern ortaya çıkarsa yeni detay isteği yap.
5. Designer hedefinde designer-workflow; kaynak kod hedefinde codegen-workflow içeriğini uygula. Prompt/image → React için Designer JSON/import oturumu zorunlu değildir. Editor kaynağında belgeyi canlı bağlamdan oku; teknik JSON eşlemesini koru.
6. Tamamlamadan önce aynı görev bağlamıyla get_design_contract details ve taskPhase=verify çağır. guidance.required kontrollerini uygula; çalıştırılan ve açık kalan kabulü ayrı bildir. Kaynak görseli okumak otomatik render izni değildir; görsel karşılaştırma açıkça istendiğinde ilgili rehberi kullan.

Görseli sınıflandıran agent'tır. MCP yalnız bildirilen hedef/kaynak/pattern'lar için içeriğin teslimini garanti eder; modelin anladığı veya uyduğu varsayılmaz. Yeni hedef/pattern/revision için keşfi yenile. Büyük kataloglarda yalnız ilgili bileşen detaylarını al; teknik kontratta ilgili alanları atlama.
