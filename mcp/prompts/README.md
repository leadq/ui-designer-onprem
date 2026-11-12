# Promptları düzenleme

Designer çizimi ve kaynak kod üretimi aynı ekran/bileşen bilgisini kullanır; uygulama yolları ayrıdır. MCP rehberleri ve teknik araçları sunar, IDE agent'ı yorumlar ve uygular. Bu klasör çalışma yaklaşımını ve proje kurallarını düzenlemek içindir.

| Yol | İçerik | Otomatik hedef / aşama |
| --- | --- | --- |
| `shared/` | Ekran anlama, kapsam, genel davranış | İki hedef / bütün aşamalar |
| `designer/` | Designer oluşturma/düzenleme yaklaşımı | `design` / implement |
| `codegen/` | Kaynak kod üretme ve doğrulama yaklaşımı | `react` / implement |
| `architecture/` | Dosya/import, routing, API/mock, stil ve proje standartları | `react` / implement |
| `patterns/<konu>/design.md` | Konunun ekran yapısı, yerleşimi ve UX yaklaşımı | İki hedef / implement, pattern=`<konu>` |
| `patterns/<konu>/code.md` | Konunun gerçek provider, event, state ve uygulama örneği | `react` / implement, pattern=`<konu>` |

Pattern klasöründe başka Markdown dosyaları da eklenebilir; varsayılan olarak iki hedefe uygulanır. `code.md` kod hedefini otomatik seçer. Designer'a özel bir pattern için dosyanın kendi metadata'sında `targets: ["design"]` kullanın. Dosya/klasör adlarında küçük harf, rakam ve tire kullanın. Bileşenin prop/slot/native kullanım tarifleri adapter recipes içinde kalır; burada ikinci bir bileşen kataloğu tutmayın.

## En basit yeni kural

`codegen/naming.md` oluşturun:

```md
# İsimlendirme

Buraya projenizde doğrulanmış isimlendirme kuralını ve kısa çalışan örneği yazın.
```

Başka dosyaya referans veya manifest kaydı eklemeyin. Sonraki MCP isteğinde keşfedilir; codegen hedefinin implement aşamasında **içeriğiyle** `guidance.required` içinde gelir. Kimliği `codegen-naming` olur. Bütün görevlere uygulanacak bir kuralı `shared/` altına koyun.

Yeni pattern için `patterns/payment/design.md` ve gerekiyorsa `code.md` ekleyin. `payment`, `guideIndex` ve `start_design_task.patternOptions` içinde keşfedilir. Agent payment konusunu bildirdiğinde o klasördeki hedefe uyan kuralların tamamı birlikte gelir; sunucuya yeni pattern enum'u veya kural listesi yazılmaz.

## Dosyanın kendi koşulları

İsteğe bağlı metadata Markdown'ın başındadır. JSON kullanılır; ayrı ayar dosyası veya YAML bağımlılığı yoktur:

```md
<!-- rule
{
  "id": "payment-validation",
  "title": "Ödeme doğrulama",
  "summary": "Ödeme onayı ve doğrulama kuralları",
  "when": "payment",
  "targets": ["react"],
  "phases": ["implement", "verify"],
  "modes": ["detailed"],
  "status": "needs-project-input"
}
-->

# Ödeme doğrulama

Buraya gerçek proje davranışını ve kullanım örneğini yazın.
```

- `id` verilmezse klasör/dosya yolundan türetilir. Taşımada kimliği korumak için açık `id` kullanılabilir.
- `title` verilmezse ilk H1 başlığı, yoksa kimlik kullanılır. `summary` indekste seçimi kolaylaştırır.
- `when` verilmezse normal klasörlerde `always`, pattern klasöründe konu adıdır. Mevcut özel etiketler: `understand`, `react`, `detailed-react`, `behavior`, `after-implementation`, `render`, `reference-images`.
- `targets`: `design`, `react`; klasörün hedefini genişletemez, daraltabilir.
- `phases`: `understand`, `implement`, `verify`. Tamamlama kuralları için `verify` kullanın.
- `sources`: isteğe bağlı `prompt`, `image`, `editor`. Kaynak henüz `auto` ise olası kurallar atlanmaz.
- `modes`: isteğe bağlı `basic`, `detailed`. Mod bilinmiyorsa olası kurallar atlanmaz; başlangıç rehberi önce modu netleştirir.
- `status`: varsayılan `ready`; boş/örnek proje alanları için `needs-project-input`. Doldurup doğruladıktan sonra aynı dosyada `ready` yapın.

Geçersiz JSON/metadata, yinelenen veya ayrılmış kimlik, bilinmeyen üst klasör, boş Markdown ve symlink sessizce atlanmaz; açık hata verir. `README.md` dosyaları açıklamadır, kural değildir. Bir başlığın/prose cümlesinin içine yazılan koşul sunucu tarafından sınıflandırılmaz; koşulu metadata veya klasör ile belirtin.

