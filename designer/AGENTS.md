# Kurum teslimi sınırı

Bu branch kurulum/dağıtım ve kurum adapterı entegrasyonu içindir. Genel ürün geliştirmesi ve otomatik regresyon suite’i ana geliştirme reposunda yürütülür.

- Library kaynak repo, props tipleri ve implementasyonları doğrudan incelenir; ayrı extraction/JSONL veya bilgi formu adımı yoktur. Kaynak revizyonunu kurulu paket API’siyle eşle.
- Adapter oluşturma veya native/prop metadata eşlemesi değişiminde `.github/skills/write-ui-adapter/SKILL.md` yönergelerini uygula.
- Kurulumda installation/README.md ve docs/sdk-toolchain.md; adapter eklerken docs/adapter-onboarding.md ve docs/component-adapter-checklist.md oku.
- JSON/preview/MCP anlamında docs/contracts/README.md yetkilidir. Native prop/event/provider/export eşlemesini yalnız kurum adapterında tut; ortak tasarım motorunu library adına göre dallandırma.
- archive/adapters örnek kaynaktır; buradan aktif runtime import etme. Gereken kaynakları src/adapters/<kurum> altında uyarlayıp açık UI_ADAPTERS kaydı oluştur. En az bir kayıt olmadan uygulamanın açılmaması bilinçlidir.
- İkon paketi eklerken [tek ikon kaynağı](src/adapters/iconLibrary/README.md) yolunu izleyin; `archive/iconLibrary` örnektir, `EditorIcon` editör kontrol primitive’idir.
- Teslim şablonunda kuruma özel paket/CLI ve build config adlarını sabitleme; kurulumun ilk adımındaki yer tutucular ekip ortamında doldurulur. Eşleme tamamlanmadan install/build kabulü yapma.
- Kurum paket/sürüm/API bilgisini gerçek kaynak ve tiplerden doğrula. Nexus erişimini veya kurum sürümünü tahmin etme. Eski native paketleri sırf örnek kaynak için kurma.
- Frontend lint/tip kontrolü/bundler standart derleme aracına aittir; ayrı temel lint paketi veya derleyici sarmalayıcısı ekleme. MCP TypeScript derlemesi MCP reposuna, adapter export araçları Designer reposuna aittir.
- Bu branch test runner içermez. Entegrasyonda Designer build + export ve bağımsız MCP build, gerçek browser ve gerçek MCP katalog/validate/import/readback kabulü yap; ürün regresyon otomasyonunu geliştirme reposunda çalıştır. Çalıştırılmayan kontrolü geçti sayma.
- Kurum ikon kaynağı eklerken src/adapters/iconLibrary/README.md ve src/types/iconLibrary.ts oku. Editörün EditorIcon/Tabler kontrol ikonlarını koru; arşiv ikonlarını runtime’dan import etme. Tek aktif kaynak null başlar; gerçek kurum kaynağı bağlanmadan paket/kimlik uydurma.
- Kullanıcının mevcut tasarımlarını ve kurum adapterını koru. Commit/push/deploy yetkisini görev talimatından değerlendir.

- Bu repo yalnız temiz teslim sürümlerini tutar. Ortak editör geliştirmeleri ana geliştirme reposunda yapılır; orada onprem-delivery güncel main üzerine tek teslim commit’i olarak üretilir. Buraya yalnız doğrulanmış dosya çıktısı aktarılır. Ekip ZIP’i kendi projesi olarak uyarlar; yeni sürümde UPDATE.md içindeki taşıma aracını kullanır. Teslim üretim komutu ekip projesinde çalıştırılmaz.

Kurulum, env ve yerel build sırası installation/README.md içindedir. Bundle config, CI/CD ve deployment dosyalarını ekibin çalışan projelerine göre oluşturun; dağıtılan kaynağa platform şablonu eklemeyin.

Prompt/kod üretim kuralları ve teknik kontrat ayrımı: [MCP prompt rehberi](../mcp/prompts/README.md).

Bağlantı/ortam veya kurulum değişikliğinde [bağlantı rehberini](docs/connection.md) okuyun. Public MCP adresini sabit env ve configure scriptiyle verin; editör kaynaklarında paketleyiciye özel env eşlemesi oluşturmayın.
