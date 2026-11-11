# Designer agent + MCP geliştirme rehberi

> Bu teslim branch’inde test runner yoktur; kurum adapterının gerçek browser/MCP kabulü [checklist](component-adapter-checklist.md) üzerinden yapılır.

Bu rehber kayıtlı adapterları tüketerek ekran tasarlayan/kodlayan agent içindir. **Yeni UI library adapterı yazmak** için [adapter onboarding](adapter-onboarding.md); tüm kaynaklar için [belge haritası](README.md).

## Amaç ve sınırlar

IDE agent'ına verilen screenshot veya mevcut UI Designer belgesi, seçili UI kütüphanesinin
**varsayılan olarak temasını koruyarak** semantik bileşen ağacına dönüştürülür. Görseli yorumlayan IDE modelidir.
MCP model çalıştırmaz; rehberleri, gerçek component registry'sini, mevcut JSON parser'ını ve
mimari generator scriptini sunar. Ekran yerleşimini/CSS'i/state'i agent uygular.

Bu sürüm:
- VS Code `Designer.agent.md` başlangıç talimatı ve model ayarı alanı;
- sürümlü, revizyon kontrollü ve ihtiyaç halinde okunan Markdown rehberleri;
- kurum adapterı etkinleştirildikten sonra tarayıcı açık olmadan o adapterın katalog ve doğrulaması;
- canonical nested/flat JSON ve flow manifest doğrulama;
- hedef projede çalıştırılmak üzere indirilebilir, bağımlılıksız mimari scaffold;
- mevcut editör belgesini clientId ile kayıpsız okuma.

**Editörde gösterme opsiyoneldir: MCP `import_design` yeni ekranları ekler veya Dosya → JSON içe aktar kullanılabilir.**
Referans görseller Designer'a bırakılıp MCP image içeriği olarak okunabilir. render_design_frame yapılandırıldığında izole ilk-durum PNG/DOM geri bildirimi sağlar; canlı kullanıcı sekmesini yakalamaz. Mevcut node düzenlemesi update_design ile yapılır.
Hedef React uygulamasını otomatik tamamlayan bir runtime yoktur; agent bu işi rehberlerle yapar.
Örnek mimari profil henüz kurum standardı onayı değildir. Placeholder bölümleri aşağıda belirtilmiştir.

## Kurulum — HTTP MCP

Lokal geliştirme ve kurum dağıtımı aynı [HTTP MCP + WebSocket sözleşmesini](backend-mcp.md) kullanır. IDE merkezi `/mcp` URL’ine bağlanır; kullanıcı bilgisayarında MCP process’i başlatmaz.

1. Paket/CLI/env/adapter eşlemesini tamamlayıp Designer’da `npm run dev` çalıştırın. WS anahtarı lokal MCP için `ws://127.0.0.1:4854/ws` olmalıdır. Bağımsız MCP reposunda `npm ci && npm run build && npm start` sunucuyu açar. Kurumda [kurulum](../installation/README.md) adımlarını uygulayın; deployment sürecini ekibin mevcut projelerine göre hazırlayın.
2. `../mcp/designer/templates/Designer.agent.md` dosyasını hedef projenin `.github/agents/Designer.agent.md` yoluna kopyalayın. HTTP istemci şablonunu mevcut IDE config’ine birleştirip `/mcp` URL’ini ayarlayın; mevcut server kayıtlarını ezmeyin.
3. Designer’da **Gelişmiş → MCP bağlantısı** altından bağlantı kimliğini alın. Her canlı tool çağrısında `clientId` olarak geçirin; URL/env/log içine koymayın. Yazmadan önce `get_editor_context` ile `designId`, `editorId`, içerik `version` değerlerini okuyun.
4. Katalog → validate → import → `applied` + `isPersisted=true` → get_design readback kabulünü yapın. Gerçek IDE/model kabulü otomatik transport testlerinden ayrıdır.

Agent Host için `mcp.copilot.example.json`, VS Code için `mcp.vscode.example.json` HTTP şablonlarını kullanın. Repo `.vscode/mcp.json` kaydı da HTTP’dir. Designer agent seçiliyken model picker kullanılır; sabit model gerekiyorsa frontmatter’daki yorum satırına hesabınızdaki modelin tam adını yazın.

Aynı browser profili/origin içinde ilk sekme düzenleme sahibidir. İkinci sekme store, autosave veya WebSocket başlatmaz; ilk sekme kapanınca **Yeniden dene** ile devam edilir. Önizleme/render sekmeleri ayrı kalır. Web Locks için localhost veya HTTPS gerekir. Farklı profiller ayrı clientId ile aynı merkezi sunucuya bağlanır; otomatik hedef seçimi yoktur.

Bağlantı göstergesi browser’ın backend’e bağlı olduğunu gösterir; IDE agent’ının bağlı olduğunu kanıtlamaz. Backend kapalıyken elle tasarım/export çalışır. Tam belgeler browser IndexedDB’de kalır; sunucuda snapshot cache’i yoktur.

Örnekler: “Üç adımlı başvuru formu tasarla ve editöre ekle.” → “Seçili input'un etiketini İş e-postası yap.” → “Seçili butonların ebeveynindeki boşluğu 16'dan 32'ye çıkar.” → “Seçili görselleri soldan sağa yorumla ve mevcut kütüphaneyle yanlarına ekranlar oluştur.” Belirsiz iş kuralı veya hedef varsa agent rehbere göre sorar.

## Araçlar ve bağlam bütçesi

