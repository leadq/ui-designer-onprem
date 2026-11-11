# Kurum adapterı kabulü

Bu kaynak teslimi test runner içermez. Aşağıdaki davranışları gerçek kurum adapterında doğrulayın; ürünün otomatik regresyon testleri ana geliştirme reposunda korunur. Build başarısı bu davranışların geçtiği anlamına gelmez.

- [ ] İncelenen kaynak revizyonu kurulu native paketin API’siyle eşleşiyor; public export, CSS/asset ve gerekli peer bağımlılıkları çözümleniyor.
- [ ] Sunulan her prop anlamlı description taşır: etki, seçenek anlamları, başlangıç/omitted davranışı ve ilgili koşullar kaynakla eşleşir; gerçek MCP details yanıtında okunur.
- [ ] Registry/provider ve native paket sürümü doğru; yalnız kurum adapterı aktif. Palet önizlemesi ile ilk bırakılan bileşen aynı; root/ref/ölçü native DOM’a bağlı.
- [ ] Editör tıklaması native eylemi çalıştırmıyor; preview gerçek input/button/select/portal etkileşimini çalıştırıyor. Klavye, focus, Escape ve modal kapat/aç değeri korunuyor.
- [ ] Props/defaults ve responsive değerler yalnız katalog şemasında. false/0/boş metin korunuyor. Native stiller adapter’a, ortak Flex/Grid/layout semantiği core’a ait.
- [ ] Input native event/scalar dönüşümü metadata ile tanımlı; preview state/visibility/flow bağlantıları beklenen şekilde çalışıyor.
- [ ] Kapsamda olan slot/renderItem/list/Tabs/disclosure/table aileleri native render, preview ve TSX exportta aynı yapıyı koruyor. Kullanıcıya teknik callback/compound ağacı kurdurulmuyor. [Tablo rehberi](table-adapter-guide.md).
- [ ] Native component bilgisi get_design_catalog ve get_design_contract üzerinden doğru geliyor; recipe açıklamaları metadata’yla çelişmiyor.
- [ ] Aynı revizyondan nested/flat/behavior dışa aktarımları kayıpsız. Geçersiz belge mevcut tasarımı/history’yi değiştirmiyor. Eski native belgenin adapterId’sini kurum kimliğiyle değiştirme kabul edilmiyor.
- [ ] MCP gerçek browser hedefinde validate → import/update → applied/isPersisted → get_design readback akışı; tek undo ve aynı requestId tekrarının ikinci mutasyon yapmaması doğrulanmış.
- [ ] Kaydet/yükle, iki bağımsız browser profiliyle clientId izolasyonu ve ayrı Designer/MCP adresleri gerçek kurum proxy’sinde doğrulanmış.
- [ ] Kurum paketleriyle temiz kurulum ve Designer build, adapter export ve ayrı MCP build geçti; yapılan/eksik kontroller, paket sürümleri ve kaynak revision kaydedildi.

JSON/MCP ortak anlamı [kontrat](contracts/README.md) ile korunur; kurum component açıklaması kendi adapter metadata’sında kalır. Bu kabul, gerçek VS Code/seçilen modelin tasarım ve hedef kod kalitesinin ayrı sınanmasının yerine geçmez.
