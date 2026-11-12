# Tasarım JSON'undan React/TypeScript üretim tarifi

Bu görev **hedef uygulama reposunda** yapılır. Designer adapter implementasyonu için ayrı prompt (geliştirme reposundaki kaynak) vardır. Önce teslim paketini (geliştirme reposundaki kaynak), alan okurken [JSON sözlüğünü](json-field-reference.md) kullan. Kurum profili dosya/isim/state/router/stil kurallarını belirler; bu tarif Designer verisinin anlamını o kurallara eşler.

## 1. Girdileri kontrol et; küçük bir çalışma kaydı tut

1. Hedef repo talimatları, kurum profili ve bir çalışan sayfa/component/form örneğini oku. Eksik özel paket importunu, provider'ı veya servis URL'sini tahmin etme.
2. Kaynak JSON biçimini/sürümünü ve adapterId'yi doğrula. Tercih tek güncel flat + behavior dosyasıdır. Designer/MCP erişimi varsa aynı revizyonda validate_design(output: "flat") çalıştır, dönen document alanını tüket; eski dosyanın behavior alanını tutma. Eski workspace için önce editör import/migration ve yeni export gerekir. Offline pakette güncel exporter/validator kanıtını teslim notundan kontrol et; yoksa doğrulanmamış olarak kaydet. Dosya yalnız JSON.parse'dan geçtiyse bunu semantik doğrulama sayma.
3. Kaynak olarak bir normalize ağaç seç. Flat geldiyse sıralı ID dizilerinden kur; behavior ilişkilerini yardımcı olarak kullan. Nested/flat kopyaları çelişiyorsa iki kaynaktan karışık ekran üretme.
4. Tüm normal çocuklar, inline slotlar ve kullanılan savedDesigns boyunca gez; kullanılan type'ları topla. Yalnız bu type'ların detaylı kataloglarını ve ihtiyaç duydukları native örnekleri yükle. Bilinmeyen type için HTML taklidi yapma.
5. Mod verilmemişse Basic/Detailed seçimini öğren. JSON içindeki açık ilişkileri Basic diye silme; Basic'te kapsam dışı kalan domain davranışını kaydet. Kaynak CSS viewport genişliği güvenilir değilse sor; kullanıcı bilmiyorsa bir kez açık yaklaşık referans üzerinde anlaş. Frame editörünün hazır genişliği export JSON'unda garanti alan değildir.
6. İstenen ekranları belirle; açık seçim yoksa güncel belgenin tüm ekranlarını incele. Seçili kapsam varsa dışarıdaki sourceNodeId/targetNodeId/ownerFrameId, tab başlangıcı ve saved slot bağımlılıklarını listele. İlgisiz ekranı uygulama; gereken bağımlılığı nasıl karşılayacağını açıkça çöz. Mevcut araçta bağımlılıkları kapatılmış otomatik seçili ekran paketi varsayma.

Kısa çalışma kaydı sütunları: **node ID | rol | native eşleme kaynağı | hedef dosya/sorumluluk | state/bağlantı | doğrulama | açık konu**. Her node'a ayrı dosya açma; aynı sorumluluktaki ağacı birlikte tut. Bu kayıt hedef implementasyon kanıtıdır, tasarım JSON'una eklenmez.

## 2. İskeletin parametrelerini doldur

[Architecture](../../prompts/code-gen/architecture.md), [standards](../../prompts/code-gen/coding-standards.md), [template-completion](../../prompts/code-gen/template-completion.md) ve hedef repo örneğini izle. Üretici varsa:

| Parametre / karar | Nereden gelir? |
| --- | --- |
| version | Dağıtılan scaffold asset kontratı; tasarım version'ı değil |
| componentName / pageName | Ekranın doğrulanmış sorumluluğu + kurum isim standardı; pageName JSON metnini körlemesine identifier yapma |
| primitiveName / primitiveImport | Kurumun gerçek common/UI exportu ve import yolu |
| styleFile | Desteklenen scaffold seçeneği + kurum standardı |
| api (opsiyonel) | Yalnız Detailed ve doğrulanmış servis/demo kontratı: isim, base API import/name, endpoint adı, URL, metot |