| Araç | Girdi / sonuç |
| --- | --- |
| `start_design_task` | goal design/react, mode basic/detailed, phase understand/implement, source auto/editor/image/prompt, patterns, expectedVersion → kısa rehber indeksi + sıralı adımlar + revision |
| `read_design_guide` | id + bundleRevision → yalnız ilgili MD; revizyon değişmişse hata |
| `get_design_catalog` | parametresiz kütüphaneler; adapterId ile özet; componentTypes ile seçili detaylar |
| `validate_design` | document + output summary/nested/flat → mevcut parser ve manifest, registry ve tema kontrolü |
| `get_designer_asset` | id + bundleRevision → dosya içeriği, SHA-256, sürüm, önerilen kayıt yolu |
| `get_editor_context` | clientId + designId?/editorId? → güncel seçili node/parent/sibling, breakpoint, sıralı referanslar ve hedef editör |
| `update_design` | clientId + designId + editorId + requestId + expectedVersion + node patch listesi → mevcut öğede tek undo ve browser ACK |
| `get_design` | clientId + section document → kanonik belge + designId/editorId/içerik revision |
| `list_reference_images` | clientId ile açık browser referans metadata listesi; Base64 içermez |
| `get_reference_image` | clientId + referenceId → image/png image içerik; istekle pikseller |
| `import_design` | clientId + designId + editorId + requestId + expectedVersion + document + referenceIds → append isteği; kullanıcı editörde oluşturmayı istemeli |
| `get_design_import` | clientId + requestId → applied/isPersisted veya unknown; yeni frame ID’leri |

`list_components` mevcut tasarımın node'larını listeler; katalog değildir. Eski get_design/behaviors/component
araçları korunur. Canonical document sayfa notlarını, annotation'ları, savedDesigns ve tüm node bağlarını içerir.
Canlı okuma için hedef browser açık ve bağlı olmalıdır.

Guide'lar ayrıca `designer://guides/<id>` MCP resource olarak keşfedilebilir. `design_from_image` MCP prompt'u
isteğe bağlı kısa başlangıçtır. Otomatik iş sırası agent dosyasında ve start aracındadır; prompt çağrısı zorunlu değil.
Discovery tam rehberleri dökmez. Token sayısı `length / 4` yaklaşımıdır, tokenizer ölçümü değildir.
`import_design` yeni ekran ekler; `update_design` mevcut node'ları değiştirir. İkisi de sürüm ve tarayıcı ACK kontrolü kullanır. Generator metnini almak onu çalıştırmaz.
Görsel aktarımı/ekleme ayrıntıları reference-images rehberinde (MCP reposunda `designer/guides/reference-images.md`).
Agent bootstrap sürümünü güncel manifest ile eşleyin (18 Ekim 2026: 1.9.0); eski agent dosyası sürüm uyuşmazlığı verirse yeniden indirin.

## Yazım ve karar stratejisi

- Sade CSS ve iç içe Flex önceliklidir. Gerekli Box grupları, gap/padding ve doğal boyutlandırma kullanılır; calc() veya Grid varsayılan çözüm değildir.
- Görselden üretimde belirtilmemiş tema için mevcut library teması kullanılır; yalnız bu tercih için soru sorulmaz. Kullanıcı görsele yaklaşmayı isterse desteklenen tokenlar kullanılır; keyfi JSON style/tema alanı açılmaz. Katalog sınırı ve hedef React tema API'si doğrulanır; eksik destek açıklanır.
- Ölçek için bilinen viewport veya modal/kart ölçüsü istenir. Resim pikseli CSS pikseli sanılmaz; DPR/zoom/kırpma dikkate alınır. Ölçü bilinmiyorsa varsayım açıkça belirtilir.
- Domain/ad/generator parametreleri kanıttan çıkarılır; belirsiz zorunlu bilgi sorulur. Güven yüzdeleri kalibre edilmiş ölçüm değil çalışma ilkesidir; endpoint ve iş kuralları görselden uydurulmaz.
- React işinde standards/i18n/api-mocks koddan önce; unit-tests ve quality-checks implementasyondan sonra okunur. JSON-only işte hedef proje çeviri ifadeleri veya generator parametreleri gereksiz yere istenmez.

## Referans saklama ve yazma sınırı

Görsel kaynakları editor JSON'undan ayrı IndexedDB ikili PNG (ArrayBuffer) kayıtlarıdır; gösterim/aktarımda Blob oluşturulur. WebKit'in Blob saklama hatası böylece aşılır. PNG/JPG/WebP giriş decode edilir;
24 MP ve 10 MB sınırı, 4096px uzun kenar, normalize PNG ile metadata temizliği; en fazla 8 referans.
Görsel istek anında browser’dan WebSocket ile okunur; backend görsel veya belge cache’i tutmaz. Referanslar yeni akışlar arasında kalır ve açık kaldırma işlemiyle silinir. JSON export/import referans dosyalarını taşımaz. MCP okuma sırası get_editor_context.selectedReferences içindedir; wizard varsayımı yapmaz.