## Zorunlu okuma nasıl sağlanır?

`get_design_contract` çağrısı `goal`, `source`, `mode`, `patterns` ve isteğe bağlı `taskPhase` alır. Overview varsayılan olarak understand, details implement aşamasıdır. Uygun kuralların tam gövdeleri `guidance.required` içinde gelir; ayrı okuma kararı gerekmez. `guides` ile ayrıca seçilen bir rehberin konusu, ilgili diğer kuralları da tetikler. Wizard form ve davranış kontratını, filtering data-display kontratını da getirir. Editor → React teknik dönüşüm ve yürütme kontratını alır.

İlk çağrıda bütün pattern'ların içerikleri gönderilmez; agent ekranı anlayıp ilgili konu adlarını details isteğine taşır. Konu algılama modelin işidir. Yanlış/eksik konu beyanı, modelin metni anlamaması veya rehbere uymaması MCP tarafından kanıtlanamaz. Sunucu **bildirilen bağlam için uygun içeriğin teslimini** garanti eder. Yapısal doğruluk validator, belgeye uygulama makbuz/readback, hedef kod doğruluğu proje kontrolleriyle doğrulanır.

Tamamlamadan önce `taskPhase: "verify"` ile details isteği yapılır. `guidance.needsProjectInput` eksik proje kurallarını gösterir; bu örnekler doğrulanmış standart gibi sunulmaz. Yanıtın `guides` alanı seçici okuma uyumluluğunu korur; zorunlu içerik `guidance.required` içindedir. Revision değişmişse overview yenilenir.

## Teknik kontratlar

Ürünle gelen `../designer/contracts/`, `../designer/manifest.json` ve adapter runtime'ı teknik anlamın kaynağıdır. JSON/props/slots/layout/state/receipt sözleşmesi bu prompt klasöründen değiştirilemez. Ayrılmış kontrat veya asset kimliğiyle prompt eklemek yüklemeyi durdurur. `execution-contract.md`, Designer exportundan MCP build sırasında üretilir.

Bu ayrım işletim sistemi dosya kilidi değildir: kaynak reponun sahibi teknik kodu da değiştirebilir. Ancak prompt yapılandırması veya alternatif prompt dizini teknik kontratları değiştiremez; validator sınırları aynen kalır. Ürün kontratını elle düzenlemek, yeni bir prompt kuralı eklemek değildir.

## Beş bağımsız yol

- Prompt → Designer ve image → Designer: tasarım/UX + Designer rehberleri + teknik JSON/adapter kontratı. Editöre yazarken canlı bağlantı gerekir.
- Prompt → React ve image → React: tasarım/UX + codegen + architecture + ilgili pattern kodu. Designer oturumu veya ara JSON zorunlu değildir.
- Editor → React: canlı belge/seçili ekran okuma + JSON/native dönüşüm kontratı + codegen/architecture/pattern rehberleri. Kaynak belge yazılmaz.

## ZIP güncellemesi ve eski profil

Mevcut adapter, proje config/deployment dosyalarıyla birlikte özelleştirdiğiniz `patterns/`, `architecture/` ve diğer prompt dosyalarını yeni sürüme taşıyın. Genel rehberlerin yeni sürümüyle yerel değişiklikleri karşılaştırın. Teknik kontrat klasörünü eski projeden taşımayın. Sonra yapılandırılmış Designer'dan MCP export/build ve gerçek kabul yapın. Yeni ZIP içindeki [taşıma aracı](../../UPDATE.md) mevcut prompt setini korur; farklı yeni genel rehberleri raporda listeler. Otomatik metin merge’ü yapmaz.

Varsayılan yer bu klasördür. Ayrı yerde tutmak gerekirse **aynı düzenin tamamını** kopyalayıp `DESIGNER_PROMPTS_DIR=/absolute/prompts` kullanın; bu varsayılan promptları tamamen değiştirir, gizli overlay yapmaz. Teknik kontrat ve asset kökü değişmez. Dosya ekleme/düzenleme/silme ve metadata/konum değişikliği revision'a girer; resource listesi de restart gerekmeden güncellenir.

Eski `DESIGNER_PROFILE_DIR` tam profil seçimi artık kabul edilmez; hata migration yolunu gösterir. Eski profilinizdeki çalışma kurallarını buradaki kategorilere taşıyın, `manifest.json` guide kayıtlarını gerekiyorsa dosyanın metadata'sına aktarın. Teknik kontratları ve generator/template assetlerini özel prompt dizinine kopyalamayın. Yeni bootstrap `designer/templates/Designer.agent.md` dosyasındadır. Bilgi paketi 2.0.0; tasarım JSON şeması değişmedi.
