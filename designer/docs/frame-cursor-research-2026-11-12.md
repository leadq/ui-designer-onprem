# Frame başına tek imleç: MCP eşzamanlılığı araştırması

**Tarih:** 12 Kasım 2026. **Durum:** araştırma ve öneri; uygulanmış ürün kararı değildir.

Kullanıcının seçtiği sınır, her tasarım frame'inde aynı anda **en fazla bir animasyonlu imleç** bulunmasıdır. Bu not, resmi MCP ve tarayıcı kaynaklarından doğrulananları uygulama önerilerinden ayırır. Google veya Pen'in iç uygulaması hakkında çıkarım yapmaz.

**Öneri:** Belge değişikliklerinin sırasını ve doğruluğunu mevcut yazma işlemi belirlesin; frame imleçleri yalnız tarayıcıdaki geçici sunumu yönetsin. Farklı frame'lerin görsel oynatımı eşzamanlı olabilir. Bunun için yeni bir LLM servisi veya agent orkestrasyonu önkoşul değildir.

## Birbirinden ayrılması gereken üç davranış

| Davranış | Gerçekte olan | İmlecin anlatabileceği |
| --- | --- | --- |
| Tam JSON alındıktan sonra görsel oynatım | Sonuç zaten gelmiştir; tarayıcı sonucu veya değişen öğeleri sırayla gösterir. | Gelen sonucun görsel sunumu. Canlı model üretimi olarak adlandırılmamalı. |
| Gerçek aşamalı üretim | Üretici tamamladığı anlamlı parçaları ayrı işlemlerle gönderir; her yazma mevcut doğrulama ve sürüm sınırına tabidir. | Gerçekten ulaşan ve kabul edilen parçaların ilerlemesi. |
| Gerçek paralel AI çalışması | Birden çok üretici aynı zaman aralığında çalışır. Bu, istemci/agent yürütme düzeninin özelliğidir. | Yalnız doğrulanmış iş kimliği ve olayları varsa ayrı çalışmalar. Çok sayıda imleç tek başına kanıt değildir. |

Bu tablo bir tasarım ayrımıdır. MCP'nin `tools/call` mesajı ad ve argümanları taşır; araçların nasıl bir kullanıcı etkileşimi veya model yürütme düzeniyle çağrılacağını protokol belirlemez. [MCP tools, 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/tools).

## Protokol: eşzamanlı istek, batch ve belge çakışması

**Doğrulanan olgular:**

