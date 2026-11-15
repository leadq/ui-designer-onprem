# Kurum kurulumu — sırayla uygulayın

Bu teslim kurum paket adlarını içermez; **önce aşağıdaki paket/araç eşlemesini doldurun, sonra install çalıştırın.** Ardından env ve bağlantı dosyaları hazırlanır. **Adapter yazımı ve çalışan sistem kabulü en sondaki büyük adımdır.** Kurum adapterı eklenmeden Designer’ın açılmaması beklenir; config veya build başarısı çalışan sistem kabulü değildir.

## 1. Makine, registry ve kurum paket eşlemesi

1. UI Designer reposunu IDE’de açın; terminal package.json bulunan kökte olsun.
2. `node --version` ve `npm --version` ile ortamı kontrol edin. Designer configure için Node20.12+ kullanın; Ekip paketlerinin engines ve peer koşulları da karşılanmalı.
3. Kurumun verdiği Nexus registry/auth ayarını kullanıcı veya CI npm yapılandırmasına uygulayın. `npm config get registry` ile adresi kontrol edin; tokenları repoya eklemeyin.
4. Ekipten veya kurumun mevcut çalışan uygulamasından aşağıdaki gerçek değerleri alın. Derleme aracı paketinin public CLI/config/env sözleşmesini kontrol edin; isimleri tahmin etmeyin. [Paket rehberi](../docs/sdk-toolchain.md) araç sahipliğini açıklar.

Ekip paketleri için ekibin çalışan projesindeki derleme paketinin adını ve sürümünü aşağıdaki tabloda eşleyin. 2. adımda `npm install` bu paketi ve onun bildirdiği bağımlılıkları kurar. Adapterın kullanacağı UI kütüphanesini 6. adımda ekleyin.

| Yer tutucu | Kurumdan alınacak değer | Değiştirilecek yer |
| --- | --- | --- |
| `__TOOLCHAIN_PACKAGE__` | Derleme aracı npm paketinin tam adı; varsa scope dahil | package.json dependencies anahtarı |
| `__TOOLCHAIN_VERSION__` | Registry'de erişilebilir onaylı sürüm | package.json dependencies değeri |
| `__TOOLCHAIN_DEV_COMMAND__` | Ekibin bundle paketiyle kullandığı tam yerel geliştirme komutu | package.json scripts.dev |
| `__TOOLCHAIN_BUILD_COMMAND__` | Ekibin bundle paketiyle kullandığı tam build komutu | package.json scripts.build |
| `__APP_TITLE_KEY__` | Derleme aracının uygulama başlığı env anahtarı | .env.example |
| `__BASE_PATH_KEY__` | Derleme aracının route/public path env anahtarı | .env.example |

5. Tablodaki yer tutucuları belirtilen dosyalarda **birebir metin değişimiyle** gerçek değerleriyle değiştirin. Env anahtarları geçerli JavaScript alan adı olmalı; derleme aracı tarafından frontend'e aktarılmaları gerekir. MCP bağlantısının `DESIGNER_BACKEND_WS_URL` anahtarı sabittir; kaynak dosyası değiştirilmez. Paket eşlemesinde `configure`, `predev`, `prebuild` scriptlerini koruyun. Dev/build komutlarını ve parametrelerini ekibin aynı bundle paketiyle çalışan projesinden alın; paket adından komut veya seçenek tahmin etmeyin.
6. Bundle paketinin config dosyasını ekibin aynı paketle çalışan mevcut projesine bakarak oluşturun. Dosya adını, CLI seçeneklerini, bootstrap ve env aktarımını gerçek paket sözleşmesinden doğrulayın. Designer’ın `src/main.tsx` default App girişi, `@root` aliası ve React/tip sürüm uyumunu koruyun; bu teslim hazır toolchain veya deployment config örneği sağlamaz.
7. Install öncesinde aşağıdaki kontrolü `designer/` klasöründe çalıştırın. Başarısızsa belirtilen dosyalardaki eşlemeyi tamamlayın; bilinçli olarak şablon bırakılan rehber metinlerini değiştirmeniz gerekmez.

```sh
node --input-type=module -e "import {readFileSync} from 'node:fs'; const files=['package.json','.env.example']; const pending=files.filter(file=>/__[A-Z][A-Z0-9_]*__/.test(readFileSync(file,'utf8'))); if(pending.length) throw new Error('Doldurulmayan kurum ayarları: '+pending.join(', ')); console.log('Paket ve env yer tutucuları dolduruldu.');"
```