Mevcut starter-react scaffold page/domain component ve SCSS Module iskeleti; isteğe bağlı API/types/mock üretir. Desteklediği styleFile seçenekleri styles.module.scss / style.module.scss'tir; **CSS Module veya başka klasör şeması için aynı generatorı destekliyormuş gibi çağırma**. Hedef profil farklıysa onaylı hedef template/üretim yolunu kullan. Generator dışındaki gerekli provider/router/hook içeriklerini agent tamamlar.

Asset revision/hash → dry-run dosya planı → çakışmasız yazma → completionChecklist'teki pending işleri gerçek içerikle tamamlama. Mevcut kullanıcı dosyasını yeniden scaffold ederek ezme. Bu görev paket/sürüm yükseltmesi gerektirmez; gerçekten eksik erişim varsa bildir.

## 3. Ağaçtan bileşen ve dosya üret

- designerFlow metadata'sından flow/sayfa/adım planını çıkar; designerFrame.children'ı ilgili sayfa/domain gövdesine yerleştir. Bu iki tür için fazladan native wrapper üretme.
- Her gerçek node'da katalog importPath/importName/importType/jsxName ve native kullanım eşlemesini çöz. Named/default/none, additionalImports, compound provider ve gerekiyorsa support code'u koru. Hedef kurum common katmanı bunları sarıyorsa doğrulanmış public API'sini tüket.
- Propsları **semantiğine göre** ayır: native görünüm/veri propsları → native component; başlangıç değerleri → state/form defaultları; slot/saved tasarım referansı → gerçek içerik; rows/cellContents gibi adapter girdileri → native Table oluşturma kodu. JSON props nesnesini tümüyle JSX'e yayma.
- Normal children'ı sırasıyla üret; metin için props.children kullan. Slot node/callback ayrımı, item argüman eşlemesi, rich hücre/bağımsız liste/Tabs için [alan sözlüğünün 6. bölümünü](json-field-reference.md#6-slotlar-ve-yapısal-içerik) uygula. Tablo hücresini plain string'e indirgeme.
- Template ID'si ile runtime instance kimliğini ayrı tut. Saved tasarımı birkaç kez kullanan veya legacy satır render eden componentte her instance kendi state kapsamını korumalı.
- Native provider/CSS/tema kurulumunu hedef uygulama girişinde profildeki sıraya yerleştir. Designer editör kabuğunu, canvas selection/DnD ve + yardımcılarını uygulamaya taşıma.

## 4. Style'ı component yanındaki modüle çevir

Örnek kaynak yerleşim: `style: {display:"flex",flexDirection:"column",gap:16,padding:24}`, `responsiveStyles: {sm:{padding:12}}`.

Kurum profili styles.module.scss diyorsa sorumlu domain/component klasöründeki o dosyada kök sınıfa display:flex, flex-direction:column, gap:16px, padding:24px yaz; <768px katmanında padding:12px uygula. JSX kökünde o modül sınıfını native doğru root'a bağla. Profil styles.module.css diyorsa bu isim/syntax kullanılır; proje adı veya uzantısı Designer JSON'undan çıkmaz.

Bu küçük örnekte profilin başka sınıf/ad kuralı ve adapter varsayılanı yok varsayılmaz: önce defaultStyle + varsa prop'a bağlı layout, sonra açık stil ve responsive katmanlarını çöz. Kütüphane root/classNames/body farkını native örneğiyle uygula. Bütün düğümlerin stilini tek rastgele global dosyada toplama veya kaynak props'a className geri yazma.