- JSON-RPC batch, birkaç istek nesnesinin tek bir JSON dizisi içinde taşınmasıdır. Temel JSON-RPC standardı batch içindeki işlerin herhangi bir sıra ve paralellik genişliğiyle işlenmesine izin verir; atomik belge işlemi tanımlamaz. [JSON-RPC 2.0, Batch](https://www.jsonrpc.org/specification#batch).
- MCP, JSON-RPC batch desteğini `2025-06-18` revizyonunda kaldırdı. Bu nedenle “birden çok çağrı göndermek” ile “HTTP gövdesine istek dizisi koymak” aynı özellik değildir. [Resmi MCP değişiklik kaydı](https://modelcontextprotocol.io/specification/2025-06-18/changelog).
- `2025-11-25` Streamable HTTP'de istemcinin her JSON-RPC mesajı ayrı POST'tur; gövde tek mesajdır. Aynı anda birden çok SSE akışı açık olabilir. Yanıt SSE veya tek JSON nesnesi olabilir. Bu taşıma kuralları uygulama işlemlerinin birbirinden bağımsız olduğunu ya da belgeye paralel uygulanacağını garanti etmez. SSE burada sunucu mesajlarını taşır; araç argümanlarını otomatik olarak parçalı belge üretimine dönüştürmez. [MCP transport sözleşmesi](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).

**Sürüm sınırı:** Bu checkout'un [MCP manifesti](../../mcp/package.json) SDK için `^1.12.1`, [lockfile](../../mcp/package-lock.json) ise `1.29.0` içeriyor. Yereldeki `mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js` içinde en yeni desteklenen protokol `2025-11-25` olarak doğrulandı; liste daha eski revizyonları da içeriyor. Bu yüzden yukarıdaki kurallar açık sürümle verilmiştir. Gerçek bir istemci oturumunun hangi sürümü müzakere ettiği bu araştırmada ölçülmedi; güncel web dokümantasyonu veya SDK numarası bunu tek başına kanıtlamaz.

**Çıkarım:** İki isteğin farklı JSON-RPC `id` değerlerine sahip olması yalnız yanıtların eşleştirilmesini sağlar. Belgenin hangi sürümüne yazdıklarını veya değişikliklerin birleşebilirliğini belirlemez. JSON-RPC kimliğinin tanımlı rolü istek/yanıt korelasyonudur. [JSON-RPC 2.0, Request object](https://www.jsonrpc.org/specification#request_object).

Belge genelinde `expectedVersion` kullanan bir uygulamada örnek: A ve B, sürüm 20'den hazırlanır. A uygulanıp sürümü 21 yapınca B'nin 20 beklentisi eskidir; B farklı frame'e yazsa da belge kapsamındaki kontrol bunu reddeder. İşlerin bir Promise kuyruğunda sıraya alınması bu eski beklentiyi kendiliğinden düzeltmez. Frame başına ayrı yazma kilidi de belge genelindeki sürüm kontrolünün yerine geçmez. Bu sonuç, sürüm denetiminin kapsamından çıkar; MCP taşıma paralelliğinden çözüm beklenmemelidir.

## Progress neyi bildirir?

**Doğrulanan olgular:** `2025-11-25` protokolünde istek sahibi `_meta.progressToken` ile ilerleme ister. Alıcı bildirim göndermeyebilir; sıklığı ve toplam bilgisi isteğe bağlıdır. Token aktif istekler arasında benzersiz olmalı, `progress` artmalı ve bildirimler tamamlanınca durmalıdır. Task ile genişletilmiş isteklerde token, ilk yanıt dönse de task son durumuna ulaşana kadar yaşayabilir. Normal `tools/call` için yön, sunucudan çağrıyı yapan MCP istemcisine doğrudur; eski protokolün genel mekanizması iki tarafın da başlattığı isteklere uygulanabilir. [MCP progress](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/progress).

**Bu kapsamdan çıkan sınırlar:**

- MCP sunucusu, dış LLM'nin henüz bir araç çağrısı göndermeden yaptığı hazırlığı bu bildirim mekanizmasıyla gözleyemez. Hazırlık başlangıcını göstermek istenirse üretici istemcinin ayrıca gözlenebilir bir iş olayı vermesi gerekir.
- MCP istemcisinin aldığı progress, ayrı Designer tarayıcısına otomatik yayın değildir. Tarayıcıda zaten gözlenen işlem aşamaları kullanılabilir; sunucu aşamalarının da görünmesi istenirse uygulamanın mevcut browser bağlantısında açık korelasyonla iletilmesi gerekir.
- Yalnız geçen zamandan “%80 üretildi” sonucu çıkarılmamalı. Gerçek toplam bilinmiyorsa aşama metni veya belirsiz ilerleme gösterimi daha doğru olur.
- Standart progress bir belge düzenleme sözleşmesi değildir. `message` alanını örtük JSON patch akışına çevirmek, şema/sürüm/kalıcılık doğrulamasının yerini tutmaz.

**Önerilen dil:** Olay gerçekten gözlendiğinde “İstek alındı”, “Doğrulanıyor”, “Uygulandı” veya “Kaydedildi”; tam sonuç sonrası animasyonda “Değişiklikler gösteriliyor”. Çağrı öncesi veya makbuz gelmeden başarı iddiası üretilmesin.

## Paralel sonuçlar için küçük uygulama önerisi

Bu bölüm uygulanmamış öneridir; MCP standardı gereği değildir.

1. **Üretim ve yazmayı ayır:** Üreticiler bağımsız taslaklarını paralel hazırlayabilir. Aynı belgeye yazacak taraf, önceki yazmanın sonucunu ve güncel belge sürümünü dikkate alarak sıradaki yazmayı göndersin. Eski içerik için yalnız `expectedVersion` değerini yenileyip kör yeniden deneme yapılmasın; hedef ve bağımlı içerik tekrar okunup uzlaştırılsın.
2. **Görsel işi kabul edilen işlemden türet:** Yeni bir istek alınması bekleme durumunu gösterebilir; başarı animasyonu ancak gerçekten uygulanmış öğeleri anlatsın. Geçersiz veya çakışmış JSON için başarılı yerleştirme oynatılmasın. Aynı işlem makbuzunun tekrarı ve belgeyi değiştirmeyen işlem yeni animasyon başlatmasın.
3. **Frame başına tek oynatıcı:** Geçici kuyruk kimliği mantıksal `(designId, editorId, frameId)` olsun. Farklı frame kuyrukları birlikte oynayabilir; aynı frame tek imleç kullanır. Bir frame'in responsive görünümlerinde imleci çoğaltmak yerine tek hedef görünüm seçilsin. İstek kimliği olay korelasyonu içindir, imleç sayısını belirlemez.
4. **Animasyonu yazma yanıtından ayır:** Görsel oynatım bitişi, `applied`/`isPersisted` yanıtına önkoşul olmasın. İmleç hareketi kanonik belgeyi, undo geçmişini veya IndexedDB'yi değiştirmesin. Kullanıcı düzenlemesi, belge geçişi, frame silinmesi veya daha yeni bir işlem eski hedefleri geçersiz kıldığında yalnız görsel kuyruk temizlensin.
5. **Tam JSON ile başlanabilir:** Atomik olarak kabul edilmiş sonucun gerçek DOM kimliklerinden bir gösterim rotası üretmek, ayrı bir üretim servisi gerektirmez. Öğelerin tek tek gerçekten üretiliyormuş gibi belgeye gecikmeli uygulanması ayrı ve daha kapsamlı bir özellik olur; mevcut atomik doğrulama/undo sınırını sessizce değiştirmemelidir.

MCP iptali ile görsel iptal farklıdır. `2025-11-25` cancellation bildirimi sürmekte olduğu düşünülen isteği hedefler; tamamlanmış veya iptal edilemeyen işlem için yok sayılabilir ve tamamlanmayla yarışabilir. Dolayısıyla imleci durdurmak, uygulanmış belge değişikliğinin geri alındığı anlamına gelmemelidir. [MCP cancellation](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/cancellation).

## Tarayıcı için doğrulanan küçük araç seti

| Resmi tarayıcı davranışı | Önerideki karşılığı |
| --- | --- |
| `requestAnimationFrame`, bir sonraki yeniden çizim öncesi tek callback ister; tekrar planlanması gerekir. Hız, callback sayısıyla değil zaman damgasıyla hesaplanmalı; arka plandaki sekmelerde çağrılar durabilir. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame). | Yerel, zaman tabanlı imleç hareketi. Animasyon saati belge işleminin tamamlanma saati olmasın. |
| `cancelAnimationFrame` bekleyen callback'i iptal eder. Web Animations `Animation.cancel()` oynatımı ve efektleri temizler; etkin `finished` Promise'i `AbortError` ile reddedilebilir. [rAF iptali](https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame), [Animation iptali](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel). | Unmount/iptal/yeni hedefte eldeki animasyon kaynağını temizle. İki animasyon mekanizmasını birlikte kurmak zorunlu değil. |
| `getBoundingClientRect` viewport'a göre konum/boyut verir; scroll ile sonuç değişir. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect). | Mevcut DOM/geometri yardımcılarını kullan; scroll/zoom/resize sonrası eski piksel hedefini yeniden kullanma. |
| `prefers-reduced-motion`, gereksiz hareketin azaltılması yönündeki cihaz tercihini bildirir. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). | Yol boyunca hareket yerine kısa sabit vurgu veya durum metni sun. |

## Mevcut kodda doğrulanan bağlantı noktaları

Kaynak incelemesi `main` üzerindeki `91543b0` ve üretilmiş onprem checkout'undaki `a4c547d` üzerinden yapıldı. Aşağıdaki ilgili bridge, store, Canvas, geometri ve backend kaynakları iki uçta aynı. Araştırma notu geliştirme checkout'unda tutuldu; üretilmiş teslim ağacı değiştirilmedi.

| Sorumluluk | Gerçek kaynak ve sonuç |
| --- | --- |
| HTTP MCP | [registerBackendMcp](../../mcp/src/http/registerBackendMcp.ts) ayrı istekleri izler; HTTP gövdesindeki JSON dizisini `MCP_BATCH_UNSUPPORTED` ile reddeder. Tek `tools/call` içindeki `document.nodes` dizisi bu retle ilgili değildir. |
| Browser taşıması | [registry](../../mcp/src/backend/registry.ts) client başına 16 bekleyen istek ve 15 saniye timeout kullanır. Animasyonun bitmesini beklemek bu isteğin işine dahil edilmemeli. |
| Uygulama sırası | [startBackendBridge](../src/utils/backendBridge/startBackendBridge.ts) bir Promise zinciriyle browser işlemlerini sıraya koyar. İmleç kuyruğu bu zincirin devam koşulu olmamalı. |
| Doğrulama, tekrar ve kayıt | [getBridgeMutationResult](../src/utils/backendBridge/operations/getBridgeMutationResult.ts) hedef/sürüm denetimi, receipt tekrar kontrolü, gerçek store uygulaması ve belge/receipt kaydını sahiplenir. Görsel etkinliğin en dar başlangıç noktası, bu yoldaki yeni ve başarılı yerel uygulamadır. |
| Yeni frame kimlikleri | [getAppendGeneratedDesignAction](../src/stores/editor/utils/documents/getAppendGeneratedDesignAction.ts) içindeki [clone](../src/utils/nodes/getClonedNodesForReuse.ts) frame ve alt düğümlere yeni kimlik verir. İmleç görevleri gelen eski kimliklerden değil, gerçekten eklenen düğümlerden çıkarılmalı. |
| Etkilenen frame'ler | [getApplyGeneratedUpdateAction](../src/stores/editor/utils/documents/getApplyGeneratedUpdateAction.ts) değişiklikten sonra bütün kök frame kimliklerini döndürür. Bu yüzden receipt içindeki `frameIds`, güncellemede etkilenen-frame listesi kabul edilemez. `changedNodeIds` ve gerektiğinde önce/sonra ağaçları, [getFrameForNode](../src/utils/frames/frameWorkspace/getFrameForNode.ts) ile eşlenmeli. |
| Tuval koordinatları | [getNodeElement](../src/utils/canvas/hitTesting/getNodeElement.ts) ve [getNodeRect](../src/utils/canvas/hitTesting/getNodeRect.ts) mevcut düğüm/görünüm çözümünü sağlar. [TableEditingLayer geometri](../src/components/Canvas/TableEditingLayer/hooks/useTableGeometry.ts) örneği, viewport kutusundan hedef kutusunu çıkararak üst katman koordinatını hesaplar. |
| Render kimliği | [NodeRenderer](../src/components/Canvas/NodeRenderer.tsx) ile [useNodeRendererState](../src/components/Canvas/hooks/useNodeRendererState.ts) mevcut `data-node-id`, `rootClassName`, root ref ve render stilini adapter'a taşır. Ek bir native wrapper oluşturmadan geçici görünürlük bu editör katmanından yönetilmeli. |

## Önerilen ilk sürüm: frame başına tek imleç

Bu bölüm uygulama planı taslağıdır; kod yazılmadı. Yeni MCP aracı veya kanonik JSON alanı ilk sürümün önkoşulu değildir.

### JSON hangi sırayla gelirse ne olur?

| Geliş biçimi | Yazma davranışı | Görsel davranış |
| --- | --- | --- |
| Tek `import_design`, içinde dört frame | Mevcut sürümle tek doğrulanmış belge işlemi, tek undo | Dört frame için dört bağımsız imleç kuyruğu aynı anda başlayabilir. |
| Frame A ve B için ayrı, sırayla gönderilen çağrılar | A'nın uygulanma/kayıt sonucu alınır; B geçerli güncel hedef/sürümle gönderilir | A'nın gösterimi sürerken B ulaşırsa B imleci hemen kendi kuyruğunu oynatır; A animasyonunu beklemez. |
| Aynı belge sürümüyle eşzamanlı iki çağrı | İlk uygulanan değişiklikten sonra diğer çağrı eski sürüm nedeniyle reddedilir | Yalnız kabul edilen yeni değişiklik animasyon üretir. |
| Tek `update_design`, farklı frame'lerdeki düğümlere değişiklikler | Mevcut `changes` dizisi tek atomik işlem olarak doğrulanır | Değişiklikler ait oldukları frame kuyruklarına ayrılır. |
| Aynı frame için art arda paketler | Her paket mevcut yazma/sürüm kurallarından geçer | Tek imleç korunur. Kuyruk hedefleri güncel ağaca göre ayıklanır; aynı düğümün eski gösterimleri birleştirilir. |

Bu düzen, transport çağrılarını paralelleştirmeden paralel imleç deneyimi sağlar. Gerçek çoklu üretici kullanılırsa ilk sürüm önerisi, üreticilerin taslakları hazırlaması ve yazmayı tek koordinatörün yapmasıdır. Koordinatör güncel belgeyi okumalı, kullanıcı/başka iş değişikliklerini korumalı; yalnız sürüm numarasını değiştirip eski patch'i yeniden göndermemeli. Bu koordinatör MCP standardının veya mevcut ürünün kendiliğinden sağladığı bir yetenek olarak sunulmaz.

### İlişkili ekranları birlikte gönderme gerekçesi

[getClonedNodesForReuse](../src/utils/nodes/getClonedNodesForReuse.ts) bir import grubunun içindeki düğümleri birlikte eşler; grubun dışında kalan etkileşim hedeflerini ayıklar. Dolayısıyla wizard/adım ekranları arasındaki bağlantıları korumak için, hazır ilişkili frame'leri tek geçerli belgeyle `import_design` üzerinden eklemek uygun başlangıçtır. Ekranlar ayrı eklenirse gerçek yeni kimlikler okunmalı ve ilişkiler sonradan mevcut `update_design` yoluyla kurulmalıdır. Gelen eski frame kimliklerinin ayrı çağrılar arasında aynı kalacağı varsayılmaz.

### Tarayıcıdaki olay ve gösterim sırası

1. Mevcut `import_design` / `update_design` doğrulama, hedef, sürüm ve tekrar kontrollerinden geçer. Geçersiz, çakışmış, tekrar uygulanmayan veya içerik değiştirmeyen işlem yeni çizim üretmez.
2. Gerçek belge güncellemesi mevcut store/history işlemiyle uygulanır. Sadece yeni yerel uygulama için, aynı senkron uygulama akışında gerçek önce/sonra kimlikleri ve değişen düğümlerden görsel etkinlik çıkarılır. Yeni düğümlerin geçici gizlenmesi ilk boyamadan önce hazırlanmalı; önce görünme-sonra saklanma parlaması dar browser kabulünde kontrol edilmelidir.
3. Belge/receipt yazımı ve normal MCP yanıtı mevcut anlamıyla sürer. Görsel oynatım bu promise'e eklenmez. `isPersisted:false` içeriğin browser'da uygulanmış olduğu gerçeğini değiştirmez; imleç tamamlanması kaydedildi durumu üretmez.
4. Frame sınırı ve başlığı görünür kalır. Yeni içeriğin anlamlı, birbirini örtmeyen bölüm grupları DOM'da yer kaplar; tek frame imleci gruplar arasında ilerledikçe bu gruplar görünür olur. Yüzlerce yaprağa ayrı bekleme eklemek yerine toplam gösterim süresi sınırlanır. Geçici saklama belge `style` alanına yazılmaz, varsayılan davranış görünürlüktür.
5. Var olan bileşen güncellemesinde veri hemen uygulanır; imleç ilgili bölgeye gidip kısa vurgu gösterir. Silinen/gizli/ölçülemeyen hedef için görünmez bir öğe beklenmez; iş atlanır veya yaşayan üst bölüm vurgulanır.
6. Geometri frame'in seçilen render görünümünden alınır. İmleç, [Canvas](../src/components/Canvas/Canvas.tsx) içindeki ölçeklenmeyen ve tuval sınırında kırpılan üst katmanda çizilir. Kaydırma, zoom ve boyut değişiminde hedef yenilenir; imleç kullanıcının kamerayı veya seçimi değiştirmesine neden olmaz. Responsive kopyalar ek imleç oluşturmaz.
7. Undo/redo, belge/adapter değişimi, frame silinmesi, unmount ve animasyonu atlama eski görsel işleri temizler ve geçici saklamayı kaldırır. Hareket azaltma tercihinde yol animasyonu atlanır. Görsel hata veya süre sınırı içeriği kapalı bırakamaz; görünürlük düzeltmesi yeni belge işlemi üretmez.

İlk sürümde koordinat kümelendirmesi ve aynı frame içinde görev bölümü yoktur. İmleç başına bağımsız işletim sistemi thread'i veya AI modeli gerekmez. Önerilen görsel hareket, mevcut tarayıcı animasyon imkânlarıyla kurulabilir; özel yay fiziği ve yeni bağımlılık gerekli görünmüyor. Pan/zoom ile dinamik hedefleme ve gerçek DOM geometri doğruluğu uygulama sırasında ölçülmelidir.

### Önerilen değişiklik yüzeyi

- Mevcut `getBridgeMutationResult`: başarılı yerel mutation için dahili görsel etkinlik üretme; hata/replay/no-op yolunu koruma. İstemciye dönen MCP zarfına sunum alanı eklenmesi gerekmez.
- Önerilen `src/stores/designActivityStore.ts`: `(designId, editorId, frameId)` başına tek geçici kuyruk, oynatım/görünürlük ve iptal bilgisi. Bu dosya henüz yoktur; belge store'una veya IndexedDB'ye eklenmez.
- Önerilen `src/components/Canvas/DesignActivityLayer/`: kuyrukların gösterimi, yerel geometri ve imleç animasyonu; `Canvas.tsx` içine bağlanır. Bu klasör henüz yoktur.
- Mevcut `useNodeRendererState` / `NodeRenderer`: yalnız tasarım görünümünde geçici belirme. Adapter'ın kendi görünümünü, root DOM sözleşmesini, authored transform ve preview davranışını korur.
- Üretim rehberi: ilişkili ekranları birlikte import etme, bağımsız yazmaları güncel sürümle sıraya koyma ve mevcut frame'i tekrar import ederek çoğaltmama yaklaşımı açıklanabilir. Bu araştırmada rehber değiştirilmedi.

## JSON gelmeden önceki bekleme

Bu ilk sürüm yalnız ulaşmış ve uygulanmış tasarım verisini görselleştirir. Üretici tüm JSON'u sonunda gönderiyorsa, öncesindeki model bekleme süresini dolduramaz. Bunun için iki ayrı seçenek vardır: üreticinin erken geçerli frame iskeletlerini ekleyip tamamlanan bölümleri sonradan güncellemesi veya mevcut WS hattından tarayıcıya ulaşacak açık görev/ilerleme olayları eklenmesi. İkinci seçenek yeni bir uygulama sözleşmesidir; MCP `notifications/progress` bunu Designer'a otomatik sağlamaz.

İlk sürüm önerisi, gelen JSON'a bağlı gösterimi tamamlamak ve başlangıç/ilerleme sözleşmesini ayrıca değerlendirmektir. Kuyruk boşken gelecekte yeni veri geleceği veya modelin düşünmeye devam ettiği varsayılmaz.

## Doğrulama ve araştırmanın sınırı

12 Kasım 2026'da mevcut `mcp-mutations.test.ts` hedefli çalıştırıldı: **1 suite / 5 test geçti, Jest süresi 1.659 saniye**. [Test kaynağı](../src/adapters/tests/integration/acceptance/mcp-mutations.test.ts) K-055 eski sürüm reddini, K-056 aynı işlem tekrarını, K-057 tek undo/redo'yu, K-058 uygulama/kayıt hatası ayrımını ve ortak belge/receipt yazma isteğini, K-059 salt okumaları sınar. Gerçek store/bridge ve JSON round-trip kullanılır; persistence database IO bu testte mock'tur. Bu sonuç gerçek IndexedDB veya eşzamanlı HTTP/browser kabulü olarak sunulamaz. Test başlatıcısının mevcut hazırlık adımı backend export/build çalıştırdı; izlenen kaynak veya generated dosyalarda fark oluşmadı. JSON import attribute deprecation ve Node VM Modules uyarıları vardı.

Özellik uygulanırsa dar kabul: tek mutation içindeki dört frame'de tam dört imleç; aynı frame'e gelen iki pakette tek imleç; animasyon sürerken MCP okuma/yazma yanıtının engellenmemesi; hatalı/stale/replay/no-op işlemde yeni çizim olmaması; import kimlik eşlemesi; zoom/scroll/resize ve responsive görünüm; Undo/skip/hata sonrası görünmez içerik kalmaması; gösterim nedeniyle JSON/history/kalıcılık değişmemesi. Bunlar henüz çalıştırılmış özellik testleri değildir.

Resmi kaynaklar, yerel SDK ve mevcut kaynak kod incelendi. Canlı MCP eşzamanlılık deneyi veya browser animasyon deneyi yapılmadı; uygulama kodu değiştirilmedi. Protokol kaynağına dayanmak, mevcut ürünün progress bildirimlerini ürettiğini veya browser'a aktardığını kanıtlamaz. Bu not yeni ürün kararı, ADR, backlog veya teslim değişikliği oluşturmaz; commit/push yapılmadı.
