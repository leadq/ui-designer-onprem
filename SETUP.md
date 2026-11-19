# Proje kurulumu

Sıra: **1 → yerelde 2A veya sunucuda 2B → 2C → 2D son kabul**. Bir kontrol başarısızsa [3. bölümden](#sorunlar) düzeltip devam edin.

`designer/` ve `mcp/` ayrı proje kökleridir; komutları belirtilen klasörde çalıştırın. Ayrı repolardalarsa export komutundaki `../mcp` yerine gerçek MCP klasörünün tam yolunu kullanın. Mevcut kurulumu ZIP ile güncellemek için önce [UPDATE.md](UPDATE.md).

Kurum kurulumu için gereken girdiler: erişilebilir paket/registry, çalışan derleme aracı config'i, kurum UI library/adapterı, yayın adresleri ve MCP destekleyen IDE. Kuruma özgü değerleri ekip sağlar; rehberdeki `example.com` adresleri örnektir.

<a id="paketler"></a>
## 1. Paketler ve ilk hazırlık

1. **Node 20.12+** ve npm kurulu olsun (`node --version`, `npm --version`). Kurum paketlerinin ek sürüm koşullarını da karşılayın.
2. İlk kurum kurulumunda [paket/CLI eşlemesini](designer/installation/README.md) tamamlayın: registry erişimi, gerçek paket/sürümler, dev/build komutları ve bundle config. `configure`, `predev`, `prebuild` scriptlerini koruyun. Hazır kurum projesinde mevcut eşlemeleri kullanın.
3. Paketleri kurun:

   | Klasör | Komut |
   | --- | --- |
   | Designer | Lock dosyası varsa `npm ci`; ilk paket eşlemesinde henüz yoksa `npm install`, oluşan lock dosyasını kaydedin. |
   | MCP | `npm ci` |

4. Designer'da kurum adapterı `src/adapters/index.ts` içindeki `UI_ADAPTERS` listesine kayıtlı olsun. Eksikse [adapter hazırlığını](designer/installation/README.md#adim-2) tamamlayın. Ardından aşağıdaki ortam adımlarına dönün.

**Kontrol:** iki projenin paket kurulumu başarılı, Designer paket/CLI eşlemeleri ve aktif adapterı hazır.

<a id="lokal"></a>
## 2A. Aynı bilgisayarda yerel kurulum

Bu örnekte Designer **5174**, MCP **4855** kullanır. `.env.example` içindeki farklı portları aşağıdaki değerlerle değiştirin.

**1. Designer kökünde** `.env` yoksa kendi `.env.example` dosyasını `.env` olarak kopyalayın. Mevcut dosyada diğer ayarları koruyup şunları düzenleyin:

```dotenv
PORT=5174
DESIGNER_BACKEND_WS_URL=ws://127.0.0.1:4855/ws
```

Designer'da öncelik **terminal/CI env → `.env.local` → `.env`**. Aynı anahtar üstteki kaynaklardan birinde varsa orayı da düzeltin. Dev komutunuz portu ayrıca belirliyorsa 5174 ile eşleyin.

**2. MCP kökünde** kendi `.env.example` dosyasını `.env` olarak kopyalayın; varsa mevcut dosyayı düzenleyin:

```dotenv
DESIGNER_BIND_HOST=127.0.0.1
PORT=4855
DESIGNER_ALLOWED_ORIGINS=http://localhost:5174,http://127.0.0.1:5174
DESIGNER_RENDER_URL=http://localhost:5174
```

Son satır yalnız görsel render içindir; temel bağlantı için zorunlu değildir.

**3. Sırayla build ve export yapın.** Her komut başarılı olduktan sonra sonraki komuta geçin:

| Sıra | Klasör | Komut |
| --- | --- | --- |
| 1 | Designer | `npm run build` |
| 2 | Designer | `npm run export:mcp -- ../mcp` |
| 3 | MCP | `npm run build` |

Adapter veya kontrat değiştiğinde bu sırayı tekrarlayıp çalışan MCP'yi yeniden başlatın. Export edilen `mcp/generated/` dosyalarını MCP projesiyle birlikte teslim edin; izlenebilir export için Designer kaynakları commitlenmiş olsun. MCP'nin çalışacağı ortamda `dist/`, `designer/` (manifest, kontratlar ve şablonlar), `prompts/` ve kurulu çalışma bağımlılıkları birlikte bulunmalıdır; yalnız `dist/` klasörünü kopyalamak yeterli değildir.

**4. İki terminalde başlatın; terminaller açık kalsın:**

| Terminal / klasör | Komut |
| --- | --- |
| 1 / MCP | `node --env-file=.env dist/backend/index.js` |
| 2 / Designer | `npm run dev` |

**MCP'de `npm start` ve `npm run start:backend`, `.env` dosyasını otomatik okumaz.** Yukarıdaki Node komutu dosyayı yükler; terminalde önceden tanımlanmış env değerleri yine önceliklidir. Ayar değişikliğinde ilgili süreci yeniden başlatın ve Designer sayfasını yenileyin.

**5. Tarayıcıda sırayla kontrol edin:**

| Adres / yer | Beklenen sonuç |
| --- | --- |
| `http://localhost:5174/designer-config.json` | JSON içinde `"backendWsUrl": "ws://127.0.0.1:4855/ws"` |
| `http://127.0.0.1:4855/health` | JSON içinde `"status": "ok"` |
| `http://localhost:5174` → Gelişmiş → MCP bağlantısı | **Tasarım bağlantısı hazır** |

`designer-config.json` ZIP'te hazır bulunmaz. `npm run dev/build` öncesinde üretilir; elle üretmek için **Designer kökünde** `npm run configure` çalıştırın. Diskteki yeri `share/designer-config.json`; tarayıcıya bu dosya sunulmalıdır.

Üç kontrol de geçtiyse [2C'ye](#ide) geçin.

<a id="sunucu"></a>
## 2B. Kurum sunucusunda kurulum

Örnek public adres **`https://design.example.com`**; bunu kendi Designer adresinizle değiştirin. `/` Designer'a, `/ws`, `/mcp`, `/health` aynı aktif MCP sürecine yönlendirilsin. Sunucular fiziksel olarak ayrı olabilir; bu sürüm **tek aktif MCP süreci** kullanır.

1. **Designer build/deployment ortamında** uygulama başlığı ve public path gibi eşlenmiş ayarları `.env.example` üzerinden tamamlayıp `DESIGNER_BACKEND_WS_URL=/ws` verin. Ayrı public MCP hostunda bunun yerine `wss://mcp.example.com/ws` kullanın. Env önceliği yereldekiyle aynıdır; eski `.env.local` ayarını kontrol edin. Tarayıcıda Designer'ı HTTPS ile yayınlayın; bağlantı `wss` olmalı. Sunucuda `localhost` tarayıcının çalıştığı bilgisayarı gösterir.
2. **Designer kökünde** `npm run build`, ardından `npm run export:mcp -- ../mcp` çalıştırın. Bundle aracı `share/designer-config.json` dosyasını index sayfasının yanına kopyalamalıdır. Başka ortam için üretilmiş build kullanıyorsanız yayınlamadan önce, doğru ortam değişkeniyle `node scripts/configure.mjs /gercek/statik/dizin/designer-config.json` çalıştırın. [Alt dizin ve config ayrıntıları](designer/docs/connection.md).
3. **MCP kökünde** `npm run build` çalıştırın. Aşağıdakileri MCP'yi başlatan servisin/container'ın **ortam değişkenlerine** ekleyin; sonra `npm start` ile başlatın:

   ```dotenv
   DESIGNER_BIND_HOST=0.0.0.0
   PORT=4855
   DESIGNER_ALLOWED_ORIGINS=https://design.example.com
   ```

   `PORT` servis içi porttur; proxy hedefiyle aynı olmalı. Origin yalnız protokol + host + varsa port içerir, path içermez. Servis env yerine `.env` dosyası kullanacaksanız **MCP kökünden** `node --env-file=.env dist/backend/index.js` çalıştırın.
4. **Proxy/yayın ayarında** WebSocket Upgrade, MCP `POST`/`DELETE` metotları ve `mcp-session-id` headerını iki yönde iletin. Public yol prefix'liyse MCP'ye ulaşırken `/ws`, `/mcp`, `/health` yollarına eşleyin. Config JSON için cache'i kapatın; SPA fallback HTML'i dönmesin. CI/CD, erişim politikası ve proxy yapılandırmasını ekip mevcut altyapısında yapar; Origin listesi kullanıcı kimlik doğrulaması sağlamaz.
5. **Kontrol:** public Designer adresindeki `designer-config.json` doğru URL'yi, public MCP adresindeki `/health` `status: ok` yanıtını vermeli; Designer'da **Tasarım bağlantısı hazır** görünmeli. Alt dizine yayın varsa config de giriş sayfasının yanındadır: örneğin `/designer/designer-config.json`.

İsteğe bağlı render kurulumu [son kabul adımında](#kabul). Temel bağlantı hazırsa devam edin.

<a id="ide"></a>
## 2C. IDE'yi bağlayın ve kimliği kullanın

1. IDE'nin **aktif MCP yapılandırmasına** HTTP sunucu kaydı ekleyin. URL:

   | Ortam | IDE HTTP MCP URL'si |
   | --- | --- |
   | Yukarıdaki yerel örnek | `http://127.0.0.1:4855/mcp` |
   | Yukarıdaki sunucu örneği | `https://design.example.com/mcp` |
   | Ayrı public MCP hostu | `https://mcp.example.com/mcp` |

   İstemcinin desteklediği biçimi kullanın; [genel örnek](mcp/mcp.json), [VS Code örneği](mcp/designer/templates/mcp.vscode.example.json). Repo içindeki örneği düzenlemek tek başına IDE'ye kayıt yapmaz. IDE gerektiriyorsa MCP bağlantısını yeniden yükleyip araçları etkinleştirin.

   VS Code kullanıyorsanız örnekteki `servers.ui-designer` kaydını IDE'de açık projenin `.vscode/mcp.json` dosyasına, mevcut kayıtları koruyarak ekleyin; `url` alanını yukarıdaki adresle değiştirin. Başka istemcide o istemcinin aktif MCP ayarını kullanın.
2. Designer tarayıcıda açık ve bağlıyken **Gelişmiş → MCP bağlantı kimliğini kopyala** seçin.
3. Kimliği IDE ajanına sohbette verin: “Bu `clientId` ile `get_editor_context` çağır ve `ready=true` olduğunu doğrula.” Kimlik `.env`, URL veya MCP sunucu config'ine yazılmaz.
4. **Kontrol:** IDE'nin gerçek araç çağrısı `ready=true` döndürmeli. `/health` yalnız servisi doğrular; bu son kontrol açık Designer'a erişimi doğrular. Kimliği kopyalamak bağlantı kurmaz; bağlı tarayıcıyı hedefler.

<a id="kabul"></a>
## 2D. Kurulumu tamamlayın

Mevcut çalışmanızı kaydedin; Designer'da **ayrı bir boş deneme tasarımı** açın. IDE ajanıyla şu kontrolleri sırayla yapın:

1. `get_editor_context` ile güncel hedefi okuyun; `get_design_catalog` ile gerçek kurum adapterının ve bir bileşeninin geldiğini doğrulayın. Ajan üretim öncesinde `start_design_task` / `get_design_contract` ile güncel kontrat ve gerekli rehberleri okumalıdır.
2. Katalogdaki bileşenle küçük bir ekran hazırlayıp `validate_design` çalıştırın; hata varsa düzeltin. Aynı `clientId` ve güncel hedef/sürüm bilgileriyle `import_design` uygulayın. Sonuç `applied`, `isPersisted=true` olmalı; belirsiz sonuçta aynı işlem kimliğiyle `get_design_import` durumunu okuyun.
3. Ekranı Designer'da görün; `get_design` ile aynı ekranı geri okuyun. Küçük bir özellik değişikliğini `update_design` ile uygulayın ve Designer'da tek geri alma ile önceki değere döndüğünü doğrulayın. Kaydedip sayfayı yenileyin; tasarım korunmalı.

**Tamamlanma:** paket/build/export başarılı, Designer bağlı, IDE gerçek kataloğu okuyor, yazma/geri okuma/geri alma/kayıt kontrolleri geçti. Yalnız `/health` veya `ready=true` bu kabulün tamamı değildir.

**Görsel render kullanılacaksa:** MCP'yi çalıştıran ortamda `DESIGNER_RENDER_URL` ulaşılabilir Designer adresi olmalı; uzakta HTTPS origin'i `DESIGNER_ALLOWED_ORIGINS` içinde olmalı. MCP kökünde `node node_modules/playwright/cli.js install chromium` ile kurulu Playwright sürümünün Chromium'unu hazırlayın; Linux sistem bağımlılıklarını ekip aynı sürümün gereksinimlerine göre kurmalıdır. Kapalı ağda onaylı browser/cache dağıtımını kullanın. Aynı servis kullanıcısının browser dosyalarına erişimiyle `render_design_frame` çağrısından görüntü alarak doğrulayın. İzole render tarayıcısı kullanıcının SSO oturumunu devralmaz.

<a id="sorunlar"></a>
## 3. Troubleshooting

Önce hatanın olduğu satırı uygulayın, sonra o adımın kontrolünü tekrarlayın. Çözüm için browser site verilerini/IndexedDB'yi silmeyin; tasarımlar oradadır.

### Paket ve build

| Sorun | Sırayla kontrol / çözüm |
| --- | --- |
| `node` / `npm` bulunamıyor; `parseEnv` veya `--env-file` hatası | Terminalin kullandığı `node --version` değerini kontrol edin; Node 20.12+ ve kurum paketlerinin daha yüksek bir gereksinimi varsa onu sağlayın. |
| Kurum paketi/komutu bulunamıyor; `__TOOLCHAIN_…__` görünüyor | [Paket/CLI eşlemesini](designer/installation/README.md) tamamlayın; gerçek paket adı/sürümü ve komutu çalışan kurum projesinden doğrulayın. |
| Registry 401/403/404, sertifika veya ağ hatası | `npm config get registry`, scoped registry ayarı, paket/sürüm erişimi, token yetkisi ve kurum CA/proxy ayarlarını ekipte doğrulayın. Tam token/env içeriğini hata raporuna koymayın. |
| `npm ci` lock uyumsuzluğu / `ERESOLVE` | Manifest ve lock'u aynı onaylı paket sürümlerine uzlaştırın; gerekiyorsa `npm install` ile lock'u güncelleyin. React/peer sürümlerini doğrulayın; `--force` veya `--legacy-peer-deps` ile atlamayın. |
| `At least one UI adapter must be registered` / `Unsupported UI adapter` | `UI_ADAPTERS` kaydını ve kullanılan tasarımın adapter kimliğini kontrol edin. Eski tasarımı başka library'ye zorla eşlemeyin; kurum adapterıyla yeni deneme tasarımı açın. |
| MCP build'de export/runtime eksik veya `Incomplete Designer export` | Doğru MCP klasörüne Designer'dan yeniden export edin; `generated/` dosyalarını takım halinde taşıyın, MCP build ve restart yapın. |

### Bağlantı ve IDE

| Sorun | Sırayla kontrol / çözüm |
| --- | --- |
| `.env not found` | Komut MCP kökünde mi? Oradaki `.env.example` dosyasından `.env` oluşturun; adının `.env.txt` olmadığını kontrol edin. Designer'ın `.env` dosyası ayrıdır. |
| `designer-config.json` diskte yok | Designer kökünde `npm run configure`; çıktı `share/designer-config.json`. |
| Config URL'si 404 veya HTML döndürüyor | Bundle/proxy `share/` içeriğini index yanında sunmalı. SPA fallback ve alt dizin yolunu kontrol edin. |
| Yanlış IP/port görünüyor | Designer `.env.local` ve terminal env önceliğini kontrol edin; configure/dev'i yeniden çalıştırın. MCP'yi `.env` yükleyen komutla yeniden başlatın. Browser'daki JSON'ı tekrar açın. |
| “Yerel bağlantı yok”, `/health` de açılmıyor | MCP terminalindeki başlangıç hatasını, dinlenen portu ve URL'yi kontrol edin; sunucuda proxy/ağ erişimini kontrol edin. |
| `/health` açık ama Designer bağlı değil | Config JSON doğru mu? Tarayıcı Network → WS isteği doğru `/ws` adresine gidiyor mu? 403 için Origin, HTTPS için `wss`, sunucuda WebSocket Upgrade ayarını kontrol edin. |
| `CLIENT_OFFLINE` | Önce Designer'da bağlantı hazır olsun. Açık Designer'dan kimliği yeniden kopyalayın. IDE `/mcp` ve Designer `/ws` aynı MCP sürecine ulaşmalı; eski kimlik veya farklı backend kullanmayın. |
| `CLIENT_ALREADY_CONNECTED` / ikinci editör uyarısı | Aynı çalışma alanını kullanan fazladan Designer sekmesini kapatın; asıl sekmeyi açık tutun. Kimlik dosyalarını veya site verisini silmeyin. |
| `Listener failed` / port kullanımda | Aynı portta çalışan kendi eski MCP sürecinizi kontrol edin. Port değişecekse MCP `PORT`, Designer WS URL ve IDE MCP URL'sini birlikte güncelleyin. |
| Tarayıcıdan `/mcp` açınca 405 | Bu URL web sayfası değildir; tarayıcı GET isteğine 405 normaldir. Servis için `/health`, gerçek MCP için IDE bağlantısını kontrol edin. |
| `MCP_SESSION_EXPIRED` / `MCP_INITIALIZE_REQUIRED` | IDE MCP bağlantısını yeniden başlatıp oturumu yeniden kurun. Proxy `mcp-session-id` headerını korumalı; istekler aynı aktif MCP sürecine gitmeli. |
| HTTPS/sertifika hatası; WS sürekli kopuyor | Tarayıcı ve IDE/MCP ortamının kurum sertifikasına güvendiğini, HTTPS→WSS eşleşmesini ve proxy WebSocket timeout/Upgrade ayarını doğrulayın. |
| IDE'de araç yok; `/health` çalışıyor | Aktif istemci config'inin `/mcp` kullandığını, kaydın etkinleştirildiğini ve IDE MCP logunu kontrol edin. Doğru HTTP istemci biçimiyle yeniden bağlanın. |

### Katalog, tasarım ve render

| Sorun | Sırayla kontrol / çözüm |
| --- | --- |
| `ENOENT` ile manifest/kontrat/prompt/şablon eksik | MCP'yi yalnız `dist/` ile dağıtmayın. `designer/`, `prompts/` ve export/build çıktılarının tamamını aynı teslimden kurun; `execution-contract.md` MCP build sırasında üretilir. |
| Browser çalışıyor, export/katalogda `window is not defined` veya native import hatası | Adapter modülleri MCP'de Node içinde de yüklenir. [Adapter kabulüne](designer/docs/adapter-onboarding.md) göre gerçek public paket girişini ve import sırasında koşulsuz DOM erişimini kontrol edin; build başarısını katalog kabulü saymayın. |
| `DESIGNER_PROFILE_DIR is retired` | Eski process env anahtarını kaldırın; düzenlenebilir kurallar için [prompt geçiş rehberini](mcp/prompts/README.md) izleyin. Teknik kontratlar kendi yerinde kalır. |
| Eski/eksik bileşen veya metadata; kontrat revision hatası | Doğru adapterı export ettiğinizi kontrol edin, MCP build/restart yapın. Ajan katalog/kontrat overview ve gereken rehberleri yeniden okusun. |
| `DESIGN_CONFLICT` / `EDITOR_NOT_EDITABLE` | Açık ve düzenlenebilir tek Designer sekmesinde güncel `get_editor_context` hedef/sürümünü okuyun; işlemi bu bilgiyle yeniden hazırlayın. |
| Timeout/kopma/iptal sonrası yazma sonucu belirsiz | Yeni bir işlemle körlemesine tekrar yazmayın. Ajan önce aynı `requestId` ile `get_design_import` ve güncel `get_design` sonucunu kontrol etsin. |
| `isPersisted=false` / kayıt hatası | Tasarımı JSON olarak yedekleyin; tarayıcı depolama alanı ve izinlerini kontrol edin, kaydı yeniden deneyin. Kalıcılık doğrulanmadan kurulumu tamamlandı saymayın. |
| Render'da browser/URL eksik, login sayfası veya timeout | [Render kabulündeki](#kabul) URL, Chromium, sistem bağımlılığı ve servis kullanıcısını kontrol edin. MCP sunucusunun DNS/HTTPS erişimi ve izole browser'ın erişim yetkisi ayrıca doğrulanmalı. |

Sorun sürerse ekibe yalnız hata metnini, başarısız adımı, Node sürümünü, secrets içermeyen host/port bilgisini ve config/health/WS kontrol sonucunu iletin. `clientId`, token, cookie ve tam `.env` içeriğini paylaşmayın.

Teknik bağlantı ayrıntıları: [connection.md](designer/docs/connection.md). Yeni ZIP'in kapsamı kökteki `CHANGELOG.md` dosyasında; uygulama adımları [UPDATE.md](UPDATE.md) içinde.
