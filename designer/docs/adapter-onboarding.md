# Kaynak koddan kurum adapterı

Kurum library’sinin erişilebilir kaynak reposu doğrudan girdidir. Tipler, implementasyon ve örnekler aynı görevde okunur; ayrı extraction/JSONL çıktısı veya bilgi formu hazırlanmaz. Kopyalanabilir görev promptu ve kurulum sırası [installation](../installation/README.md#adim-2) içindedir.

Teslimde UI_ADAPTERS boş, eski adapterlar arşivdedir. En az bir gerçek kurum adapterı kaydedilmeden Designer’ın açılmaması beklenir.

Agent ile uygulamada [write-ui-adapter skill](../.github/skills/write-ui-adapter/SKILL.md) zorunlu adımları ve prop metadata örneklerini sağlar.

## 1. Gerçek API ve kapsam

Kaynak package.json, public barrel/exports, hedef componentlerin props tipleri ve implementasyonlarını inceleyin; davranışı başka wrapper/hook belirliyorsa onu da okuyun. Story/example/test varsa belirsiz kullanım için yararlanın. Paket adı/sürüm ile kaynak revizyonunu eşleyin: geliştirme branch’indeki API, Nexus’taki eski sürümün API’si sayılmaz.

Kaynak kodunu okumak runtime kurulum değildir. Native paketin public exportları, derlenmiş JS/tip/CSS/font/icon asset’leri ve gerekli peer bağımlılıkları erişilebilir olmalıdır. Kaynak-only paket için build/kurulum yolunu gerçek library talimatından doğrulayın; kullanıcının bilgisayarına özel mutlak import veya kalıcı file: dependency üretmeyin. Library kaynaklarını değiştirmeyin.

Kullanıcının hedef component listesini uygulayın. Liste yoksa temel container/text/button/form rollerinden küçük, sonlu bir kapsam seçin. Public helper, hook, provider ve compound alt parçalarını otomatik bağımsız palet bileşeni yapmayın. Kaynakta bulunmayan davranışı tahmin etmeyin; eksik rolü ve etkisini belirtin.

## 2. Eşlemede kritik noktalar

| Kontrol | Adapterda doğrulanacak anlam |
| --- | --- |
| Props ve varsayılanlar | Type kadar implementasyondaki default, conditional branch ve wrapper davranışını okuyun. defaultProps/propsSchema/native default aynı anlama gelmeli. false, 0 ve boş metin korunmalı; gereksiz native propsları palete açmayın. |
| Değer ve event | Controlled/uncontrolled, value/defaultValue, scalar/event argümanı, clear/null, boolean/seçenek değerleri gerçek imzadan eşlenmeli. Yalnız callback adının onChange olması yeterli değil. |
| Ref ve stil | rootRef, rootClassName, style ve data-node-id aynı ölçülebilir native DOM köküne ulaşmalı. Native ref instance döndürüyorsa gerçek elementi adapter çözmeli. İç wrapper'a verilmesi gereken stil/prop'u rastgele outer div'e taşımayın. |
| Provider/CSS/portal | Tema, reset, CSS/asset girişleri, portal container, focus/Escape ve overlay lifecycle gerçek kullanım örneğiyle eşlenmeli. Native tema/reset editör kabuğunu değiştirmemeli; tasarım modunu tüm kontrolleri disabled yaparak kurmayın. |
| Çocuk, slot ve compound | children/renderItem/renderCell/slot veya statik alt component ilişkisini kaynaktan öğrenin. JSON callback/fonksiyon içermez; Designer’ın mevcut slot/collection/disclosure/table metadata’sı native yapıyı üretir. Kullanıcıya teknik compound ağacı kurdurmayın. |
| Preview ve export | Canvas renderer’ın doğru görünmesi yeterli değil: preview event/value ve TSX public import/prop/child yapısı aynı native anlamı korumalı. Hedef uygulamanın provider/CSS gereksinimi export/rehberde görünür olmalı. |
| Responsive ve açıklama | Yalnız metadata ile desteklenen prop/style değişimleri bildirilmeli. Semantik HTML türü korunmalı. Kısa description ve birkaç kısa visualHints ilk katalogda bileşenin görünüşünden tanınmasını sağlamalı; uzun uygulama tarifleri/örnek JSON yalnız details ile alınan recipes içinde kalmalı. Kurum kullanım bilgisi kendi registry metadata’sında kalmalı; recipe geçersiz JSON prop’u meşrulaştırmaz. |

## 3. Aktif adapter ve ilk çalışan akış

`src/adapters/<kurum>/` altında registry/provider, gerekirse renk/recipe dosyaları oluşturun. [Arşiv](../archive/adapters/README.md) implementasyon örneğidir; runtime buradan import etmez. Ortak örnek yardımcıların bir kısmı yalnız eski üç library’yi tanır; onları kurum kimliğiyle otomatik uyumlu saymayın.

`src/adapters/index.ts` içindeki açık UI_ADAPTERS nesnesine gerçek registry/provider importlarıyla `id`, `name`, manuel `version`, `registry`, `Provider`, `defaultContainerType` kaydı ekleyin. İlk kayıt varsayılandır. Gerekiyorsa colors/backgroundColor metadata’sını verin; mevcut ikon/palette döngüsünü koruyun. Tip kaynağı: [UIAdapter/ComponentMeta](../src/types/componentContract.ts), [propSchema](../src/types/propSchema.ts), [preview](../src/types/preview.ts).

Önce container/text/button ile palet → ekleme/seçim → prop/layout → undo → preview → kayıt/JSON/export akışını tamamlayın; sonra seçilen input ve gelişmiş aileleri ekleyin. [JSON kontratı](contracts/README.md), [fill](fill-layout.md), tablo varsa [tablo rehberi](table-adapter-guide.md) yetkilidir. Ortak core/editör/MCP kodu library adına göre dallanmaz.

## 4. Kabul

MCP katalog/validator bundle’ı adapter registry/provider importlarını Node içinde de yükler (`../mcp/dist/designerRuntime.cjs`). Modül yüklenirken koşulsuz window/document erişimi veya Node tarafından çözülemeyen native paket girişleri browser çalışsa bile MCP’yi bozabilir. Adapter importlarının sunucuda yüklenebilirliğini gerçek `get_design_catalog`/`get_design_contract` ve validate çağrılarıyla doğrulayın; build ve `/health` başarısı tek başına yeterli değildir.

Ortam dosyaları hazırken `npm run build` ve ardından ayrı terminallerde MCP reposunda `npm run start:backend` ve Designer reposunda `npm run dev` ile [kabul checklistinin](component-adapter-checklist.md) yerel browser/JSON kontrollerini uygulayın. Hazırlanan IDE config’iyle MCP katalog/validate/import/readback kabulünü [son kurulum adımında](../installation/README.md#adim-2) tamamlayın. Bu branch test runner içermez; mevcut olmayan test komutları veya yeni test altyapısı entegrasyon önkoşulu değildir. Gerçek native/browser doğrulaması yine gereklidir.

Teslimde kaynak revizyonu, kurulu paket/sürüm, adapter kimliği, çalışan/kapsam dışı componentler ve kanıt/eksikleri kaydedin. Build başarısını görsel veya IDE/model kabulü saymayın.

Eski belgelerin adapterId’sini kurum kimliğiyle değiştirerek dönüştürme yapılmaz. LEGACY_ADAPTER_ID geçmiş kimliksiz belgeleri ayırt eder. Bağımsız ikon kaydı ve editörün Radix UI’si authored native library’den ayrıdır.
