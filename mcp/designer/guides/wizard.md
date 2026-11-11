# Adımlı form ve açılır pencereler

Kapsam: iki modda da formun yapısal altyapısı verilen mimari strateji/örnekten kurulur. Basic provider/context/stepper, ortak form değerleri ve ileri/geri geçişini içerir. Alan bağımlılığı, validation, servis ve iş kuralları Detailed kapsamıdır. authoring-modes önceliklidir.

Önce form rehberi. Açık `formStep` bağlantıları ortak form kapsamını tanımlar; frame sayısı tek başına adım sayısı değildir.
`stateChange` aynı sayfanın görünümü; overlay ek form adımı değildir. `navigation` router niyetidir.
Form provider/context tüm ilgili adımların üzerinde kalır; ileri/geri geçişte girilmiş değerler korunur.
Özetler `textBinding.sourceNodeId` değerini gösterir. Uygulama store/provider importunu mimari profilden al.
`openOverlay` aynı presentation türündeki açık pencereyi değiştirir; confirmation → OTP önceki modalı kapatır.
Cancel/close yalnız modalı kapatır, özette kalır. goTo aynı grubun ekran/overlay durumunu değiştirir.
Manifest effects sırası ve conditions geçerlidir; DOM görünüm diff'inden iş kuralı türetme.
OTP'nin dolu tasarlanması gerçek doğrulama servisi değildir; API ve güvenlik davranışı ayrı gereksinimdir.

## Ok çizilmemiş çok ekranlı wizard

screen-understanding kapsamını uygula: açık ekran seçimi yoksa güncel belgenin tüm ekranlarını, varsa seçili kapsamı incele. Önce JSON relations/formStep/page/formScope ve screenshotları birlikte oku. Açık bağlar varsa bunları görsel tahminle değiştirme. Bağ yoksa aynı amaca ait numaralı adımlar, step başlıkları ve içerik devamlılığı gibi güçlü kanıtlarla adım planını çıkar; canvas sırası veya birlikte gönderilme yeterli değildir. Sıra/grup belirsizse tek kısa soru sor.

Her iki modda kurumun form ve wizard örneğini oku, yalnız tanımladığı yapıyı uygula: ortak provider/context'i adımların üzerine yerleştir, stepper'a gerçek adımları ver, ileri/geri handlerlarını bağla ve form değerlerini geri dönüşte koru. Field kimliklerini mevcut JSON/kurum eşlemesinden al; benzer label tek başına iki alanın aynı field olduğu anlamına gelmez. Rehber henüz doldurulmamışsa paket/import uydurma; bağımsız ekranı tamamla ve eksik provider entegrasyonunu bildir.

Örnek: bilgiler → adres → özet ve özetin modal açık görünümü, üç adım + bir modal durumudur. Modal ve aynı step'in görsel state'ini fazladan adım/route yapma. Son adımın eyleminden gerçek submit, OTP veya başarı yönlendirmesi üretme. Basic'te required işaretinden geçiş engeli veya il-ilçe ilişkisinden query çıkarma; verilen mimarinin yapısal bağlantılarını kur, domain koşullarını Detailed'a bırak.

Çıkarılan planı kaynak JSON'un açık kontratı gibi sunma. React üretimi kaynak tasarımı otomatik değiştirmez. Designer'a da yazılması istenirse yalnız desteklenen bağlantı alanlarını kullan, validate_design ve applied ACK ile doğrula; varsayımsal formStep alanı ekleme. Basic kabulünde üç adımın sırası, ileri/geri, değerlerin korunması ve modalın adım sayısını artırmaması kontrol edilir.

## Ekip dolduracak
- Wizard context/provider/manager importları ve minimal örnek:
- Form state yaşam süresi, geri dönüş, submit ve modal yöneticisi:
