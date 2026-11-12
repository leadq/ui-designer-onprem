# Prompt ile üretim ve yinelemeli düzenleme

Görsel zorunlu değildir. Kullanıcının metni amaç, ekranlar, bileşenler, yerleşim, başlangıç verisi ve açık etkileşimleri belirleyebilir. IDE agent'ı yorumlar; MCP model çalıştırmaz.

## Kapsamı netleştir

- Önce verilen amacı, ekran/adım sayısını, alanları, içerik sırasını, hedef kullanıcıyı ve istenen eylemleri çıkar. Bilineni tekrar sorma.
- Önce authoring-modes: mod verilmemişse sor ve bekle. Kaynak CSS viewport genişliği güvenilir değilse iki modda da sor. Basic ortak sorularla (en fazla 3) görünür tasarım ve stratejiye dayalı yapısal form/wizard; Detailed toplam en fazla 10 soru ile teyit edilmiş ilişkiler/domain. Basic'te alan bağımlılığı veya iş kuralı çıkarma.
- Geri alınabilir spacing/etiket seçimlerinde mevcut tasarım ve katalog varsayılanlarını kullanıp varsayımı belirt. Her küçük ölçü için kullanıcıyı bekletme. "Biraz artır" için mevcut değeri ve önerdiğin yeni değeri söyle; örneğin 16 → 24. "İki kat" 16 → 32 olmalı.
- Varsayılan seçili library temasıdır; tema sorusu sorma. Yerleşim, hiyerarşi ve oranları yaklaştır; keyfi renk/font taklidi yapma. Primary/secondary rollerini native varyantlara eşleştir. ButtonGroup gibi bir rol katalogda yoksa bağımsız butonları o bileşenmiş gibi sunma.

## Yeni tasarım

1. Editörde çalışılacaksa önce get_design(section: document) oku; document.adapterId ve editorId/version değerlerini al. Katalog özeti aktif kütüphaneyi söylemez. Oturum yoksa kullanıcıdan Designer bağlantısını iste; sessizce library seçme.
2. Önce get_design_contract overview ile ortak JSON kuralları ve strateji indeksini al; amaç/ölçek analizinden sonra details ile seçili componentTypes ve ilgili strateji rehberlerini toplu oku; yeni örüntü bulunursa ek rehberi al. Yalnız prompt için resim yüklenmesini isteme.
3. Katalog özeti ve kullanılan bileşenlerin detayları → semantik frame/flow ağacı → validate_design. Bir form adımının verileri ortak scope'ta kalmalı.
4. Kullanıcı editörde oluşturmayı istediyse import_design ile yalnız YENİ ekranları ekle. get_design_import applied sonucunu doğrula. JSON dosyası alternatifi mevcut belgenin yüklenmesidir; append ile karıştırma.

## Mevcut tasarımı düzenle

1. Her yeni kullanıcı talebinde güncel belgeyi oku; eski yanıtındaki ID veya değerleri körlemesine kullanma. Seçili öğe bağlamı varsa onu öncele; yoksa label/metin/tree yolu ve ebeveyn-kardeş ilişkileriyle hedefi bul. Birden fazla olası hedefte soru sor.
2. İki kardeş arasındaki boşluk genellikle ebeveyn gap'idir. Ebeveynin bütün çocukları etkilenecekse bunu açıkla; yalnız iki öğe için gerekiyorsa semantik grup kur. Büyük padding ile yanlış yeri telafi etme.
3. Aktif breakpoint ve miras sırasını dikkate al. Temel gap yerine mevcut responsive override etkiliyse doğru katmanı değiştir. Shorthand/kenar öncelikleri layout rehberindedir.
4. update_design({requestId,editorId,expectedVersion,changes:[{nodeId,patch}]}) kullan. Nesneler recursive merge edilir; null anahtarı siler; diziler TAMAMEN değiştirilir. id değiştirilemez. Örnek: {nodeId:"actions",patch:{style:{gap:32}}}. Prop değişikliği: {nodeId:"email",patch:{props:{label:"İş e-postası"}}}. Büyük children/slots dizilerini değiştirirken dokunulmayan bütün alt ağaç ve ID'leri koru.
5. Type değiştirirken eski türe özgü props'u null ile kaldır; yeni türün kataloğunu oku. Patch bütün belgeyi doğrular. Desteklenmeyen tema/prop ekleme.
6. Aynı requestId aynı argümanlarla retry edilir. applied + isPersisted=true ve frameIds/changedNodeIds sonucunu doğrula. Stale belge/editor durumunda yeniden oku ve talebi güncel bağlama uygula; yeni ID ile kör retry yapma.
7. Tarayıcıda değişen öğeler seçilir, işlem durumu görünür ve tek undo ile geri alınır. Mevcut frame'leri yeniden import ederek kopya üretme. Yeni ekranlar import_design; mevcut öğeler update_design.

ACK uygulamanın gerçekleştiğini bildirir; görsel benzerliği ölçmez. Otomatik render görüntüsü olmadan kesin görsel eşleşme iddia etme. Kullanıcı sonraki düzeltmeleri aynı tasarım üzerinde sürdürebilir.

## Selection and editor targeting (required)

