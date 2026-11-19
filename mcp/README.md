# UI Designer MCP

**Paket kurulumu → yerel/sunucu ayarları → IDE bağlantısı → troubleshooting:** [Proje kurulumu](../SETUP.md). Designer ve MCP birlikte kurulurken Node 20.12+ kullanın.

Bu klasör bağımsız Node projesidir. Kurum tesliminde önce Designer reposunda adapterı kaydedip `npm run export:mcp -- /tam/yol/mcp` çalıştırın. Oluşan `generated/` dizinini bu repo ile commit edin. Dosyalar katalog, doğrulama, tasarım değişikliği ve dışa aktarma kodunu, recipe görsellerini ve yürütme sözleşmesini içerir. Bir sonraki export eski adapter çıktılarını kaldırır. `generated/export.json` export girdilerinin son commitini ve açılmış runtime dosyasının SHA-256 özetini içerir. Tekrarlanabilir bir teslim için temiz ve commitlenmiş Designer kaynaklarını kullanın.

`npm start` ve `npm run start:backend` aynı HTTP sunucusunu başlatır; **MCP `.env` dosyasını otomatik yüklemezler.** Dosyadan ayar yükleyen yerel komut [2A adımında](../SETUP.md#lokal), deployment env ile başlatma [2B adımında](../SETUP.md#sunucu) bulunur.

Bu klasörü ayrı repo olarak kullanıyorsanız: `.env` yoksa [.env.example](.env.example) dosyasından oluşturun; port ve Designer origin'ini kendi ortamınıza göre düzenleyin. Yukarıdaki Designer exportu hazırken bu proje kökünde sırayla `npm ci`, `npm run build`, `node --env-file=.env dist/backend/index.js` çalıştırın.

HTTP MCP `/mcp`, WebSocket `/ws` ve readiness `/health` aynı porttadır. IDE `/mcp` adresine bağlanır; yapılandırma örnekleri `designer/templates/` altında. Browser açıkken IDE'den katalog → validate → import → applied → get_design akışını doğrulayın.

## Ortama uyarlama

CI/CD, container imajı, registry, sunucu/platform ve release yapılandırması ekibin kendi çalışan projelerine göre hazırlanır. Bu repo deployment dosyası veya platform şablonu sağlamaz.

Uygulamanın bağlantı sözleşmesini koruyun: `/mcp`, `/ws` ve `/health` aynı aktif Node process'ine ulaşır; WebSocket Upgrade ve MCP oturum headerları iletilir. Browser origin'i `DESIGNER_ALLOWED_ORIGINS` içinde olmalıdır. Canlı oturum kayıtları process belleğindedir; tasarımlar tarayıcı IndexedDB'sinde tutulur. Bu sürüm tek aktif MCP process'iyle doğrulanmıştır.

İsteğe bağlı render için kurulu Playwright sürümüyle uyumlu Chromium/sistem kütüphaneleri ve MCP'den Designer adresine erişim gerekir. Gerçek kurum ortamının ağ, erişim ve uçtan uca kabulünü ekip tamamlar.

## Promptlar ve teknik kontratlar

[Prompt rehberi](prompts/README.md) Designer/kod üretimi ayrımını, otomatik Markdown keşfini, zorunlu içerik sunumunu ve eski profil geçişini anlatır. Düzenlenebilir kurallar `prompts/`; ürün kontratları `designer/contracts/` altındadır. Yeni kural için manifest veya agent dosyasına referans eklenmez.

## Designer bağlantı ayarı

Designer kaynak kodunda env anahtarı veya adres değiştirilmez. Sabit `DESIGNER_BACKEND_WS_URL` ayarı, otomatik `configure` adımıyla public runtime JSON’a yazılır. Aynı public origin için `/ws`, ayrı sunucu için tam `wss://…/ws` adresi verin. [Designer/MCP bağlantı rehberi](../designer/docs/connection.md) env, reverse proxy ve deployment adımlarını açıklar. MCP process env örneği [.env.example](.env.example) içindedir.
