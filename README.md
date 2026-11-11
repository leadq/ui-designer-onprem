# UI Designer — kurum teslimi

`designer/` ve `mcp/` bağımsız proje kökleridir. Her ekip bundle/config, CI/CD ve deployment düzenini kendi çalışan projelerine göre hazırlar. Bu teslim uygulama kaynaklarını, adapter kontratını ve MCP çalışma sözleşmesini içerir.

## Kurulum ve yerel çalıştırma

1. [Designer kurulumundaki](designer/installation/README.md) bundle paketi, ortak tip paketi, CLI/env ve gerçek kurum adapterı eşlemelerini tamamlayın. Bundle config dosyasını ekibin mevcut projesinden uyarlayın. Aktif adapter kaydı olmadan çalışan teslim beklenmez.
2. Designer kökünde `npm run build` çalıştırın. Commitlenmiş kaynaklardan `npm run export:mcp -- /tam/yol/mcp` ile MCP runtime'ını üretin. Adapter, kontrat veya recipe değişince exportu yenileyin; `generated/export.json` kaynak commit/hash bilgisini içerir.
3. MCP kökünde `npm ci && npm run build && npm start` çalıştırın. Node 20.3+ gerekir. Ayrıntılar [MCP rehberinde](mcp/README.md).
4. Designer'ın frontend WS env anahtarına `ws://127.0.0.1:4854/ws` verip `npm run dev` çalıştırın. IDE HTTP MCP adresi `http://127.0.0.1:4854/mcp` olur.

## Bağlantı sözleşmesi

| Nerede? | Ayar | Anlamı |
| --- | --- | --- |
| Designer | `__BACKEND_WS_KEY__` | Gerçek frontend env anahtarını `.env.example` ve `src/utils/backendBridge/config.ts` içinde aynı adla eşleyin. Değer MCP'nin `/ws` adresidir. |
| MCP | `DESIGNER_ALLOWED_ORIGINS` | Tarayıcıdaki Designer origin'i; birden fazlaysa virgülle ayrılır. |
| MCP | `DESIGNER_BIND_HOST`, `PORT` | Servisin dinleyeceği adres ve port. |
| MCP, isteğe bağlı | `DESIGNER_RENDER_URL` | MCP'nin erişebildiği, allowlist'te bulunan Designer adresi. |

Frontend env değerleri tarayıcıya açıktır. Bundle paketi bu değerleri JavaScript çıktısına aktarmalıdır. `clientId` ve registry kimlik bilgileri frontend env veya Git'e yazılmaz.

`/mcp`, `/ws` ve `/health` aynı aktif Node process'ine ulaşmalıdır. MCP metot/headerları ve WebSocket Upgrade korunur. Bu sürüm tek aktif MCP process'iyle doğrulanmıştır. Tasarımlar tarayıcı IndexedDB'sindedir; Designer origin'i değişince kayıtlar otomatik taşınmaz.

Canlı tasarım işlemleri için Designer tarayıcıda açık ve bağlı olmalıdır. Gizli `clientId` uygulamanın MCP bağlantısı alanından alınır. Origin allowlist kimlik doğrulama yerine geçmez; erişim politikasını ekip kendi ortamında uygular.

Render kullanılacaksa MCP ortamında kurulu Playwright sürümüyle uyumlu Chromium/sistem kütüphaneleri ve Designer'a erişim gerekir. İzole render tarayıcısı kullanıcının SSO oturumunu devralmaz.

## Uçtan uca kabul

Designer bağlantısı → IDE HTTP MCP bağlantısı → kurum bileşenini katalogdan okuma → `validate_design` → `import_design` sonucunda `applied` ve `isPersisted=true` → `get_design` ile aynı frame'i okuma. Render kullanılacaksa ayrıca görüntü alın. Gerçek kurum paketleri, adapterı ve ortamıyla bu kabulü tamamlayın.

[Bundle ve ortak tip paketi eşlemesi](designer/docs/sdk-toolchain.md) · [Adapter kurulumu](designer/installation/README.md) · [MCP çalıştırma](mcp/README.md)
