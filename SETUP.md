# Proje kurulumu

Sıra: **1 → yerelde 2A veya sunucuda 2B → 2C**. Bir kontrol başarısızsa [3. bölümden](#sorunlar) düzeltip devam edin.

`designer/` ve `mcp/` ayrı proje kökleridir; komutları belirtilen klasörde çalıştırın. Ayrı repolardalarsa export komutundaki `../mcp` yerine gerçek MCP klasörünün tam yolunu kullanın. Mevcut kurulumu ZIP ile güncellemek için önce [UPDATE.md](UPDATE.md).

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

Adapter veya kontrat değiştiğinde bu sırayı tekrarlayın. Export edilen `mcp/generated/` dosyalarını MCP projesiyle birlikte teslim edin; izlenebilir export için Designer kaynakları commitlenmiş olsun.

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

1. **Designer ortamında** `DESIGNER_BACKEND_WS_URL=/ws` verin. MCP ayrı public hosttaysa bunun yerine `wss://mcp.example.com/ws` kullanın. HTTPS Designer için `wss` gerekir; sunucu kurulumunda `localhost` tarayıcının çalıştığı bilgisayarı gösterir.
2. **Designer kökünde** `npm run build`, ardından `npm run export:mcp -- ../mcp` çalıştırın. Bundle aracı `share/designer-config.json` dosyasını index sayfasının yanına kopyalamalıdır. Başka ortam için üretilmiş build kullanıyorsanız yayınlamadan önce, doğru ortam değişkeniyle `node scripts/configure.mjs /gercek/statik/dizin/designer-config.json` çalıştırın. [Alt dizin ve config ayrıntıları](designer/docs/connection.md).
3. **MCP kökünde** `npm run build` çalıştırın. Aşağıdakileri MCP'yi başlatan servisin/container'ın **ortam değişkenlerine** ekleyin; sonra `npm start` ile başlatın:

   ```dotenv
   DESIGNER_BIND_HOST=0.0.0.0
   PORT=4855
   DESIGNER_ALLOWED_ORIGINS=https://design.example.com
   ```

   `PORT` servis içi porttur; proxy hedefiyle aynı olmalı. Origin yalnız protokol + host + varsa port içerir, path içermez. Servis env yerine `.env` dosyası kullanacaksanız **MCP kökünden** `node --env-file=.env dist/backend/index.js` çalıştırın.
4. **Proxy/yayın ayarında** WebSocket Upgrade ve MCP oturum headerlarını iletin. Config JSON için cache'i kapatın; SPA fallback HTML'i dönmesin. CI/CD ve proxy yapılandırmasını ekip mevcut altyapısında yapar.
5. **Kontrol:** public Designer adresindeki `designer-config.json` doğru URL'yi, public MCP adresindeki `/health` `status: ok` yanıtını vermeli; Designer'da **Tasarım bağlantısı hazır** görünmeli. Alt dizine yayın varsa config de giriş sayfasının yanındadır: örneğin `/designer/designer-config.json`.

İsteğe bağlı render için MCP ortamına `DESIGNER_RENDER_URL` olarak erişilebilir Designer URL'sini verin; [MCP render gereksinimlerini](mcp/README.md#ortama-uyarlama) tamamlayın. Temel bağlantı hazırsa devam edin.

<a id="ide"></a>
## 2C. IDE'yi bağlayın ve kimliği kullanın

1. IDE'nin **aktif MCP yapılandırmasına** HTTP sunucu kaydı ekleyin. URL:

   | Ortam | IDE HTTP MCP URL'si |
   | --- | --- |
   | Yukarıdaki yerel örnek | `http://127.0.0.1:4855/mcp` |
   | Yukarıdaki sunucu örneği | `https://design.example.com/mcp` |
   | Ayrı public MCP hostu | `https://mcp.example.com/mcp` |

   İstemcinin desteklediği biçimi kullanın; [genel örnek](mcp/mcp.json), [VS Code örneği](mcp/designer/templates/mcp.vscode.example.json). Repo içindeki örneği düzenlemek tek başına IDE'ye kayıt yapmaz. IDE gerektiriyorsa MCP bağlantısını yeniden yükleyip araçları etkinleştirin.
2. Designer tarayıcıda açık ve bağlıyken **Gelişmiş → MCP bağlantı kimliğini kopyala** seçin.
3. Kimliği IDE ajanına sohbette verin: “Bu `clientId` ile `get_editor_context` çağır ve `ready=true` olduğunu doğrula.” Kimlik `.env`, URL veya MCP sunucu config'ine yazılmaz.
4. **Kontrol:** IDE'nin gerçek araç çağrısı `ready=true` döndürmeli. `/health` yalnız servisi doğrular; bu son kontrol açık Designer'a erişimi doğrular. Kimliği kopyalamak bağlantı kurmaz; bağlı tarayıcıyı hedefler.

<a id="sorunlar"></a>
## 3. Troubleshooting

| Sorun | Sırayla kontrol / çözüm |
| --- | --- |
| `.env not found` | Komut MCP kökünde mi? Oradaki `.env.example` dosyasından `.env` oluşturun. Designer'ın `.env` dosyası ayrıdır. |
| `designer-config.json` diskte yok | Designer kökünde `npm run configure`; çıktı `share/designer-config.json`. |
| Config URL'si 404 veya HTML döndürüyor | Bundle/proxy `share/` içeriğini index yanında sunmalı. SPA fallback ve alt dizin yolunu kontrol edin. |
| Yanlış IP/port görünüyor | Designer `.env.local` ve terminal env önceliğini kontrol edin; configure/dev'i yeniden çalıştırın. MCP'yi `.env` yükleyen komutla yeniden başlatın. Browser'daki JSON'ı tekrar açın. |
| “Yerel bağlantı yok”, `/health` de açılmıyor | MCP terminalindeki başlangıç hatasını, dinlenen portu ve URL'yi kontrol edin; sunucuda proxy/ağ erişimini kontrol edin. |
| `/health` açık ama Designer bağlı değil | Config JSON doğru mu? Tarayıcı Network → WS isteği doğru `/ws` adresine gidiyor mu? 403 için Origin, HTTPS için `wss`, sunucuda WebSocket Upgrade ayarını kontrol edin. |
| `CLIENT_OFFLINE` | Önce Designer'da bağlantı hazır olsun. Açık Designer'dan kimliği yeniden kopyalayın. IDE `/mcp` ve Designer `/ws` aynı MCP sürecine ulaşmalı; eski kimlik veya farklı backend kullanmayın. |
| `Listener failed` / port kullanımda | Aynı portta çalışan kendi eski MCP sürecinizi kontrol edin. Port değişecekse MCP `PORT`, Designer WS URL ve IDE MCP URL'sini birlikte güncelleyin. |
| MCP build'de export/runtime eksik | Yapılandırılmış Designer'dan doğru MCP klasörüne `npm run export:mcp -- ../mcp`, ardından MCP'de `npm run build`. |

Teknik bağlantı ayrıntıları: [connection.md](designer/docs/connection.md). Yeni ZIP'in kapsamı kökteki `CHANGELOG.md` dosyasında; uygulama adımları [UPDATE.md](UPDATE.md) içinde.
