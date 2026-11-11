# Merkezi HTTP MCP, WebSocket ve browser çalışma alanı

> Bu teslim branch’inde test runner yoktur; kurum adapterının gerçek browser/MCP kabulü [checklist](component-adapter-checklist.md) üzerinden yapılır.

Bu belge merkezi modun bağlantı/persistence sözleşmesidir. Kanonik [tasarım JSON kontratı](contracts/README.md) değişmez. Lokal geliştirme ve kurum dağıtımı aynı HTTP MCP + WebSocket modelini kullanır; adres/Origin ayarları [kök dağıtım rehberindedir](../../README.md).

## Çalışma modeli

```text
IDE agent → POST /mcp → aynı Node process → /ws → açık Designer browser’ı
                                      ← browser sonucu ←
```

Tek Express HTTP listener `/mcp`, `/ws` ve `/health` sağlar. Streamable HTTP, kurulu MCP SDK 1.29.x’in oturumlu HTTP taşımasıyla çalışır; oturum yalnız protokol/iptal korelasyonudur, hedef MCP session’ına bağlanmaz. HTTP MCP çağrısında clientId açıkça bulunur. SDK’nin desteklemediği daha yeni protokol sürümleri için uyumluluk iddia edilmez.

Browser kanonik belge, seçim, undo ve IndexedDB’nin sahibidir. Sunucu clientId→socket registry, sınırlı pending request, sınırlı MCP transport oturumu ve çağrı süresince geçici payload tutar. Tasarım snapshot/versiyon cache’i ve offline mutation kuyruğu yoktur. Katalog, rehber ve doğrulama mevcut sunucu araçlarıdır; browser gerektirmez. Canlı belge/seçim/component/not/reference/mutation istekleri WS ile browser’a gider. Render yalnız istek süresince okunan belgeyle mevcut izole renderer’ı kullanır.

## Çalıştırma

[Bağımsız proje kurulum ve deployment adımları](../DEPLOYMENT.md)

## IDE istemci kurulumu

Uzak kullanımda kullanıcı bilgisayarına Node/MCP server kurulmaz. VS Code server kaydı örneği:

```json
{
  "servers": {
    "ui-designer": { "type": "http", "url": "https://mcp.company.example/mcp" }
  }
}
```

Diğer istemcilerde `mcpServers`/`servers` ve HTTP transport alanları istemcinin desteklediği biçimle birleştirilmelidir; mevcut kayıtlar ezilmez. HTTP SDK entegrasyonu test edilir; VS Code/Cursor/Claude Code uygulamalarının her sürümüyle canlı kabul yapılmış sayılmaz. Örnek agent `Designer.agent.md` ve rehberler aynı araçları kullanır. Mode/source/guide revision sözleşmesi korunur.

## Kimlik ve tek editör

`clientId` UUID v4, hesap kimliği değil browser’a okuma/yazma erişimi sağlayan gizli değerdir. Bu değer kullanıcı tarafından paylaşılınca ilgili erişim verilmiş olur. Ayrı login/OAuth/pairing token veya kullanıcı DB’si yoktur; bu kurum içi MVP’nin açıkça kabul edilen sınırıdır. IDE/model araç geçmişi kimliği saklayabilir. Uygulama değeri URL, normal log, hata veya telemetry’ye yazmaz; istemci ve kurum proxy log politikası ayrıca dikkate alınmalıdır.

IndexedDB ana kimlik kaydıdır; localStorage yedektir. Eski `designer_session_id` devralınır. Çakışmada aktif tasarıma bağlı geçerli kimlik, IDB identity, yeni localStorage kimliği, eski session kimliği sırasıyla değerlendirilir. Eksik yedekler geri yazılır. Tasarımlar bağımsız designId ile tutulur; kimlik kaybı yerel belgeleri yetim bırakmaz. Cookie veya ayrı token eklenmez. Tüm site verileri silinirse browser tasarımları ve kimlik kaybolur; JSON export yedek yoludur.