Before every request about selected elements/images, call get_editor_context. Wait for ready=true; a false value means the document and selection are not synchronized yet. Backend HTTP requires the secret clientId copied from Advanced > MCP connection for each live call. Ask for it when missing; never put it in URLs/env/logs or assume transport-session target state. Use returned designId/editorId/version for guarded edits and verify applied plus isPersisted=true. Timeout/unknown is uncertain: inspect the SAME requestId receipt and current design, never blindly resend with a new ID. Never reuse a selection from an older user turn. Empty selection requires locating a clear target or asking.

selectedNodes includes the node, parent, siblings, ancestor path and owning frame. activeBreakpoint/canvasWidth identify the style scope. effectiveStyle resolves defaults and responsive overrides; resolvedSizingStyle additionally resolves parent fill behavior. These are semantic layout values, not DOM pixels or a screenshot. Patch authored style or responsiveStyles; never copy resolvedSizingStyle into JSON. For sibling spacing inspect the parent's gap. Multiple selected nodes must be handled explicitly without silently dropping targets.

selectedReferences follows canvas reading order: rows from top to bottom, items left to right inside each row. Use only relevant selected sources with get_reference_image. availableForAnalysis=false requires restoring the browser connection; never guess source pixels. Ordering alone does not prove wizard transitions. previewMode=true requires returning to design mode before editing.

HTTP MCP reads directly through the registered WebSocket and has no snapshot TTL. Focus/reopen the intended editor and reread. Selection and pan/zoom do not change the document version. Content edits do. New screens use import_design with explicit editorId; existing screens use update_design with the same editorId and current version. Ambiguous identity-free imports are rejected.

## Render geri bildirimi

Import/update ACK sonrası varsayılan olarak render yapma. Yalnız kullanıcı açıkça görsel karşılaştırma/iyileştirme istediyse render-feedback rehberini okuyup yapılandırılmışsa render_design_frame kullan. Dönen PNG ve ölçüleri incele, gerekli node düzeltmesini update_design ile yap ve yeni sürümü tekrar render et. Bu izole ilk-durum preview’udur; get_editor_context canlı ekran görüntüsü sağlamaz. Araç kullanılamıyorsa görsel doğrulama yapılmadığını belirt.


JSON sınırı bütün yükleme yollarında zorunludur: yalnız bileşenin `authoring.acceptedPropKeys` anahtarlarını yaz. Layout için `authoringContract.allowedLayoutKeys` kullan; renk/font değerini style/responsive içine kaçırma. Hata node/alan yolunu gösterir; desteklenen prop varsa ona taşı, yoksa yetenek eksikliğini belirt. Hatalı belge uygulanmaz. `contract` rehberindeki katı JSON sınırını oku.

Backend HTTP transport sessions exist only for protocol cancellation, never browser targeting. Keep clientId explicit on every live call. After backend restart or idle-session expiry, reinitialize the MCP transport; do not change browser clientId. Cancellation does not undo an applied mutation: inspect the same requestId receipt. Failed receipt writes are recovered atomically with subsequent saves of that design; malformed browser envelopes return INVALID_BROWSER_RESPONSE.

## Explicit selected-screen export

For a user request limited to selected whole screens, first read ready `get_editor_context`. Require `frameExport.eligible=true`, then call `export_selected_frames` with exactly `frameExport.frameIds`, current `expectedVersion`, `editorId` (and HTTP `clientId`, `designId`). `format` is nested (default) or flat. Only the top responsive row has frame checkboxes; they toggle whole-screen IDs without modifiers and leave component selection empty. All responsive copies show the frame outline. Active tabs, component selections, partial/mixed/reference/preview/stale selections never imply whole frames. Report the error and ask the user to select whole screens; never silently fall back to exporting all screens or infer a component's parent frame.

The result's `document` is strict-importable, with whole selected subtrees/slots/responsive values and owned overlays. Only selected flow screens remain; the first remaining normal screen becomes start if needed. Actions to excluded nodes, their external otherwise branches, and bindings/conditions depending on excluded nodes are pruned, as reported by `scope.omitted`. Internal screen links remain. No external screen/stub is added. Unrelated page notes/annotations and unused saved templates are omitted. Referenced slot templates and their transitive dependencies remain with stable IDs; missing or recursive saved content fails with INVALID_SAVED_CONTENT. Preserve authored fallbacks. Export is read-only; `get_design` remains full source. Selection and response `scope` are not document fields. See docs/contracts/README.md for error codes and pruning rules.

## Browser document persistence

Full documents are saved in local IndexedDB for local and deployed use. File → My designs and the startup chooser share one library. Save updates the active designId; Save a copy creates a new designId and retains the source. Automatic saving is optional and off by default; when enabled, it saves after 5 seconds without document edits. Save and Ctrl/Cmd+S use the same record. New/import/library changes create an unsaved draft and require an explicit decision before leaving dirty content (save, discard edits, cancel); saved records remain available. Unsaved/pending/failed writes trigger a native exit warning. Saved status confirms a completed native transaction, not cloud persistence. MCP mutations are explicit operations and still atomically persist the document and receipt even when automatic user saving is off. list_designs is read-only and never implicitly saves. Re-read editor context after switching/copying because designId/editorId/version may change. Advanced → MCP connection owns connection-ID copying; it does not copy a design. Legacy localStorage template snapshots are not migrated. Custom component libraries are stored in IndexedDB metadata and definitions remain embedded in full JSON. New design/component-library writes never use localStorage; only preferences, identity/preview data and read-only legacy boot compatibility remain there. No new canonical fields.
