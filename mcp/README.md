# UI Designer MCP

Bu klasör bağımsız Node projesidir. Kurum tesliminde önce Designer reposunda adapterı kaydedip `npm run export:mcp -- /tam/yol/mcp` çalıştırın. Oluşan `generated/` dizinini bu repo ile commit edin. Dosyalar katalog, doğrulama, tasarım değişikliği ve dışa aktarma kodunu, recipe görsellerini ve yürütme sözleşmesini içerir. Bir sonraki export eski adapter çıktılarını kaldırır. `generated/export.json` export girdilerinin son commitini ve açılmış runtime dosyasının SHA-256 özetini içerir. Tekrarlanabilir bir teslim için temiz ve commitlenmiş Designer kaynaklarını kullanın.

Node 20.3+ kullanın. Bu repo kökünde:

```sh
npm ci
npm run build
DESIGNER_ALLOWED_ORIGINS=http://127.0.0.1:5173 DESIGNER_RENDER_URL=http://127.0.0.1:5173 npm run start:backend
```

Merkezi HTTP MCP `/mcp`, WebSocket `/ws` ve readiness `/health` aynı porttadır (yerelde 4854). IDE yapılandırmaları `designer/templates/` altında. Browser açıkken IDE'den katalog → validate → import → applied → get_design akışını doğrulayın. `npm start` ve `npm run start:backend` aynı HTTP sunucusunu başlatır; IDE bu sunucunun `/mcp` adresine bağlanır.

Kurumda Dockerfile, azure-pipeline.yml ve mf-oc-deploy.yml bu repo kökünde kalır. Pipeline'da havuz, branch, onaylı Node temel imajı, registry imaj yolu ve ortam değişkenlerini eşleyin. Bağımlılık registry'si özel ise build agent üzerinde NPM_CONFIG_USERCONFIG ile güvenli npm ayar dosyasını sağlayın. Release işi pipeline'ın yayımladığı drop/mf-oc-deploy.yml manifestini kurum süreciyle uygular. Uygulama adı, namespace, Route hostu, Designer HTTPS origin'i ortama özeldir. Render için kurumun Chromium ve sistem kütüphaneleri bulunan runtime imajını seçin, Playwright sürümüyle eşleyin ve poddan Designer'a HTTPS erişimini doğrulayın.

Deployment tek aktif pod kullanır. Yeniden dağıtımda kısa kesinti beklenir. MCP Route'unda HTTP MCP metot/header'ları ve WebSocket Upgrade iletilmeli. Tarayıcının origin'i allowlist içinde olmalı. Canlı tasarımlar tarayıcı IndexedDB'sinde tutulur.

Azure build agent Docker BuildKit ve image registry için push erişimine sahip olmalıdır. Release girdisindeki `__APP__`, `__NAMESPACE__`, `__MCP_HOST__`, `__DESIGNER_HOST__` değerlerini kurum repo kopyasında eşleyin. `__IMAGE__` işaretini pipeline build etiketiyle doldurur.