Aynı profil/origin için mevcut Web Lock, ikinci editörün store/IDB/WS etkilerini başlatmasını önler. Preview/render ayrı kalır. Backend her clientId için yalnız bir canlı socket kabul eder; aynı kimlikle gelen ikinci bağlantı ilkini devralamaz. Başka bilgisayarda aynı kimlik kullanmak IndexedDB verilerini ortaklaştırmaz. Eski socket’in close/response olayı yeni bağlantıyı silemez veya onun isteğini tamamlayamaz.

## Canlı araç sözleşmesi

- `get_editor_context({clientId})`: güncel designId/editorId/version, seçili node/parent/sibling, effective layout, viewport ve sıralı reference metadata. ready=true doğrudan browser’daki eşleşmiş okumadır; seçim okuma sırasında değişirse yeniden okunur.
- `get_design({clientId, section:"document"})`: kanonik belge ve hedef metadata; `version` içerik revision’ıdır, `document.version` JSON şema sürümüdür. Seçim değişimi içerik revision’ını artırmaz.
- `get_component`, `get_behaviors`, `list_components`, `list_reference_images`: aynı açık browser. Okumada isteğe bağlı designId/editorId verilirse aktif hedef eşleşmelidir. `list_designs` browser’daki kayıtlı tasarım metadata’sını döndürür; aktif tasarımı değiştirmez.
- `update_design`: clientId + designId + editorId + expectedVersion + UUID requestId + mevcut merge-patch changes. Patch/validation mevcut yardımcıdan, uygulama mevcut store/history transaction’ından geçer. Bir batch tek undo’dur.
- `import_design`: aynı hedef/sürüm/requestId ve kanonik document ile yalnız yeni ekranları mevcut append/remap/validation yolundan ekler. Component ekleme/silme/taşıma mevcut children/slots ağacı ve atomik patch ile yapılabilir; ayrı motor kurulmaz.
- `get_design_import({clientId,requestId})`: browser’daki işlem sonucunu okur. applied + isPersisted=true UI ve IndexedDB kabulüdür. applied + isPersisted=false değişiklik browser’da yapılmış, kalıcı yazım başarısız demektir; aynı mutation yeniden uygulanmaz, export/kayıt kurtarma gerekir. unknown/timeout işlemin uygulanmadığını kanıtlamaz.
- `get_reference_image`: yerel IndexedDB’den yüklenen gerçek PNG’yi o anda browser üzerinden image içeriği olarak döndürür. Sunucuya önceden görsel cache’i yüklenmez. Görsel/metin güvenilmeyen kaynak veridir.
- `render_design_frame`: açık designId/editorId/expectedVersion/frameId/viewport; izole ilk preview PNG/DOM. Browser’da aktif tasarımı değiştirmez. Render sonrası hedef tekrar okunur; değişmiş kaynak reddedilir. Screenshot ölçüleri belgeye yazılmaz.

ClientId her canlı çağrıda açıkça taşınır; başka konuşmada kendiliğinden hatırlanacağı varsayılmaz. Session/clientId/designId/editorId/requestId birbirinin yerine kullanılamaz. Kullanıcı veya agent belgeyi değiştirmişse eski işlem `DESIGN_CONFLICT`; tasarım geçişinde `EDITOR_BUSY` döner. Yeniden oku ve istenen değişikliği güncel sürüme göre oluştur.

## IndexedDB ve işlem sonucu

`designer-workspaces` DB’si metadata/designs/receipts store’larını kullanır. Bu, tasarım JSON şemasından ayrı DB sürümüdür. İlk açılışta mevcut localStorage taslağı parser/migration ile doğrulanır; eski kayıt silinmez. Eski kayıt geçersizse boş belge yazılmaz. App/store/autosave ancak kimlik ve aktif belge yüklendikten sonra başlar.