Import aktif adapter’la doğrulanır; savedDesigns kabul edilmez, mevcut sayfa metadata’sı değişmez. Browser designId/editorId/expectedVersion kontrolünden sonra eklemeyi tek undo adımında yapar ve ID/iç referansları yeniden eşler. Başarı `applied` + `isPersisted=true` ile doğrulanır. Ağ hatası uygulanmadığı anlamına gelmez: aynı requestId receipt’i ve güncel belge okunur. Boyut, timeout, receipt ve erişim sınırları [merkezi sözleşmededir](backend-mcp.md#ws-protokolü-ve-sınırlar).

## Ekip hangi dosyaları dolduracak?

| Dosya (`../mcp/designer/guides/`) | Sorumluluk |
| --- | --- |
| `workflow.md` | Agent'ın çalışma sırası, belirsizlik yönetimi, doğrulama ve teslim |
| `reference-images.md` | Yüklenen görseli okuma, session, yeni ekran ekleme, retry ve tarayıcı ACK |
| `semantic-design.md` | Görseli anlamlandırma, native bileşen ve tema kullanımı |
| `architecture.md` | Klasör/dosya/import/BEM, provider ve ortak UI yolları |
| `standards.md` | Kod yazım kuralları, isimlendirme, React/TypeScript/CSS, hook ve sorumluluk ayrımı |
| `i18n.md` | react-i18next, namespace/dosya ve translation anahtarı adlandırması |
| `quality-checks.md` | Kod tamamlandıktan sonra mevcut lint/ESLint, tip/test/build ve kalite kontrolleri |
| `api-mocks.md` | RTK Query base API, URL, dev-only interceptor ve fixture şeması |
| `unit-tests.md` | Test runner/helper, konum, mock ve coverage; implementasyondan sonra okunur |
| `forms.md` | Form provider, alan ve validation kuralları |
| `wizard.md` | Adım/context, veri ömrü, modal/OTP ve geri dönüş |
| `data-display.md` | Tablo/list, slot, pagination ve load more |
| `filtering.md` | Filtre/query/reset/debounce |
| `dashboard.md` | KPI/grafik/veri yerleşimi |
| `contract.md` | Mevcut JSON formatı için kısa giriş |

`execution-contract` var olan `docs/contracts/README.md` dosyasını okur; kopya kontrat tutulmaz.
Rehber seçimi bir strateji sınıfı hiyerarşisi değildir: manifestteki `when` etiketleri yeterlidir.
Wizard form+behavior'ı, filtering data-display'i de ister. Kod üretiminde mimari/standards/api-mocks
zorunlu; unit-tests `laterGuides` altında gelir. Yeni örüntü fark edilince start tekrar çağrılır.
`needs-project-input` gerekli yerlerde ekip bilgisinin eksik olabileceğini bildirir. Dosyayı doldurup
inceledikten sonra manifest durumunu `ready` yapın. Agent eksik bilgiyi projeden kanıtlar veya sorar.

## Sürümleme ve ayrı profil

`manifest.json` sürümü + bütün rehber/asset SHA-256 değerleri tek bundleRevision oluşturur.
Aynı sürüm numarasıyla MD değişse bile revizyon değişir; eski read/asset isteği reddedilir.
Anlamlı profil değişimlerinde manifest.version ve Designer.agent.md expectedVersion birlikte güncellenir.

Başka kurum profili için `../mcp/designer` klasörünü kopyala; execution-contract dosyasını da profilin
`guides/execution-contract.md` yoluna kopyalayıp manifestte file alanını bu yerel yola değiştir.
MCP env `DESIGNER_PROFILE_DIR=/absolute/profile` ile bu profili seçer. Profil manifest'i server sahibi
konfigürasyonudur; tool girdisinden keyfi dosya yolu kabul edilmez. Yeni resource listesi için restart gerekir.
Bu bir sandbox veya model itaat garantisi değildir; kod inceleme ve proje kalite kapıları yine gereklidir.

## Generator

`get_designer_asset(id:"scaffold")` ve `scaffold-config` ile dosyaları al. İçeriği yeniden yazmadan kaydet,
SHA-256'yı kendi ortamında doğrula. Örnek:

```bash
node .designer/scaffold.mjs --config .designer/scaffold.json --root /target/project
node .designer/scaffold.mjs --config .designer/scaffold.json --root /target/project --write
```

İlk komut sadece plan ve tam dosya içeriklerini gösterir; ikinci uygular. Mevcut dosya çakışması, geçersiz
isim veya symlink parent varsa durur. Yazma sırasında hata olursa yalnız bu işlemde yazdığı dosyaları geri alır.
Yarattığı boş klasörler hata sonrası kalabilir. Eşzamanlı başka process'in filesystem değiştirmesine karşı
OS sandbox garantisi değildir. Root açıkça verilir; mevcut root symlink'i realpath ile çözülür.

Zorunlu config: version, componentName, pageName (`Page` son eki), primitiveName, primitiveImport.
Opsiyonel styleFile: styles.module.scss veya style.module.scss. Scaffold named-export primitive kullanır;
hedef projede Box/className desteğini agent doğrular. Üretilen UI placeholder'ıdır, bitmiş ekran değildir.

Opsiyonel `api`:
```json
{
  "name": "transfer-api",
  "baseApiImport": "@apis/base",
  "baseApiName": "baseApi",
  "endpointName": "submitTransfer",
  "method": "POST",
  "url": "/transfers"
}
```

Yollar/veriler sadece örnektir. Bunlar gerçek projeden doğrulanınca API index.ts/types.ts ve boş mock JSON
üretilir. GET query / POST mutation iskeleti mevcut baseApi.injectEndpoints kullanır. URL başlangıçta
API index'indedir. Response/request unknown bilinçli tamamlanacak noktadır. Boş fixture gerçek mock değildir;
interceptor URL eşlemesi, store/router bağları ve servis tipleri agent tarafından rehbere göre tamamlanır.
Test dosyaları iskelet aşamasında üretilmez. Mevcut API/domain dosyası varsa generator'ı o alan için kullanma;
agent mevcut dosyayı proje kurallarıyla düzenlesin. Ortak yapı dosyalarını generator otomatik değiştirmez.

## Doğrulama ve kapsam

Bu teslimde test runner yoktur. [Kurulumun son adımında](../installation/README.md#adim-2) gerçek kurum adapterı, browser ve MCP okuma/yazma kabulü yapılır. Referans kullanılacaksa görsel yükleme/okuma ve üretilen ekranın JSON readback’i ayrıca doğrulanır. Build başarısı seçilen modelin görsel yorumunu veya hedef uygulama kodunun doğruluğunu kanıtlamaz.

## Resmî kaynaklar

- [VS Code custom agents: frontmatter, model, tools](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [VS Code MCP: bağlantı, resources ve prompts](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [MCP server kavramları: tools/resources/prompts](https://modelcontextprotocol.io/docs/learn/server-concepts)

Bu yapı `.agent.md` dosyasını destekleyen VS Code harness'leri içindir; diğer IDE eklentileri aynı
frontmatter'ı otomatik uyguluyor varsayılmaz. Öncelikle tek Designer rolü vardır; alt agent kurgusu zorunlu değildir.

## Prompt ve mevcut node düzenleme

Görsel zorunlu değil. prompt-authoring (MCP reposunda `designer/guides/prompt-authoring.md`) kapsam soruları, aktif adapter, yeni frame üretimi ve node ID hedefli update_design sözleşmesini açıklar. update_design için get_design cevabındaki editorId ve version kullanılır; get_design_import applied ACK beklenir. Nesneler merge, null silme, diziler değiştirme anlamındadır. Tek undo ve mevcut ID'ler korunur.

## Editor selection contract (1.4.0)

Use get_editor_context({clientId}), wait for ready=true, then get_design({clientId,section:"document",designId,editorId}). selectedNodes includes parent, siblings, path, frame and effective layout at the active breakpoint. selectedReferences is in canvas reading order; list_reference_images returns live browser metadata. Pass clientId on every live call and retain designId/editorId/version for writes. Context is semantic; no rendered screenshot is supplied.

## Frame render geri bildirimi (1.5.0)

`render_design_frame` editorId/version/frameId ve açık viewport ile izole ilk-durum Chromium önizlemesi üretir; PNG ve DOM ölçülerini döndürür. Canlı kullanıcı sekmesi, input değerleri veya history kopyalanmaz. Araç kontratı ve düzeltme döngüsü (MCP reposunda `designer/guides/render-feedback.md`).

VS Code örnek ayarlarında `DESIGNER_RENDER_URL=http://127.0.0.1:5173` bulunur. Yerel uygulamayı bu adreste açın veya gerçek yerel portu yazın; sonra MCP sürecini yeniden başlatın. Mevcut repository Playwright/Chromium kurulumu kullanılır. Dev bağımlılıkları veya Chromium bulunmayan dağıtımlarda render kullanılamaz; diğer MCP araçları çalışmaya devam eder. Araç otomatik kurulum yapmaz. Bu sürüm uzak/hosted Designer render’ını desteklemez. Agent şablonunu güncel manifest sürümüyle eşleyin.

Adres yalnız localhost/127.0.0.1 HTTP; kimlik bilgisi, query/hash kabul edilmez. Capture içinde ayrı browser context, same-origin GET ve service-worker engeli uygulanır. En fazla 2048×2048 viewport, 8 MiB PNG ve 500 node ölçüsü; scroll başlangıcındaki görüntü tam sayfa değildir. Hata/timeout sonrası browser kapanır, dosya arşivi oluşmaz. Görsel benzerlik değerlendirmesi IDE modeline aittir.

## Ekran anlama ve şablon tamamlama kontratı (1.9.0)

Kurum mimarisini kullanıcı doldurur. screen-understanding ekran/domain/spacing okumasını, data-inference alan/veri/fixture içeriğini, template-completion üretilmiş iskeletin tamamlanmasını öğretir. Bunlar form/wizard/API kurum örneklerinin yerine geçmez.

start_design_task salt okunurdur; yeni isteğe bağlı alanlar:

| Alan | Anlam / varsayılan |
| --- | --- |
| mode | basic UI ve stratejiye dayalı yapısal form/wizard; detailed ayrıca teyit edilmiş domain/handler/API. Varsayılan yok; seçilmediyse kullanıcıya sorulur. |
| phase | understand kısa yorumlama keşfi; implement uygulama rehberleri. İstek varsayılanı implement; mode yoksa etkin phase understand olur. |
| source | auto koşullu editör ihtiyacı; editor Designer belgesi/seçimi/referansı; image IDE görseli; prompt IDE metni. Varsayılan auto. |
| patterns | Modelin gözlediği örüntüler. Wizard forms+behavior; filtering data-display açar. reference-images Designer'a yüklenmiş görsel demektir, IDE görseli değildir. |

Cevap etkin phase, requestedPhase, mode (seçilmediyse null), requiresModeSelection, questionPolicy, screenScope, source, patternOptions ve editorContext politikasını döndürür. Mode verilmeden implement istense bile yalnız anlama rehberleri döner; mod seçimi server belleğinde saklanmaz, agent sonraki çağrıda taşır. editor veya reference-images ready context gerektirir; image/prompt yalnız editöre çıktı istenirse session gerektirir. auto talebe göre ayrılır. Araç editör durumunu veya görsel pikselleri kendi başına analiz etmez.

understand requiredGuides workflow + screen-understanding + authoring-modes (ve istenmişse reference-images) içerir. Basic implement React architecture/standards/i18n/template-completion ve görsel authoring rehberlerini alır; api-mocks/data-inference/filtering zorunlu listesine girmez. form örüntüsü forms; wizard örüntüsü iki modda da forms + wizard + execution-contract açar. Böylece provider/context/stepper, ileri/geri ve ortak form state stratejisi Basic tarafından da okunur. Basic'te filtering örüntüsü sonuç görünümü için data-display açar; native Tabs/collapse/input kullanımı domain davranışı sayılmaz. Detailed implement React execution-contract, data-inference ve api-mocks'ı ekler; ilgili pattern rehberleri form/wizard/filtre kurallarını tamamlar. unit-tests/quality-checks implement aşamasında laterGuides içindedir.

Kaynak CSS viewport veya aynı düzlemde kart/modal referans genişliği iki modda da bilinmiyorsa yaklaşık ölçü bir kez sorulur; screenshot piksel genişliği veya mobile görünümünden tahmin yeterli değildir. Kullanıcı ölçüyü bilmiyorsa açık yaklaşık referans yoluna geçilir. Basic ortak soru bütçesi en fazla 3. Detailed ortak sorular dahil genellikle 5 civarı, toplam en fazla 10; soru sayısını doldurmak için gereksiz sorulmaz ve her turda kota sıfırlanmaz. questionPolicy bu bütçeyi taşır; MCP konuşmayı otomatik saymaz, agent görev özetinde takip eder.

```json
{"goal":"react","phase":"understand","source":"image","expectedVersion":"1.9.0"}
```

Mode zaten biliniyorsa ilk çağrıda ekle; bilinmiyorsa kullanıcı seçimini bekle. Sonra örneğin `mode: "detailed"`, `patterns: ["wizard", "data-display"]`, aynı source/goal ve `phase: "implement"`. Bootstrap/manifest 1.9.0; eski expectedVersion açık mismatch alır. Mode alanını hiç vermeyen istemciler artık implement rehberleri yerine seçim bekleyen anlama cevabı alır; bu kasıtlı kapsam korumasıdır. Bundle revision değişirse rehberleri yeniden keşfet.

Basic yeni iş kuralı/bağımlı alan/iş handlerı/API üretmez; tanımlı form/wizard altyapısı ve yapısal ileri/geri handlerlarını kurar. Mevcut Designer kaydındaki açık ilişkileri silmez; Basic React'te domain davranışı uygulanmadığını bildirir. Detailed cevap/proje kanıtıyla kuralları uygular, eksik backend bilgisini uydurmaz. Yetkili mod/soru rehberi (MCP reposunda `designer/guides/authoring-modes.md`).

screenScope bir agent çalışma politikasıdır; filtrelenmiş veri veya yeni belge alanı değildir. default=all-current-document-frames-or-supplied-images; explicitSelection=requested-screens-only; documentRead=full-document-not-filtered-package; selectedElementEdit=requested-element-only; grouping=explicit-relations-then-visual-evidence-and-project-strategy. Ekran üretiminde açık istek/seçim yoksa güncel belgenin tüm frame'leri incelenir. Açık seçim varsa selectedNodes.frameId ile kapsam çözülür; sıradan input seçimi genel görevi daraltmaz. get_design tam belgeyi döndürmeye devam eder. Bağımlılıkları kapalı seçili ekran paketi henüz yok; seçim dışı hedefler bildirilir. Seçili öğe düzenleme görevi ekran üretimine genişletilmez.

Agent JSON + mevcut görselleri birlikte okur. Açık formStep/stateChange/overlay ilişkileri önceliklidir; bağ eksikse tutarlı adım numaraları, amaç ve kurum stratejisiyle wizard planı çıkarılır. Modal/state varyantı yeni step değildir. Birlikte teslim/canvas sırası ilişki kanıtı sayılmaz; kritik belirsizlik ortak soru bütçesinde sorulur. Çıkarılan React planı kaynak JSON'u otomatik değiştirmez ve mevcut açık ilişkilere üstün gelmez. 1.8.0'daki Basic form/wizard dışlaması 1.9.0'da bu kapsamla düzeltilmiştir.

Scaffold dönüşündeki completionChecklist her üretilen dosyanın pending tamamlama görevini bildirir: file, status, kind, instruction. Dosya planı/generator config v1.0.0 değişmedi; metadata eklenmiştir. Bu liste statik görev listesidir, kodu otomatik inceleyip tamamlandı işaretlemez. DESIGNER_PLACEHOLDER yorumları ve boş fixture tamamlanmalı veya engel açıklanmalıdır. Yeni dummy hook/util/provider template'i bu sürümde eklenmedi; kullanıcı örnekleri geldiğinde aynı tamamlama süreci uygulanır.

Ekran özeti/veri planı, MCP phase/source ve completionChecklist Designer belgesinin alanları değildir. Nested/flat JSON, varsayılan değerler ve preview anlamı değişmedi. authoringContract.guideIds yeni rehberleri keşfedilebilir kılar. Gerçek model kalite/maliyet kabulü için senaryolar (geliştirme reposundaki kaynak) ayrı tutulur; protokol testi görsel anlama başarısı değildir.

### Uzun rehberlerde bölüm okuma

read_design_guide varsayılan mode=content ile eski tam içerik cevabını korur. mode=outline yalnız üst düzey (##) başlıkları, sectionId ve yaklaşık token boyutunu verir; kod bloklarındaki başlıklar sayılmaz. sectionId ile content isteği yalnız ilgili bölümü döndürür. Aynı bundleRevision zorunludur; bilinmeyen bölüm veya outline+sectionId hata verir. Bölüm cevabında sha256 dönen bölümün hash'i, fullGuideSha256 tam kaynağın hash'idir. Bölüm kimlikleri revision dışında stabil değildir.

execution-contract özeti readingMode=outline-then-sections bildirir. workflow rehberi zorunlu temel başlıkları ve özellik bazlı okumayı tanımlar. İndeks okumak içerik okuma sayılmaz; belirsiz çapraz bağımlılıkta tam rehber okunur. Kanonik Markdown tek kaynaktır, ayrı elle tutulan özet yoktur. Token tahminleri karakter/4 yaklaşımıdır; gerçek tokenizer veya toplam model tüketimi değildir.

## Bileşen tanıma ve eksik açılan içerik — 18 Ekim takip

Bileşen kimliği ve görünmeyen içeriğin anlamı ayrı tutulur. Kanıt sırası mevcut JSON/katalog, kurumun kısa görsel eşleme brief'i/çalışan örneği, görsel ipucudur. Yan yana ikonlar tek başına ButtonGroup veya tek seçim davranışı kanıtı değildir. screen-understanding içinde ekipçe doldurulacak kimlik, görsel ipucu, karıştırılanlar, anatomy/durum, eksik görünüm politikası ve örnek formatı vardır. CardAction temsili örnektir; yeni component eklenmedi.

Basic kapalı native görünümü korur; eksik popover/menü öğesi/eylem üretmez. Zorunlu içerik için desteklenmeyen boş değer/disabled/noop uydurulmaz; eksik entegrasyon bildirilir. Detailed önce diğer ekran/örneklerde açık hali arar; eksikse içerik/eylem, statik-servis kaynağı ve gerekirse servis kontratını mevcut toplam soru bütçesi içinde öğrenir. Statik menüde servis kullanan eylem bulunması liste query'si gerektirmez. Teyit edilen kapsam için API/hook/UI/mock zinciri profil örneğine göre tamamlanır.

Rehber/authoringContract açıklaması güncellendi; yeni metadata şeması, registry bileşeni veya runtime etkileşim yoktur. MCP giriş/çıkış yapısı ve sürüm 1.9.0 korunur; bundleRevision içerikle değişir. JSON/nested-flat/preview anlamı değişmedi. Protokol doğrulaması gerçek modelin görsel tanıma veya soru kalitesini kanıtlamaz.

## 18 Ekim takip — kullanım bilgisinin ana kaynağı adapter/MCP

Kullanıcı özel UI library componentlerinin adapterlarını ve desteklenen propslarını tanımlayacak. Teknik kullanımın ana kaynağı get_design_catalog componentTypes detayındaki adapter kontratıdır; ayrı görsel brief zorunlu değildir ve API kullanımını çoğaltmaz. Brief yalnız görsel ipucunu kayıtlı component kimliğine bağlar. Renderer yorumları/kod içi açıklamalar otomatik MCP aktarımı sayılmaz; gerekli açıklama metadata veya yetkili component rehberinde erişilebilir olmalıdır. Prop API'si bilinse bile ekranın eksik menü içeriği ayrı gereksinimdir. Basic/Detailed sınırı korunur. Yetersiz bilgi fallback'i kullanıcının isteğiyle sonraki görüşmeye bırakıldı; yeni alan veya fallback implementasyonu eklenmedi.


## Kontrat önce, seçici strateji sonra — 20 Ekim 2026

Tercih edilen yol `get_design_contract` aracıdır; HTTP backend statik kontratı sunar. Açık browser veya clientId gerekmez. Aktif adapter kimliği mevcut belgeden/context'ten öğrenilir; dış görselde bilinmiyorsa `get_design_catalog` library listesi kullanılır. Kimlik tahmin edilmez. Bu ek araç nested/flat şemasını değiştirmez; yanıt formatı `ui-designer/contract-v1`, bilgi paketi 1.9.0 ile geriye uyumludur.

1. `get_design_contract({adapterId, phase: "overview"})`: güncel şema, ortak authoringContract (layout/varsayılan/öncelik), alan sözlüğünün belge ve node temeli, tüm component **özetleri**, guide/strateji özeti ve bölüm indeksi. Strateji içerikleri ve bütün component prop detayları bu çağrıda yüklenmez.
2. Agent amacı, ekran kapsamını ve ölçek referansını belirler. Bilinen CSS viewport **veya aynı görsel düzlemindeki kart/modal genişliği** yeterlidir. İkisi de bilinmiyorsa bir kez yaklaşık ölçüyü sorar; kullanıcı bilmiyorsa açık yaklaşık referansla ilerler. Örneğin 600 görüntü pikseli genişliğindeki modal yaklaşık 480 CSS px ise 30 görüntü pikseli boşluk yaklaşık 24 CSS px'tir. Kırpma/DPR/zoom nedeniyle dosya pikseli viewport değildir. Ölçü, doğal row/column, gap/padding, fill/auto ve native boyut seçeneklerine çevrilir; mutlak x/y çizimi yapılmaz. Bilinmeyen/scroll dışı yükseklik uydurulmaz.
3. `get_design_contract({adapterId, phase: "details", contractRevision, componentTypes: ["card", "textInput", "button"], guides: [{id: "forms"}, {id: "layout"}]})`: gerekli bileşen propsSchema/defaultProps/defaultStyle/acceptedPropKeys/slots/previewValue/native export bilgisi ve seçilen rehberler **tek çağrıda**. Uzun rehberde `sectionIds: ["section-N"]` yalnız aynı overview indeksinden seçilir. Form/dashboard birlikte seçilebilir. Aynı revizyonda okunan çekirdek tekrar verilmez. Yeni ihtiyaçta yalnız yeni component/rehber bölümleri istenir. Tüm library detayları gerçekten gerekiyorsa `allComponents: true`; componentTypes ile birlikte kullanılamaz.
4. Agent JSON'u doğrudan kurar, `validate_design` ile parser/registry/flow doğrulaması yapar. React yönünde aynı alan sözlüğünün ilgili state/event/flow/responsive/flat bölümleri ve `react-generation` + gerçek kurum stratejisi okunur. Custom export renderer/compound yapılar düz JSX prop spread değildir; callback kaynakları JSON içinde fonksiyon olarak taşınmaz. Bilgi eksikse API tahmin edilmez.

İki çağrı **kontrat öğrenme yolu** içindir; kimlik, referans görsel, validation, import/update veya gerekli yeni strateji çağrıları bu sayıya dahil değildir. Bu bir token/maliyet ya da model başarı garantisi değildir. `contractRevision` gerçek adapter kataloğu ve bundle içeriğinin hash'idir; details yanlış/eski revision'ı reddeder. bundleRevision mevcut read_design_guide için de geçerlidir. Yeni süreç/deploy/adapter veya profil değişiminde overview yenilenir; eski bilgi sessizce kullanılmaz.

### Tekrarlanabilir JSON üretim adımları

Overview içindeki `catalog.authoringContract.jsonGeneration.steps`, keşif/hiyerarşi/layout/
validation/uygulama adımlarını `completeWhen` koşullarıyla verir. `styleResolution.sizingRules`
alanı boyut niyetini, parent'a bağlı dönüşümleri, öncelikleri ve çalıştırılan örnekleri içerir.
Örneklerin `parentStyle` alanı gerçek parent node'un `style` alanına uygulanır; bu metadata
tasarım JSON'una yeni alan olarak eklenmez. Component recipe native bileşim için kullanılır;
ortak layout anlamının sahibi [fill sözleşmesidir](fill-layout.md#agent-için-çözüm-sırası-ve-hizalama).

Bu ek metadata contractRevision hash'ine girer; eski details paketini kullanan agent overview'u
yeniler. Şema, parser ve render davranışı değişmez. validate_design yapısal kabulü, applied/persisted
receipt uygulama ve kayıt sonucunu, get_design hedef değerleri doğrular. Bunların hiçbiri tek başına
görsel doğruluğu veya LLM'nin her çalışmada aynı çıktıyı vereceğini kanıtlamaz.

### Ekip stratejisi ekleme

Mevcut profilin `manifest.json` → `guides` listesine `id`, `title`, kısa `summary`, `when`, `status`, `file` girilir; strateji Markdown'ı aynı profil altında tutulur. Örneğin `id: "account-form"`, `when: "account-form"`, summary: "Hesap açılışı formunda kurum provider ve alan grupları". Yeni when değeri için tool koduna pattern eklemek gerekmez: overview bütün kayıtların kısa indeksini verir, agent ekran bağlamına göre ID seçer. `DESIGNER_PROFILE_DIR` mevcut özel profil yoludur; manifest tam profildir, gizli merge/overlay yapılmaz. `needs-project-input` sahibi tarafından doldurulmamış kuralları açık tutar; agent bunu hazır implementasyon standardı saymaz. Eksik provider/import/API kuralları uydurulmaz. Strateji değişince revision değişir.

### Görsel kontrol kullanıcı isteğine bağlıdır

Varsayılan `visualReview.default = none`: verilen görsel analiz edilir, ancak üretilen UI için otomatik screenshot/render/benzerlik döngüsü başlatılmaz. Kullanıcı "ekran benzeyene kadar düzelt" gibi açık istek verirse render-feedback ve render_design_frame kullanılır. JSON doğrulama ve persistence ACK görsel eşleşme kanıtı değildir. Bu kural araç açıklaması/agent/rehber politikasıdır; sunucunun kullanıcının gerçek onayını doğruladığı bir erişim kapısı değildir. Kullanıcının izin verdiği görsel inceleme, revision/ACK/tek undo ve mevcut tasarımı koruma kurallarını kaldırmaz.


### Bileşene bağlı kullanım tarifleri (recipes)

`ComponentMeta` içinde opsiyonel `description`, `visualHints`, `recipes` bulunur. Recipe bir tasarım stratejisinden daha dar kapsamlıdır: "bu component'in bu görünümü hangi props/slot/children yapısıyla elde edilir?" sorusunu yanıtlar. Recipe adapter'ın yanında tutulur, ayrı global tarif listesinden aranmaz. Overview component başına type, ad, kısa açıklama, kısa visualHints, kategori ve container bilgisini döndürür; recipeIndex, recipes veya görsel metadata yüklemez. Agent kullanacağı veya seçiminden emin olmadığı adayların detaylarını ister. Details seçilen component'in visualHints ve props bilgisiyle birlikte **bütün kendi recipes kayıtlarını** verir; başka component'lerin tariflerini getirmez. Tarif, metadata'nın parçası olduğundan contractRevision'a dahildir. Açıklama girilmemişse description=null; bulunmayan tarif varmış gibi oluşturulmaz.

`visualHints` bileşeni görünüşünden tanımak içindir; birkaç kısa, ayırt edici ipucu yazın. Örneğin ButtonGroup: “Bitişik butonlar; aralarda tek ayırıcı çizgi; yuvarlatma yalnız grubun dış köşelerinde; seçili öğe farklı görünebilir.” Bu, görselden aday seçme ipucudur; tek başına kesin bileşen kimliği veya seçim davranışı kanıtı değildir. Hint içine props dökümü, örnek JSON, uzun recipe veya tüm varyant listesini taşımayın. `recipes` ise bu görünümün gerçek native API ile nasıl kurulacağını detayda açıklar.

Tarif alanları: `id` (component içinde tekil), `title`, `when` (görsel/use-case ipucu), `instructions` (doğru prop/slot/compound eşlemesi), isteğe bağlı `avoid` (karıştırılan yanlış kullanım), `example` (aynı component type'ına ait, kendi alt ağacını içeren geçerli DesignNode). Örnek ID'leri gerçek tasarıma eklenirken yenilenir; tarif doğrudan aynı ID'lerle tekrar tekrar import edilmez. Runtime kayıtlı prop/slot sınırı recipe için de denetlenir; tarif yeni prop açmaz. Semantik doğruluk, native render ve kurum tercihinin gerçekliği adapter kabul testleriyle ayrıca doğrulanır.

Örneğin "label ve silik description input'un kendi alanlarıdır" tarifi onları ayrı Typography kardeşleri olarak çizdirmemelidir. "Select yanındaki yeni hesap aksiyonu action slotuna aittir" tarifi ise kurum adapter'ındaki **gerçek slot adını** ve slots altındaki button ağacını göstermelidir. ReactNode/JSX/fonksiyon JSON props'a konmaz: adapter kayıtlı slot ağacını native ReactNode prop'una dönüştürür. O slot renderer/export/registry'de yoksa recipe yazarak destek varmış gibi davranılmaz; eksik adapter yeteneği açık belirtilir. String label, zengin label slotu ve kardeş içerik birbirinin yerine sessizce geçirilmez.

Card header için de aynı sınır vardır: ayrı compound header ya da header slotu varsa tarif onu kullanır; yoksa Card.Header adı uydurulmaz. Projedeki Mantine textInput label-description ve card title-in-content tarifleri mevcut yetenekleri gösterir; kurum Select aksiyon slotu veya yeni Card.Header bu görevde eklenmedi.

Toplu istem örneği: `get_design_contract({adapterId, phase: "details", contractRevision, componentTypes: ["select", "card"], guides: [{id: "forms"}]})`. Sunucu component metadata'sını adapter registry'den, stratejiyi profil Markdown'ından okuyup **tek MCP yanıtında** birleştirir. İstemci ayrı ayrı alt tool çağrısı yapmaz. Tarifler görsel tanımaya yardım eder; renk/yakınlık tek başına kesin component sahipliği kanıtı değildir.

### Ölçek sorusunda güncel öncelik

Bilgi zaten verilmişse tekrar soru yok. Yoksa önce görüntünün yaklaşık yarısını kaplayan, sınırları belirgin modal/kart/içerik paneli gibi bir bölgenin **yaklaşık CSS genişliği** sorulur; "yarım" zorunlu oran değildir. Bu orta boy referansla daha küçük ve büyük öğeler aynı düzlemde oranlanır. Width height'a tercih edilir; yükseklik ancak güvenilir bilgi varsa kullanılır.

Bölge genişliği bilinmiyorsa kaynak görüntünün alındığı browser viewport genişliği sorulur: aynı pencere/zoom koşulunda `window.innerWidth` veya `document.documentElement.clientWidth`. `body` max-width ile sınırlandırılmış veya taşmış olabilir; otomatik viewport sayılmaz. Yalnız screenshot dosyasından bu browser değeri okunamaz; güncel başka sekmeyi ölçmek eski görüntünün ölçüsü değildir. Kullanıcı inspect yapmak zorunda değildir: verdiği yaklaşık bilgi açık varsayım olarak kullanılabilir. Orijinal sayfa erişimi ayrıca verilirse ölçüm o kaynak sayfa/capture koşulunda yapılır; bu, üretilen tasarımı sürekli screenshot ile sınama anlamına gelmez.


## Recipe referans görselleri
MCP `get_recipe_image` HTTP üzerinden bir text metadata bloğu ve bir native `image` (`image/png`, base64 data) bloğu döndürür. Görsel okuyabilen MCP istemcisi/model gerekir; protokolün görsel taşıması modelin doğru eşleştireceği garantisi değildir.

Akış: `get_design_contract` overview → aday componentTypes ile details → ihtiyaç varsa `get_recipe_image` (adapterId, componentType, recipeId, imageId, contractRevision). Overview görsel sayısı veya recipe indeksi içermez; details recipes.images yalnız id/file/caption/sha256/width/height içerir. Hiçbir katalog yanıtı image byte'larını yüklemez. Aynı recipe’nin birden çok görseli olabilir; her çağrı tek görsel getirir. Referans okumak yeni ekran screenshot'ı üretmez ve kullanıcı istemeden görsel iyileştirme döngüsü açmaz.

Ekip küçük, kırpılmış PNG’yi `src/adapters/<adapterId>/recipes/<componentType>/<recipeId>/screenshots/<dosya>.png` içine koyar ve aynı klasördeki `recipe.ts` dosyasının images listesine ekler. Mevcut component dosyası bu tarifi import ederek isteğe bağlı recipes alanında listeler; component/renderer dosya adları ve dış import yolları değişmez. ID recipe içinde tekil olmalı; dosya yalnız harf/rakam/tire/altçizgi adı ve .png uzantısı kullanır. Maksimum 1 MiB, her eksen en çok 2048 px. Gerçek piksel width/height ve dosyanın SHA256 özeti metadata’ya yazılır; caption tema, durum ve bilinen CSS genişliği/DPR bağlamını açıklar. Recipe example gerçek prop/slot ağacıdır; görsel yalnız onu tanımaya yardım eder. Dosya değişirse hash ve gerekirse ölçü/caption/example birlikte güncellenir, backend yeniden build edilir. Metadata hash'i contractRevision'a dahildir; eski revision reddedilir, bytes/hash uyuşmazlığı görsel döndürmez.

`npm run export:mcp -- /tam/yol/mcp` adapter recipes klasörlerinin PNG dosyalarını (TypeScript kaynaklarını kopyalamadan) `../mcp/dist/recipe-assets/<adapterId>/<componentType>/<recipeId>/screenshots` hiyerarşisine paketler ve önceki asset çıktısını temizler. Deployment normal backend dist ile bu klasörü de taşır; ayrı URL/servis gerekmez. MCP dosya yolu veya URL girişi kabul etmez, yalnız kayıtlı adapter/component/recipe/image kimlikleriyle okur. Gerçek dosya seçilen recipe screenshots sınırının dışında kalırsa, bulunmazsa veya bozulmuşsa hata döner; kullanıcı tasarımı/IndexedDB okunmaz. PNG dışı formatlar bu sürümde desteklenmez; görselleri ekleme arayüzü veya yükleme endpoint'i yoktur.

Örnek: Mantine textInput / label-description / default; gerçek native input screenshot'ı ve aynı recipe propsları. Kurum Select action slotu için gerçek adapter slot tanımı ve recipe gerekir; mevcut örnek böyle bir destek iddia etmez. Image içeriği desteklemeyen istemciler text recipe/example ile çalışmaya devam edebilir. Yeni görsellerde gizli veri yerine örnek metin kullanın.


### Mevcut adapter ile uyumluluk
Recipe eklemek isteğe bağlıdır. Dün yazılmış bir adapter description, visualHints, recipes veya screenshots olmadan mevcut metadata/renderer/provider/export sözleşmesiyle çalışabilir. Yeni zorunlu alan, component taşıma veya renderer yeniden adlandırması yoktur. Bu, görülmemiş bir fork’un tüm core/registry değişikliklerinin kabul edildiği anlamına gelmez; fork birleştirilirken kendi kayıt/provider/dependency farkları korunmalıdır.

Örnek yerleşim: `mantine/textInput.ts` → `./recipes/textInput/label-description/recipe` importu → `recipes: [labelDescriptionRecipe]`; tarifte image.file yalnız PNG dosya adıdır, yol kullanıcıdan alınmaz. Card tarifi ayrı `recipes/card/title-in-content/recipe.ts` dosyasındadır ve görsel eklenmesi zorunlu değildir. Eski, aynı gün oluşturulan ortak kaynak recipe-assets klasörü kaldırılmıştır; onun için ikinci çözümleme yolu yoktur. Backend dist içindeki recipe-assets adı yalnız derleme çıktısıdır.

## Seçili tam ekranları dışa aktarma

`get_editor_context` yanıtındaki `frameExport.eligible` ve tam `frameIds` kümesiyle `export_selected_frames` çağrılır. clientId/designId/editorId ve current expectedVersion ister; format nested veya flat'tir. Component/partial/mixed/stale seçimde hata döner; aktif ekran tam frame seçimi değildir. UI frame başlığındaki düğme/Ctrl seçimiyle aynı motor kullanılır.

Yanıt `{document, scope:{kind:'selected-frames',frameIds,overlayIds,omitted}}` taşır; yalnız document import edilir. Dış aksiyonlar ayıklanır, iç bağlantılar/owned overlays/kullanılan slot şablon bağımlılıkları korunur. get_design tam belgeyi vermeyi sürdürür; işlem read-only'dir. Tam alan, hata ve ayıklama politikası: [yetkili JSON kontratı](contracts/README.md#seçili-tam-ekranları-dışa-aktarma).