**Tamamlanma:** kontrol başarılı, gerçek CLI/config adı doğrulanmış, ekibin derleme paketi registry'de erişilebilir. Bu kontrol yalnız eksik yer tutucuları bulur; doğru API/sürüm veya registry erişimini kanıtlamaz. Gerçek isimler ekibin yapılandırdığı kopyaya yazılır; dağıtılan şablonda bulunmaz.

## 2. Designer paketlerini kurun
Ekip paketleri ve UI kütüphanesi sürümlerini eşleyin, `npm install` ile lock üretip sabitleyin. İleride `npm ci` kullanın.

## 3. Ortam
Önce mevcut .env dosyasını koruyun; yoksa .env.example dosyasını .env olarak kopyalayın. Aynı public origin üzerinden yayın için `DESIGNER_BACKEND_WS_URL=/ws`; ayrı sunucu için `wss://<MCP host>/ws`, ayrı portlarda yerelde `ws://127.0.0.1:4854/ws` verin. Kaynak kodunda env anahtarı veya adres değiştirmeyin. `npm run dev/build` öncesinde configure otomatik çalışır; Derleme aracının `share/` statik asset aktarımı üretilen JSON'ı yayınlar. Aynı build'in deployment env'sinden yeniden yapılandırılması, MCP/IDE ayarları ve kontroller için [bağlantı rehberini](../docs/connection.md) izleyin.

## 4. Yerel build ve MCP export
Adapter kurulumu tamamlanınca Designer kökünde `npm run build` ve `npm run export:mcp -- /tam/yol/mcp` çalıştırın. MCP kendi kökünde `npm ci && npm run build && npm start` ile açılır. [MCP rehberi](../../mcp/README.md) çalışma sözleşmesini açıklar. CI/CD ve deployment dosyalarını ekip kendi mevcut projelerine göre hazırlar.

<a id="adim-3"></a>
## 5. IDE
HTTP MCP adresi yerelde http://127.0.0.1:4854/mcp, kurumda https://<MCP host>/mcp. MCP repo içindeki designer/templates/mcp.vscode.example.json ve Designer.agent.md şablonlarını kullanın.

<a id="adim-2"></a>

## 6. Kaynak koddan adapterı yazdırın ve kurulumu tamamlayın

Library kaynak reposunu Designer’da çalışan agent’ın okuyabileceği şekilde ekleyin. Kaynak incelemek runtime paketi kurmak değildir; public export, tip, implementasyon, CSS ve peer gereksinimleri birlikte doğrulanır. Ayrı extraction/JSONL veya bilgi formu yoktur.

Adapter agent için [write-ui-adapter skill](../.github/skills/write-ui-adapter/SKILL.md) repo içinde bulunur; kişisel skill kurulumuna ihtiyaç yoktur. Aşağıdaki promptu UI Designer reposunda verin. Component listesi yoksa agent temel tasarım/form rollerinden sonlu bir kapsam seçmeli; bütün exportları otomatik palete almamalı.