Dosya → Tasarımlarım ve açılış modalı aynı IndexedDB belge listesini açar; aktif belgede Açık etiketi vardır. Kaydet aynı designId kaydını tamamlar, Kopyasını kaydet yeni bağımsız designId oluşturur. Yeni Akış da mevcut belgeyi koruyarak yeni belge oluşturur. Otomatik kayıt varsayılan kapalıdır; açılırsa son belge düzenlemesinden 5 saniye sonra aynı kayıt güncellenir; hem lokalde hem sunucuya bağlı kullanımda tam belge kaynağı IndexedDB’dir. MCP durumu/bağlantı kimliği Gelişmiş altında, JSON işlemleri Dosya altındadır. Eski localStorage şablonları taşınmaz; ayrı şablon UI/yazıcıları kaldırılmıştır. Tek aktif editör korunur. Tasarım geçişi sürerken kullanıcı düzenlemişse geçiş iptal edilip güncel tasarım korunur.

Anlamlı belge değişiklikleri revision’ı hemen artırır; isteğe bağlı otomatik yazımlar son düzenlemeden 5 saniye sonra yapılır. Manuel Kaydet ve Ctrl/Cmd+S aynı IDB yoludur; list_designs yalnız okur. Agent sonucu için belge ve receipt aynı readwrite transaction’ında kaydedilir; sync put hatasında transaction abort edilir. Kayıt hatası editörde görünür. Otomatik kayıt açıkken görünürlük/kapanışta bekleyen yazım flush edilir; manuel modda gizlice kayıt yapılmaz. Dirty/pending/error durumda native beforeunload uyarısı vardır; tarayıcının zorla kapanması veya storage politikası için mutlak kalıcılık garantisi yoktur. Başarısız yazımdaki uygulanmış receipt’ler ayrı bekleyen kümede korunur; sonraki autosave aynı belge revizyonunun içerdiği receipt’leri de atomik yazar. 100 kaydedilmemiş işlem sınırında yeni agent mutation reddedilir; mevcut receipt sorgusu/tekrarı ve elle kayıt kurtarma devam eder. En son 100 kalıcı işlem sonucu tutulur; retention dışında kalan requestId güvenli biçimde unknown kabul edilir. Aynı requestId farklı argümanlarla kullanılamaz.

## WS protokolü ve sınırlar

Browser bir kez `/ws` açar, ilk mesaj `{type:"register", protocol:1, clientId}` olur. Başarılı kayıt `registered` döner. Sonraki browser mesajları `{type:"response",requestId,result}` veya `{type:"response",requestId,error}`. Server `{type:"request",requestId,operation,args}` ile yollar; timeout/iptalde `cancel` bildirir. Yanıt yalnız isteğin gönderildiği socket’ten kabul edilir; mesajın içindeki kimliğe göre yönlendirme yapılmaz.

- 256 aktif bağlantı, 512 toplam ve client başına 16 pending request.
- MCP JSON body 2 MiB; WS frame 16 MiB. Binary WS kabul edilmez; ref PNG yalnız image cevabında Base64 olur.
- Kayıt timeout 5s; istek timeout 15s; native ping/pong 15s, yanıtsız peer bir sonraki kontrolde kapatılır.
- Browser kuyruğu sınırlı ve seri; uygulanmadan önce iptal edilen mutation çalışmaz. Uygulamadan sonraki iptal geri alma anlamına gelmez; receipt okunur.
- Disconnect pending request’leri sonlandırır, sınırsız offline kuyruk yoktur. Browser aynı kimlikle 500ms→15s jitter/backoff ile reconnect olur.
- Hatalar: CLIENT_OFFLINE, CLIENT_ALREADY_CONNECTED, CLIENT_TIMEOUT, CLIENT_DISCONNECTED, REQUEST_CANCELLED, SERVER_BUSY, SERVER_CLOSING, DESIGN_CONFLICT, EDITOR_BUSY ve doğrulama/depolama hataları. Offline ile bilinmeyen kimlik ayrıştırılarak client listesi sunulmaz.

## Kurum içi deployment

