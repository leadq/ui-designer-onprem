# Kurumun tasarım ikon kaynağı

Editörün kontrol ikonları [common/EditorIcon](../../components/common/EditorIcon) üzerinden Tabler kullanır. Bu paket tasarlanan ekranın ikon kaynağı değildir.

Teslimde `index.ts` içindeki tek `DESIGN_ICON_LIBRARY` kaydı `null` başlar. Bu durumda picker kataloğu ve MCP `iconLibraries` dizisi boştur; icon node yalnız açık boş glyph taşır. Kurum UI adapterı da eklenmeden uygulama açılmaz.

1. Kurum ikon paketinin gerçek public export, prop ve erişilebilirlik API’sini inceleyin; onaylı paketi Nexus’tan kurun.
2. `src/adapters/iconLibrary/<kurum>/` altında [IconLibrary](../../types/iconLibrary.ts) tipine uyan tek kaynak oluşturun: id/name/packageName/entries metadata’sı, gerçek native ikonu asenkron yükleyen `load(id)` ve aynı pakete kod üreten `getExportConfig(entry,node)`.
3. `index.ts` içindeki `null` değerini bu kaynağın importuyla değiştirin. UI adapterına ikonları tek tek eklemeyin; ortak [node kaydı](../../registry/designIconRegistry.ts) katalog, picker ve schema seçeneklerini kaynaktan üretir.
4. Gerçek katalog/picker, native görünüm, JSON round-trip ve üretilen TSX’in aynı paketi kullandığını doğrulayın. Varsayılan ilk katalog öğesidir; açık boş string korunur. Varsayılan 32px, sınır 1–1024; açık layout width/height önceliklidir. currentColor ve accessibleLabel/span erişilebilirlik eşlemesi korunmalıdır.

Lucide ve eski Tabler tasarım kaynakları [archive/iconLibrary](../../../archive/iconLibrary) altında yalnız örnektir. Aktif runtime onları import etmez; bu kimlikler kurum kaynağına sessizce dönüştürülmez. Kayıtlı olmayan bir glyph strict importta reddedilir. Eski kaynağı desteklemek ayrıca açık bir kapsam kararı gerektirir.

Picker/render yüzeyi [components/DesignIcons](../../components/DesignIcons), ortak arama/lookup/default/export [utils/designIcons](../../utils/designIcons), JSON/MCP anlamı [ikon kontratı](../../../docs/contracts/README.md#bağımsız-ikon-authoring--22-ekim-2026) içindedir.

İkonun `description`, `visualHints` ve `recipes` bilgisini `IconLibrary.componentMeta` içinde tanımlayın. Ortak registry'ye yazılmış kurum bilgisini taşımak için [ikon metadata rehberini](../../../docs/icon-library-metadata.md) izleyin.
