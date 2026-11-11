# UI Designer — ayrı sunuculara kurum dağıtımı

`designer/` ve `mcp/` bağımsız proje kökleridir; içeriklerini gizli dosyalar dahil ayrı repolara alın. Her proje kendi bağımlılıklarını kurar, kendi pipeline'ıyla derlenip dağıtılır. Ortak disk veya yan yana klasör zorunluluğu yoktur.

## Bağlantı ve ortam ayarları

- **Designer:** React uygulaması; derleme çıktısı `build/` statik olarak HTTPS üzerinden sunulur.
- **MCP:** Node servisi; IDE `https://<MCP host>/mcp`, Designer'ın açık olduğu **kullanıcı tarayıcısı** `wss://<MCP host>/ws` adresine bağlanır. Servis kontrolü `/health` üzerinden yapılır.

| Nerede? | Ayar | Değer / dikkat edilecek nokta |
| --- | --- | --- |
| Designer | `__BACKEND_WS_KEY__` | Kurum SDK'sının gerçek frontend env anahtarıyla değiştirin. Değeri `wss://<MCP host>/ws`. Anahtar adı `.env.example`, `piri-settings.json` ve `src/utils/backendBridge/config.ts` içinde aynı olmalı. |
| Designer | `piri-settings.json` | Her ortamın namespace, Designer route hostu ve env değerlerini eşleyin. İlk kurulumda route path ve `__BASE_PATH_KEY__` değeri `/` olsun. |
| MCP runtime | `DESIGNER_ALLOWED_ORIGINS` | Tarayıcıdaki Designer origin'i: `https://<Designer host>`. Path/son slash eklemeyin; birden fazla origin varsa virgülle ayırın. |
| MCP runtime | `DESIGNER_BIND_HOST`, `PORT` | Container için `0.0.0.0` ve `4854`; Service/targetPort aynı portu kullanmalı. |
| MCP runtime, isteğe bağlı | `DESIGNER_RENDER_URL` | Görsel karşılaştırma kullanılacaksa MCP'den erişilebilen `https://<Designer host>/`. Origin'i yukarıdaki allowlist'te olmalı; query/hash içermemeli. |

Frontend env değerleri kullanıcıya açıktır. WS adresini yalnız container env'ine eklemek yetmez: SDK build'i veya kurumun desteklediği init mekanizması değeri JS bundle'a aktarmalıdır. Adres değişiminde yeniden build/dağıtım yapıp tarayıcının gerçek `/ws` hedefini kontrol edin. `clientId` veya registry parolası bu değerlere yazılmaz.

## Derleme ve iki proje arasındaki bağımlılık

1. Önce [Designer kurum kurulumundaki](designer/installation/README.md) paket/CLI/env eşlemelerini ve gerçek kurum adapterının `UI_ADAPTERS` kaydını tamamlayın. Yer tutucularla veya boş adapter kaydıyla çalışan teslim beklenmez. Designer'ın `piri-settings.json` ve `.azure-pipelines/` dosyalarını mevcut ortak CI/CD şablonuna bağlayın.
2. Commitlenmiş Designer kaynaklarından, **Designer repo kökünde** `npm run export:mcp -- /tam/yol/mcp-reposu` çalıştırın. Üretilen `mcp/generated/` içeriğini MCP reposuna commit edin. Bu çıktı adapter kataloğu, recipe görselleri ve ortak tasarım runtime'ını taşır; çalışma anında Designer kaynak reposuna erişim gerekmez.
3. Adapter/kontrat/ortak runtime veya recipe değiştiğinde exportu yenileyin; Designer ve MCP'yi uyumlu kaynak sürümleriyle yayımlayın. `generated/export.json` kaynak commit/hash bilgisini içerir. Ortak pipeline'a repo arası otomasyon eklemek zorunlu değildir; export ve commit yerelde yapılabilir.
4. MCP kendi kökünde `npm ci` ve `npm run build` ile hazırlanır; HTTP servis komutu **`npm start`** veya eşdeğeri `npm run start:backend` komutudur. Node en az 20.3 olmalı. [MCP dağıtım dosyalarında](mcp/README.md) build pool, branch, onaylı `NODE_IMAGE`, registry, namespace ve host yer tutucularını eşleyin. Pipeline imajı ve manifesti üretir; release işi manifesti uygular. Özel npm erişimi build secret olarak sağlanır.