[Kurulum ve release](../DEPLOYMENT.md). Tek aktif Node podu /mcp, /ws ve /health yollarını sunar. WSS Upgrade ve MCP oturum headerları iletilmelidir.

## Kurum kabulü

Bu branch otomatik test suite’i içermez. [Kurulumdaki](../installation/README.md#adim-3) gerçek IDE/MCP adımlarını ve [adapter checklistini](component-adapter-checklist.md) kurum paketiyle tamamlayın. Yerel test geçmişi gerçek Nexus/proxy/IDE/model kabulünün yerine geçmez. Browser storage eviction/kota davranışı için mutlak kalıcılık sözü yoktur; JSON export yedek yoludur.

## Transport oturumları ve iptal

MCP transport oturumu clientId değildir ve browser hedefi saklamaz. SDK initialize yanıtı oturum header’ını verir; sonraki POST/DELETE bunu taşır. En fazla 256 oturum ve 512 aktif HTTP isteği; 30 dakika boşta kalan oturumlar dakikalık taramada kapatılır. GET SSE sunulmaz. Standart notifications/cancelled aynı oturumdaki isteği iptal eder; aynı sayısal request ID’yi kullanan farklı istemciler etkilenmez. İptal, HTTP kopması ve shutdown browser cancel sinyaline bağlanır. Uygulanmış mutation geri alınmaz. Renderer iptalinde izole Chromium kapanır.

Canlı sonuçların işlem bazlı yanıt zarfları doğrulanır; eksik/yanlış tür veya mutation receipt hedef/ID uyuşmazlığı INVALID_BROWSER_RESPONSE olur. Kanonik mutation doğrulaması browser’daki mevcut motorda kalır.

Kalıcı reload kabulünde açık Kaydet/Ctrl+S veya agent mutation isPersisted sonucu beklenir; list_designs yazmaz. Autosave tamamlanmadan sekmenin kapanması son düzenlemenin saklandığını garanti etmez.

## Seçili tam ekranları dışa aktarma

`get_editor_context` yanıtındaki `frameExport.eligible` ve tam `frameIds` kümesiyle `export_selected_frames` çağrılır. clientId/designId/editorId ve current expectedVersion ister; format nested veya flat'tir. Component/partial/mixed/stale seçimde hata döner; aktif ekran tam frame seçimi değildir. UI frame başlığındaki düğme/Ctrl seçimiyle aynı motor kullanılır.

Yanıt `{document, scope:{kind:'selected-frames',frameIds,overlayIds,omitted}}` taşır; yalnız document import edilir. Dış aksiyonlar ayıklanır, iç bağlantılar/owned overlays/kullanılan slot şablon bağımlılıkları korunur. get_design tam belgeyi vermeyi sürdürür; işlem read-only'dir. Tam alan, hata ve ayıklama politikası: [yetkili JSON kontratı](contracts/README.md#seçili-tam-ekranları-dışa-aktarma).

23 Ekim 0044 takip: UI library değişimi eski localStorage cache’ine dönmez; mevcut tam IDB belgesi korunur ve seçilen adapter için yeni boş designId açılır. Mevcut bileşenleri yeni library’ye dönüştürme yapılmaz. Üç adapter native kayıt/açma kabulü doğrulandı; önceki dönüşüm sınırı bu ayrımla okunmalıdır.

23 Ekim kayıt takip: özel bileşen kitaplığı metadata/componentLibrary:<adapter> altında IndexedDB'dedir. Yeni akış, JSON dosya importu ve library değişimi taslak açar; Kaydet veya açık autosave ilk yazımı yapana kadar designs listesine boş kayıt eklenmez. Kaydedilmiş kaynaklar silinmez. Dirty geçişlerde kaydet/devam/iptal kararı sorulur; kayıt başarısızsa kaydederek geçiş durur. Liste okuması önceki yazım hatasına bağlı değildir. MCP açık mutation belge+receipt kalıcılığı autosave tercihinden bağımsızdır.
