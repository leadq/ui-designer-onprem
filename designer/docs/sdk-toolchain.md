# Kurum paketleri ve derleme araçları

Teslim [kök manifestinde](../package.json) kurum paket adları/sürümleri yer tutucudur. Gerçek derleme aracı paketi, ortak tip paketi, CLI, env anahtarları ve config dosya adını [kurulumun ilk adımında](../installation/README.md) eşleyin. Sonraki npm install bu gerçek adları kurar; yer tutucularla install/build çalıştırmayın. MCP manifesti (MCP reposunda `package.json`) bağımsız araçlarını tanımlar. Derleme aracının ve UI library'sinin transitif/peer gereksinimlerini koruyun.

Kök lock dosyası eski yerel tarball referansları nedeniyle teslimde yoktur. Doğru registry ayarıyla ilk `npm install` sonrasında yeni lock oluşturup sabitleyin. MCP'nin bağımsız lock'u korunur. Her repoda bağımlılıkları ayrı kurun; sonraki aynı sürüm kurulumlarında `npm ci` kullanın.

Frontend lint, tip kontrolü ve bundler standart geliştirme/derleme komutunun sorumluluğundadır. Projede ayrı bir lint paketi veya kopyalanmış temel kural seti tutulmaz; yerel lint dosyası yalnız uygulamaya özgü sınırları ve kapsamı belirtir. Kök manifest lint motorunun uyumlu sürümünü bildirir; parser/plugin bağımlılıkları derleme aracından gelir.

MCP ayrı bir Node hedefidir. Designer’daki `npm run build` sadece frontend’i derler. Designer’daki `npm run export:mcp -- /tam/yol/mcp` esbuild ile adapterı aktarır. MCP kendi TypeScript derleyicisiyle `npm run build` çalıştırır. Ayrı lint/typecheck komutları yoktur. Testler bu teslimde yoktur; geliştirme ortamında gerektiğinde kurumun ayrı test paketi kullanılır.

Kök manifestteki override kayıtları, transitif bağımlılıkların registry sürümlerine yönlendirilmesini ve ortak runtime sürümlerinin tutarlılığını sağlar. Gerçek kurum paketleriyle temiz kurulumu doğrulayın; eski tarball'ları geri kopyalamak gerekmez.

React ve ReactDOM derleme araçlarının bağımlılık ağından gelir; runtime ve tip sürümleri kök manifestte sabitlenir. Frontend TypeScript motoru derleme aracının peer bağımlılık ağından gelir; sürüm uyumu kök override kaydıyla korunur. Bootstrap/createRoot/HTML/router/provider kurulumu mevcut derleme altyapısına aittir; `src/main.tsx` default App export eder. Rspack CLI, `@root` aliası ve `build/` çıktısı kullanılır.

Frontend derleme değişkenleri [.env.example](../.env.example) içinde tanımlıdır. Merkezi bağlantı ayarları için [deployment sırasını](../DEPLOYMENT.md) izleyin. Backend adresi değişince frontend yeniden build edilir; browser clientId değeri env dosyasına veya frontend paketine yazılmaz.