## Lokal geliştirme

Kurum paket/CLI/adapter eşlemesinden sonra MCP klasöründe `npm run build && npm start`, Designer klasöründe SDK’nın frontend env anahtarını `ws://127.0.0.1:4854/ws` olarak ayarlayıp `npm run dev` çalıştırın. IDE HTTP MCP adresi `http://127.0.0.1:4854/mcp` olur. Lokal ve sunucu aynı bağlantı modelini kullanır; IDE process başlatmaz. WS ayarı eksikse MCP bağlantısı kapalı kalır, elle tasarım ve JSON export çalışır.

## Ağ, render ve çalışma sınırları

- Kullanıcı tarayıcısı Designer HTTPS ve MCP WSS adreslerine, IDE MCP HTTPS adresine erişebilmeli. DNS/TLS zinciri bu istemcilerde güvenilir olmalı; uzak dağıtım adreslerinde `localhost` kullanılmamalı.
- MCP proxy/Route, `/mcp`, `/ws`, `/health` yollarını korumalı; WebSocket Upgrade, uzun bağlantılar ve MCP metot/header'ları (`mcp-session-id` dahil) iletilmeli. Designer CSP kullanıyorsa `connect-src`, MCP WSS adresine izin vermeli.
- **Render opsiyoneldir:** MCP imajında kurulu Playwright sürümüyle uyumlu Chromium ve sistem kütüphaneleri bulunmalı. MCP sunucusundan Designer'a HTTPS erişimi ve güvenilir sertifika gerekir. İzole tarayıcı mevcut kullanıcının SSO oturumunu devralmaz; giriş sayfasına yönlenen URL render için yeterli değildir. Font/görsellerin render tarafından yüklenebildiğini ayrıca doğrulayın. Render kurulmasa da katalog ve canlı düzenleme çalışabilir.
- MCP şu an **tek aktif pod** (`replicas: 1`, `Recreate`) içindir; yeniden dağıtımda kısa kesinti olur. Replikayı artırmayın. Tasarımlar sunucu DB'sinde değil kullanıcı tarayıcısının IndexedDB'sindedir; Designer origin'i değişirse kayıtlar yeni origin'e otomatik taşınmaz.
- Canlı okuma/düzenleme için ilgili Designer tarayıcıda açık ve bağlı olmalı. IDE'ye verilecek gizli `clientId`, Designer'ın **Gelişmiş → MCP bağlantısı** alanından alınır; env/repo/log'a konulmaz. Uygulamada ayrı kullanıcı login/OAuth katmanı yoktur; kurum erişimini ağ/geçit politikasıyla sınırlandırın. Origin allowlist tek başına kimlik doğrulama değildir.

## Yayın sonrası kısa kabul

`/health` → Designer'da WSS bağlantısı → [IDE HTTP MCP ayarı](mcp/designer/templates/mcp.vscode.example.json) → kurum komponentini katalogdan sorgulama → `validate_design` → `import_design` sonucu `applied` ve `isPersisted=true` → `get_design` ile eklenen frame'i okuma. Render kullanılacaksa ayrıca bir frame görüntüsü alın. Yalnız `/health` başarısı uçtan uca kabul değildir.

Ayrıntılar: [iki repo teslim sırası](designer/DEPLOYMENT.md) · [SDK eşlemesi](designer/docs/sdk-toolchain.md) · [MCP kurulumu](mcp/README.md). Gerçek kurum CI/CD, TLS/proxy ve IDE kabulü kurum ortamında yapılmalıdır.