Kenar shorthand resetleri, birimsiz sayılar, min/max, overflow ve fill niyeti için [alan sözlüğü 5](json-field-reference.md#5-style-ve-responsive) ve fill-layout (Designer reposunda `docs/fill-layout.md`) gerekli. Parent yönü breakpoint'te değişirse fill çözümünü o breakpoint için tekrar hesapla. Katalogdaki fixed appearance default'larını native görünümü bozacak keyfi CSS'e dönüştürme. Eşdeğer token biliniyorsa profilin tokenını kullan; bilinmiyorsa yeni token ismi icat etme.

## 5. State ve olayları gerçek uygulamaya bağla

1. Normal scalar alanların başlangıçlarını previewValue ve kayıtlı props önceliğiyle kur. Kurum form/controller stratejisini kullan; controlled value + change veya checked + change eşlemesini native örnekten doğrula.
2. Event argümanını doğrudan state sanma: onChange(value), onChange(event), onChange(event,value) farklıdır. Native callback'ten doğru scalar çıkar, önce state'i güncelle, sonra değişim kuralını yeni değerle değerlendir. Event'i iki kez zincirleme.
3. Hedef stateRules.visibleWhen/enabledWhen'i alan değerlerinden türet. Göster/gizle, legacy toggle dışlama ve ancestor/owner görünürlüğü önceliklerini koru. Hidden state'i sırf koşullu mount/unmount ile kaybetme; eşdeğer form/state korunumu gerekir.
4. textBinding'i kaynak değere bağla; designText'i çalışma verisine alma. Kaynak boşsa fallback; 0/false görüntülenir.
5. interactions'ta her kaynağın trigger'ını gerçek node'a bağla. Koşulu bir kez hesapla; doğru/yanlış dalı ve listedeki effect sırasını uygula. Geçersiz değer iki dalı da atlar. Birden fazla kuralın sırasını koru.
6. formStep → kurumun stepper/form paylaşımı; navigation → teyit edilmiş route; stateChange → aynı sayfa görünüm durumu. Açık URL bulunmadığı için route üretimini hedef profille çöz. Aynı isimli inputları otomatik birleştirme; ortak form alanı kimliğini açık veri sözleşmesinden kur.
7. Overlay kökte tanımlı olsa da ownerFrameId bağı korunur. Native modal/notification'da açık state, dismiss, focus dönüşü, başlangıç ve aynı presentation değişimini bağla. Modal etiketi “OTP” diye gerçek doğrulama servisi oluşturma.

Basic görünür UI/native state ve kurum stratejisindeki yapısal form/wizard akışını kurar; iş kuralı/servis çıkarmaz. Detailed teyit edilen domain koşullarını da uygular. Kaynakta açık bulunan ama seçilen modda uygulanmayan bir davranış **tamamlandı diye işaretlenmez**; çalışma kaydında kalır. İhtiyaç varsa kullanıcı kapsamıyla çözülür. [Mod politikası](../../prompts/shared/authoring-modes.md).

## 6. Küçük, somut okuma örneği

form-review.design.json (Designer reposunda `archive/adapters/mantine/examples/form-review.design.json`) tam import edilebilir **Mantine referans fixture'ıdır**. Kurum library'si değildir; adapterId değiştirerek kullanılmaz. Flat eşleniği (Designer reposunda `archive/adapters/mantine/examples/form-review.flat.json`) aynı kaynaktan exporter ile üretilir. Bu örneğin hedef React kodu burada hazırlanmış değildir; aşağıdaki tablo agent'ın üretmesi gereken karşılığı gösterir.

| JSON yolu / ID | Hedefte yapılacak |
| --- | --- |
| flow-main.flow | Başlangıç details; iki normal frame ve review'a ait confirm modalı. Flow DOM'u yok |
| details → form-layout | Profilin domain component'i içinde gerçek Box; yanında stil modülü. flex column/gap16/padding24, sm padding12 |
| name-field.props.defaultValue | İlk input değeri Ada. props.label görünen etiket; node.label olsaydı editör adı olurdu |
| next.stateRules.enabledWhen | name-field notEmpty ise Devam aktif; boşsa disabled. Bu kural Detailed örneğinin açık domain kapsamıdır |
| next.interactions | click → formStep → review. İki mantıksal adım; confirm üçüncü adım değil |
| review-name.textBinding | name-field runtime değeri; boşta “Ad girilmedi”. “Örnek ad” designText'i üründe başlangıç değeri yapma |
| review-back.interactions | click → details. Geri gelince yazılan input değerini koru |
| confirm-open.interactions | click → confirm overlay; review görünür kalır |
| confirm.overlay | review sahibi, modal, başlangıç kapalı, backdrop açık; native dismissal/focus |
| confirm-close.interactions | Yalnız confirm'i kapat; gerçek gönderme/API yok |

Bu örnek yalnız form/state/metin/modal/layout ilişkilerini küçük tutar. Rich tablo/List/Tabs/disclosure ve legacy slot tariflerini [data-display](data-display.md) içinden yalnız ilgili aile için al. Daha geniş flow/slot/savedDesigns örneği application.design.json (geliştirme reposundaki kaynak); flat eşleniği aynı klasördedir.

## 7. Kabul ve teslim

Her kaynak öğeyi çalışma kaydında hedef dosya/render/test kanıtına bağla. En az:

- Hedef projenin mevcut type/lint/build ve anlamlı test kapıları geçer; yeni paket veya mevcut dosyaya istenmeyen değişim yoktur.
- Gerçek tarayıcıda kaynak viewport ve bir dar aralık incelenir: içerik sırası, padding/gap/fill, taşma, native tema/portal. Build görsel kabul değildir.
- Örnekte Ada → yeni ad değiştir, Devam, özette yeni adı gör, geri dön ve korunduğunu gör; boş adla Devam kapalı, yeniden doldurunca açık. Modal aç/kapat/Escape/backdrop/focus ve yeniden açma denenir.
- Tablo varsa en az iki farklı rich hücre ve native olay; Tabs/disclosure varsa içerik state'inin korunması; legacy slot varsa item scope ve iki instance'ın bağımsızlığı kontrol edilir.
- Hiçbir görünür buton sırf label'ı nedeniyle servis çağırmaz; onaylanmış domain kapsamı varsa API/mock/loading/error ayrıca sınanır. Scaffold placeholder/boş mock/yanlış örnek import bitmiş iş değildir.
- Sonuç: tamamlanan ekran/ilişkiler, kalan eksik bilgi, çalıştırılan kontroller ve yapılmayan ortam/model kabulü. Tek başına JSON doğrulaması veya TSX derlenmesi çalışan ürün kabulü değildir.

Model kabulü için aynı JSON + katalog + native örnek + profil ile küçük örneği hedef modelde çalıştır; düzeltme turu, süre ve yukarıdaki geçiş sonuçlarını kaydet. Model adı veya zekâ tahmini yerine bu kabul kanıtı kullanılmalı. Bu teslimde böyle bir benchmark koşulmadı.

## Agent görevi

Aşağıdaki metni hedef React reposundaki agent'a ver; köşeli alanları gerçek dosya yolları ve istekle değiştir:

> Ekli [design.json], detaylı [catalog.json], [native-usage] ve [project-profile] üzerinden hedef repoda React/TypeScript ekranlarını tamamla. docs/agent-handoff/react-generation.md sırasını izle; JSON alanları için json-fields.md'yi ve yalnız kullanılan ailelerin rehberlerini oku. Hedef kapsam: [ekranlar veya tüm belge]. Mod: [Basic/Detailed; belirtilmediyse sor]. Kaynak CSS viewport: [bilinen değer veya bilinmiyor]. Önce kullanılan node ID/type/native eşleme ve davranış bağımlılıklarını kısa çalışma kaydına çıkar. Kurum profilinden template parametrelerini doğrula, dosya planını dry-run ile incele, iskeleti gerçek içerik/style/state/flow koduyla tamamla. Stil dosyası ve native root bağlaması profil/adapter kanıtına uysun. Eksik native callback, servis veya route bilgisini uydurma; bağımsız işleri sürdür, engellenen eşlemeyi açık bırak. Mevcut dosyaları koru. Kaynak ilişkiyi kaybetme; gerçek tarayıcı ve hedef proje kontrolleriyle doğrula. Sonuçta uygulanan ekran/ilişkileri ve açık kalanları kanıtlarıyla bildir. JSON'a yeni alan ekleme; scaffold veya statik TSX'i tamamlanmış uygulama sayma.


## Responsive propları kurum hook'una çevir

1. Her node'da props + responsiveProps ile style + responsiveStyles ayrımını yap. Responsive stilleri kurum mimarisinin component yanındaki CSS/SCSS module dosyasına ve doğrulanmış breakpoint mixinlerine yerleştir. Tipografi variant/size gibi native prop'ları CSS isimleri sanma.
2. Kurum profilinden viewport hook'unun **import yolu, adı, dönüş tipi, CSS-pixel genişliği/breakpoint semantiği, SSR ilk değer ve hydration politikası** bilgilerini al. CSS mixinlerinin aralıklarıyla karşılaştır. useMedia/useQuery gibi isimleri veya dönüş alanlarını tahmin etme. API yoksa eksik bilgi olarak kaydet; bağımsız template/yerleşim işini sürdür.
3. Tek component instance'ına verilecek effectiveProps'u defaultProps + props + aktif aralığa kadar wide→lg→md→sm→xs ile çöz. xl yalnız temel değer; xs 576 altı, 375 eşik değildir. Nesne birleştirme yapma; opt-in scalar anahtarları katman sırasıyla ata. Eksik anahtarı devral, false/0/boş metni koru; `value || fallback` kullanma.
4. Adapter'ın responsiveSemanticElement eşlemesini temel props/default üzerinden bir kez çöz. Örneğin Material base variant=h3 ve md variant=h6: DOM component=h3, görsel variant=h6. Hedef library semantiğini gerçek native örnekle doğrula. İçerik/state/events ortak; ekran genişliği değişince key veya component type değiştirip formu sıfırlama.
5. Aynı aralığı CSS ve hook'ta eşle: 1440+, 1200–1439, 1024–1199, 768–1023, 576–767, 576 altı. Kurum farklı breakpoint isimleri kullanıyorsa sayısal aralıkları açıkça eşle; en yakın ismi sessizce seçme. Hook'u React kurallarına uygun component/custom hook üst seviyesinde çağır.
6. 1440, 1439, 1200, 1024, 1023, 768, 767, 576, 575, 375 genişliklerinde beklenen değer tablosunu ve gerçek native DOM'u doğrula. Input doldur, genişliği değiştir, değerin korunduğunu; heading tag, focus ve event bağlantısının değişmediğini kontrol et.

Örnek çözüm tablosu (Mantine): temel size=xl, md size=lg, xs size=sm → 1440/1200/1024: xl; 1023/768/576: lg; 575/375: sm. Bu yalnız veri algoritmasıdır; kurum hook'unun kodunu/profilini icat eden bir örnek değildir. Her node farklı override taşıyabilir. Ayrı desktop/mobile component ağaçları üretme. Tuvaldeki çerçeveler ve görünüm satırları ürün DOM'una aktarılmaz. `data-designerprops` TSX işareti açıklayıcıdır; gerçek koşullu native prop kodunu sen tamamlamalısın.

## React 18.3.1 runtime — 22 Ekim 2026

Bu branch Designer runtime'ını React/React DOM **18.3.1** ile çalıştırır. Native bileşen, prop ve event eşlemeleri seçili adaptera aittir; kesin native sürümü kurumun package.json ve package-lock.json dosyaları belirler. Normal npm ci/peer denetimi kullanılır; legacy-peer-deps veya force ile uyumsuz peer kabul edilmez.

Giriş client tarafında react-dom/client createRoot kullanır. StrictMode ve effect mount/cleanup replay açıktır. Editör kimlikleri mevcut useStableId ile mount boyunca sabit ve kökler arasında tekildir; server hydration kontratı yoktur. Editör harici store abonelikleri React.useSyncExternalStore kullanır. React/ReactDOM/react-is ve React tipleri kök manifest overrides/resolutions ile 18.3.1'e eşlenir. Native adapter sürümleri değiştirilmez; editör common UI bu native paketlere bağımlı değildir.

Native tablo/sekme/uyarı eşlemesini seçili adapterın kaynak ve kataloğundan okuyun. Bunları DesignNode.props alanına kayıtlı olmayan native API adları olarak eklemeyin. Hedef uygulamanın native sürümünü kendi manifesti ve adapter sözleşmesiyle doğrulayın.


### Adapter görsel seçenekleri — 21 Ekim 2026
Ortak Düzen paneli yalnız layout alanlarını yazar. Renk, kenarlık ve diğer native görsel özellikler yalnız adapter propsSchema ile sunulur; keyfi style.color/backgroundColor/border/opacity/boxShadow alanları eklenmez.

Native renk seçeneklerinin kaynağı seçili adapterın propsSchema alanıdır. Aynı şema normal ve responsive prop değerlerine uygulanır. Kayıtlı olmayan değerleri başka library örneklerinden türetmeyin. Desteklenmeyen değerler sessizce dönüştürülmez; strict import reddi ve ham kayıt kurtarma yolu korunur. Kanonik JSON alanları/sürümü değişmedi.

### İkon üretimi

`icon` node’unun `props.glyph` kimliğini katalogda yapılandırılmış tek kaynakla çözün; kaynağın getExportConfig sonucu gerçek native paket/export ve çakışmasız JSX aliasının sahibidir. Teslimde kaynak `null` başlar; MCP `iconLibraries` boşsa ikon paketi veya import adı uydurmayın. Açık boş glyph boyutunu koruyan span üretir.

Genel `glyph`/`accessibleLabel` alanlarını native ikona yaymayın. Açıklamayı erişilebilir span köküne, dekoratifliği aria-hidden’a eşleyin; native size varsayılanı 32px ve açık layout ölçü önceliği korunur. Editörün EditorIcon/Tabler kontrolleri üretilen tasarımın ikon paketi değildir. `archive/iconLibrary` kaynakları pasif uygulama örnekleridir; arşivdeki kimlikler otomatik geçerli veya başka kaynağa dönüştürülmüş sayılmaz. Kurum ikon kaynağını (Designer reposunda `src/adapters/iconLibrary/README.md`) gerçek paket API’siyle kurup doğrulayın.
## Explicit selected-screen export

For a user request limited to selected whole screens, first read ready `get_editor_context`. Require `frameExport.eligible=true`, then call `export_selected_frames` with exactly `frameExport.frameIds`, current `expectedVersion`, `editorId` (and HTTP `clientId`, `designId`). `format` is nested (default) or flat. Only the top responsive row has frame checkboxes; they toggle whole-screen IDs without modifiers and leave component selection empty. All responsive copies show the frame outline. Active tabs, component selections, partial/mixed/reference/preview/stale selections never imply whole frames. Report the error and ask the user to select whole screens; never silently fall back to exporting all screens or infer a component's parent frame.

The result's `document` is strict-importable, with whole selected subtrees/slots/responsive values and owned overlays. Only selected flow screens remain; the first remaining normal screen becomes start if needed. Actions to excluded nodes, their external otherwise branches, and bindings/conditions depending on excluded nodes are pruned, as reported by `scope.omitted`. Internal screen links remain. No external screen/stub is added. Unrelated page notes/annotations and unused saved templates are omitted. Referenced slot templates and their transitive dependencies remain with stable IDs; missing or recursive saved content fails with INVALID_SAVED_CONTENT. Preserve authored fallbacks. Export is read-only; `get_design` remains full source. Selection and response `scope` are not document fields. See docs/contracts/README.md for error codes and pruning rules.


23 Ekim ikon varsayılanı: yeni ikon ilk kayıtlı katalog öğesiyle oluşturulur; seçim penceresi açılmaya devam eder ve iptal varsayılanı korur. Açık boş glyph eski belgeler için geçerlidir; size ölçüsü boş ikon dahil runtime ve TSX köküne uygulanır, açık layout width/height değerleri önceliklidir.

Selected-frame exports prune excluded targets inside retained saved slot templates too; local template references and included-screen references remain valid.

## Adapter color tokens (v14)

Resolve styleTokens and responsiveStyleTokens through the active catalog's
colorPalette. Preserve cssValue references such as var(--color-primary-red);
import the library CSS explicitly in the target application. If generating SCSS
and the token supplies sass.variable and sass.importPath, import that path and
use that variable instead. Never put a Sass variable in a browser inline style.
Translate desktop-first responsive token overrides to target media queries.
Designer TSX contains base resolved CSS plus data-designercolortokens and
data-designerresponsivecolortokens authoring metadata, not a complete responsive
stylesheet. A border color does not create a border. Apply colors to the same
native root as layout; do not guess native internal slot colors.

### Library surface default

Catalog backgroundColor is an optional token ID from the active adapter's colorPalette
(null when not configured or not allowed for backgroundColor). It supplies the palette
sample, default frame and prototype preview/capture viewport background. It is not a
document field: do not add backgroundColor or styleTokens to structural frames/flows.
Native component backgrounds and authored color tokens retain precedence. CSS variable
references must be available at the document root. To reproduce the preview in a target
application, apply this token to the page surface; node TSX export does not inject it.
