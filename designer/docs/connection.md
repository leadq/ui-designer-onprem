# Designer ve MCP bağlantısı

İlk kurulum, yerel/sunucu komutları ve troubleshooting için [Proje kurulumu](../../SETUP.md) ile başlayın. Bu belge bağlantının teknik ayrıntılarını açıklar.

Bağlantı adresi için kaynak dosyası veya env anahtar adı değiştirilmez. Designer ve MCP ayrı sunucularda çalışabilir. Önerilen yayın: tek public HTTPS origin; `/` Designer'a, `/ws`, `/mcp`, `/health` aynı aktif MCP process'ine yönlendirilir. İki servisin aynı makinede olması gerekmez.

## Designer

Node 20.12+ kullanın. `.env` veya `.env.local` içine yalnız public adresi verin:

```dotenv
# Aynı public origin, reverse proxy üzerinden:
DESIGNER_BACKEND_WS_URL=/ws

# Ayrı MCP hostu gerekiyorsa bunun yerine:
# DESIGNER_BACKEND_WS_URL=wss://mcp.example.com/ws

# Ayrı portlarda yerel geliştirme için:
# DESIGNER_BACKEND_WS_URL=ws://127.0.0.1:4854/ws
```

`npm run dev` ve `npm run build` öncesinde `configure` otomatik çalışır. Öncelik shell/CI env > `.env.local` > `.env`; değer verilmezse `/ws`. Üretilen `share/designer-config.json` build çıktısına kopyalanır. Paketleme aracınızın `share/` statik asset kopyalaması bu dosyayı da taşımalıdır; editör kaynaklarına özel DefinePlugin/env eşlemesi yapılmaz. Dev/build komutunu kendi paketinizle eşlerken `configure`, `predev`, `prebuild` scriptlerini koruyun.

Tarayıcı `designer-config.json` dosyasını uygulama giriş sayfasının yanından, cache kullanmadan okur. Uygulama `/designer/` altında yayınlanıyorsa dosya `/designer/designer-config.json` altında sunulur; giriş adresi sondaki slash'a normalize edilmelidir. `/ws` origin kökünü belirtir; farklı proxy yolu için `/gateway/ws` gibi açık yol verilebilir. HTTP sayfasında `ws`, HTTPS sayfasında `wss` kullanılır. Ayrı host adresi tam `ws://` veya `wss://` adresidir. HTTPS üzerinde güvensiz `ws://` kabul edilmez.

Dosya yoksa, HTML/bozuk JSON dönüyorsa veya ayar geçersizse MCP bağlantısı kapalı kalır; elle tasarım kullanılabilir. Başka sunucu/localhost tahmin edilmez. Ayarı düzeltip sayfayı yenileyin. Bu dosya için proxy/CDN cache'i kapatın; SPA fallback HTML'i yerine gerçek JSON sunun.

## Aynı build'i başka ortama taşıma

Statik dosyaları yayınlamadan önce Designer proje kökünde:

```sh
DESIGNER_BACKEND_WS_URL=wss://mcp.example.com/ws npm run configure -- build/designer-config.json
```

Bu işlem yalnız public config'i yeniden üretir; frontend'i yeniden derlemez. Gerçek çıktı dizininiz farklıysa o dizini verin. Script yalnız Node standart kütüphanesini kullanır, npm paket kurulumu gerektirmez; deployment ortamında `node scripts/configure.mjs /statik/dizin/designer-config.json` olarak da çalıştırılabilir. Env değeri statik dosyalara kendiliğinden geçmez: build hook'u veya bu deployment adımı çalışmalıdır. Kaynak dosyası elle düzenlenmez.

Config yalnız public WebSocket adresini içerir; registry tokenı, şifre ve browser clientId bu dosyaya/env anahtarına konmaz. URL içinde kullanıcı bilgisi, query ve fragment kabul edilmez.

## MCP ve IDE

MCP process'inin environment ayarları:

```dotenv
DESIGNER_BIND_HOST=0.0.0.0
PORT=4854
DESIGNER_ALLOWED_ORIGINS=https://design.example.com
DESIGNER_RENDER_URL=https://design.example.com
```

`DESIGNER_ALLOWED_ORIGINS` tarayıcıdaki Designer origin'idir; path içermez. Birden fazla origin virgülle ayrılır. `DESIGNER_RENDER_URL` isteğe bağlı görsel render için, MCP sunucusundan ulaşılabilen Designer URL'idir. Yerel HTTP kullanımında loopback adresi; uzakta izin verilen HTTPS adresi gerekir. MCP rootundaki `.env.example` örneklerini deployment env'sine aktarın; `npm start` process env'sini kullanır. Yerelde `.env` dosyası kullanıyorsanız build sonrası `node --env-file=.env dist/backend/index.js` çalıştırabilirsiniz (Node 20.12+).

IDE HTTP MCP kaydı `https://design.example.com/mcp` veya ayrı hostun `/mcp` adresidir. IDE ayarı editör kaynak kodu değildir. Reverse proxy WebSocket Upgrade ve MCP oturum headerlarını iletmeli; üç MCP yolu aynı aktif process'e ulaşmalıdır. Şimdiki kurulum tek aktif MCP process'i içindir.

## Güncellemede korunan yerler

Paket/lock ve registry ayarları, build/ESLint/TypeScript configleri, env, deployment/CI ve IDE ayarları, yazılmış adapterlar/ikon kaynağı ve MCP promptları proje uyarlamalarıdır. Editör bağlantı kodu ve ürün teknik kontratları yeni sürümden gelir. Üretilmiş `designer-config.json` ve MCP runtime exportu kaynak ayarlarından yeniden oluşturulur; eski build/runtime klasörleri taşınmaz. [ZIP taşıma aracı](../../UPDATE.md) mevcut uyarlamaları ayrı bir güncel proje klasöründe toplar.

Paket kurulumu → Designer build → `npm run export:mcp -- /tam/yol/mcp` → MCP build sonrasında tarayıcı bağlantısını ve IDE katalog/validate/import/readback akışını doğrulayın. `/health` tek başına browser/IDE kabulü değildir.