```text
Bu UI Designer reposuna kurum UI library’mizin adapterını doğrudan kaynak kodunu inceleyerek yaz ve yerelde doğrula.

Library kaynak repo yolu: [tam yol]
Kurulacak paket/sürüm veya kaynak revizyonu: [biliniyorsa yaz; yoksa kaynak manifestinden doğrula]
Hedef componentler: [gerçek export isimleri veya “temel tasarım ve form componentlerini sen seç”]

Önce AGENTS.md ve .github/skills/write-ui-adapter/SKILL.md oku; skill adımlarını ve kabul koşullarını uygula. Skill mekanizmasını desteklemeyen istemcide de bu dosyayı doğrudan okuyup izle. Kaynak library’nin public exportlarını, hedef componentlerin props tiplerini, implementasyonlarını, provider/CSS gereksinimlerini ve mevcut kullanım örneklerini incele. Kaynak ile kurulacak paketin aynı API’yi sunduğunu doğrula; ayrı extraction dosyası/JSONL kataloğu üretme.

Library kaynaklarını değiştirmeden Designer tarafında adapterı uygula. Native paketi public girişlerinden kullan; makineye özel kaynak yolunu kalıcı import/dependency yapma. Paket veya zorunlu peer erişimi yoksa eksik bilgiyi belirt; başka UI library ile doldurma.

src/adapters/<kurum> altında registry/provider/props/defaults/ref/style/value-event/slot/compound/preview/export eşlemelerini tamamla ve UI_ADAPTERS içine kaydet. Arşivdeki örneklerden fikir al; eski library prop/event isimlerini kurum API’sine varsayma. Ortak core ve editörü library adına göre dallandırma. Yalnız gerçekten desteklenen özellikleri katalogda bildir.

.env dosyaları hazırken Designer’da npm run build ve npm run export:mcp -- /tam/yol/mcp çalıştır. MCP reposunda npm ci, npm run build ve npm run start:backend çalıştır. Designer’da npm run dev başlat; gerçek browser’da palet, özellik düzenleme, input/preview, undo, kayıt ve JSON round-trip’i doğrula. Table/list/Tabs/modal varsa ilgili aile kabulünü de yap. Bu branch’te olmayan test komutlarını çalıştırmaya veya test altyapısı kurmaya girişme; doğrulanan ve eksik kalan kontrolleri ayır. Hazırlanan HTTP MCP kaydıyla gerçek katalog/kontrat/rehber okuması, validate/import, applied/isPersisted, readback ve küçük update/undo kabulünü de tamamla. Araç etkinleştirme veya erişim eksikse açık kalan adımı bildir.

Sonuçta adapter kimliğini, kullanılan paket/sürüm ve kaynak revizyonunu, çalışan componentleri, yerel adresi, kontrol sonuçlarını ve kalan engelleri kısa ver. Commit/push/deploy yapma.
```

### Kurum ikon kaynağı

Tasarım ikonları da tek ayrı kayıtla bağlanır. [İkon kaynağı rehberini](../src/adapters/iconLibrary/README.md) izleyerek gerçek kurum paketini kurun; metadata/native yükleme/export eşlemesini src/adapters/iconLibrary/<kurum> altında yazın ve DESIGN_ICON_LIBRARY içindeki null değerini bu kaynakla değiştirin. Editörün EditorIcon/Tabler kontrollerini koruyun. Lucide ve legacy Tabler arşiv örnekleridir; kaydedilmemiş kimlikleri başka pakete dönüştürmeyin. Kaynak yokken katalog boştur; bu durumda yalnız açık boş glyph desteklenir.

Gerçek katalog/picker ve native TSX importu, 32px/açık boş/erişilebilirlik/layout önceliği, JSON/MCP readback ve undo kabulünü kurum paketiyle tamamlayın. Build başarısını gerçek kurum ikon kabulü saymayın.

### Yerel kabul

Adapter kaydedildikten sonra:

```sh
npm run build
npm run export:mcp -- /tam/yol/mcp
```
MCP reposunda `npm ci && npm run build && npm run start:backend`; Designer'da `npm run dev`. IDE ile katalog/validate/import/readback ve undo kabulünü tamamlayın.

### Kurum adresinde son kabul

Ekip kendi yayın sürecinden sonra gerçek kurum adresinde Designer bağlantısını, IDE üzerinden katalog/validate/import/readback akışını ve varsa render erişimini doğrular. Sadece build veya `/health` başarısı uçtan uca kabul değildir.

<a id="adim-4"></a>

Hedef uygulama kodu üretilecekse hazırlanan profil/revision’ı gerçek MCP yanıtında doğrulayın. [JSON alanları](../docs/agent-handoff/json-fields.md) ve [React üretim tarifini](../docs/agent-handoff/react-generation.md) kullanın. Scaffold başlangıçtır; tamamlanan ekran hedef uygulamada build/browser kabulünden geçmelidir.

[Atölye başvurusu](scenarios/01-atolye-basvurusu.md) ve [ekip kaynakları](scenarios/02-ekip-kaynaklari.md) isteğe bağlı model denemeleridir. Kapanışta paket/sürüm/kaynak revizyonu, adapter kimliği, çalışan/kapsam dışı componentler ve doğrulanmamış kontroller kaydedilir.

### Kurumun tasarım ikonları

Tasarım ikon paketi için [tek ikon kaynağı](../src/adapters/iconLibrary/README.md) kaydını yapılandırın; [arşivdeki örnekler](../archive/iconLibrary) metadata/native yükleme/export eşlemesini gösterir. Designer’ın `EditorIcon`/Tabler kontrol katmanı bağımsız kalır.
