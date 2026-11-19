# ZIP ile güncelleme

Önce bu teslimin [kısa değişiklik notunu](CHANGELOG.md) okuyun. Başlangıç sürümü, değişen dosyalar ve ekipte özelleştirilmiş dosyaları birleştirirken gereken bilgiler burada yer alır.

Yeni ZIP’i ayrı bir klasöre açın. Node 20.12+ yeterlidir; taşıma aracı için npm install veya Git gerekmez. Aşağıdaki komutları **yeni ZIP’in kökünde**, `designer/` ve `mcp/` klasörlerinin yanında çalıştırın.

## 1. Kontrol edin

```sh
node scripts/update.mjs --from /projeler/mevcut-proje --check
```

`carry` eski projeden alınacak dosyaları listeler. Burada özellikle iki manifest/lock, ESLint, registry/env, deployment, adapter kayıtları, promptlar ve kullandığınız MCP istemci JSON’ını kontrol edin.
`replaced` aynı yolda içeriği değişen ve yeni ZIP’ten alınacak dosyaları, `omitted` eski projeye özgü olup atlanan dosyaları listeler (core veya açıkça hariç tutulan yollar).
`packageChanges` ve `unassigned` boş olunca çıktı hazırlanabilir. Dosya içerikleri/env değerleri yazdırılmaz. Bu adım dosya değiştirmez.

## 2. Güncel projeyi hazırlayın

```sh
node scripts/update.mjs --from /projeler/mevcut-proje --output /projeler/guncel-proje
```

Çıktı klasörü henüz var olmamalı; üst klasörü var olmalı. Araç yeni ZIP’in üzerine eski projeden seçilen uyarlamaları koyarak ayrı bir proje hazırlar. Hem eski proje hem açılan ZIP değişmeden kalır. Eski projenin çalışıyor olması dosyalarının anlık tutarlı olduğu anlamına gelmez; taşıma sırasında dosya düzenlemeyi durdurun.

| Yeni ZIP’ten | Mevcut projeden |
| --- | --- |
| Editör ve MCP uygulama kodu | `designer/src/adapters/`, ikon kaynağı ve adapter kayıtları dahil |
| Teknik kontratlar, yeni araçlar ve ürün rehberleri | `mcp/prompts/` çalışma kuralları |
| Yeni ürünün geri kalan dosyaları | İki projenin `package.json` ve mevcut lock dosyaları |
| | Env, registry, ESLint/TypeScript/build configleri; deployment/CI ve IDE ayarları |

`node_modules`, Git bilgisi, build/dist/cache/test çıktıları, `mcp/generated/` ve üretilmiş `designer-config.json` taşınmaz. Eksik eski lock dosyasının yerine yeni ZIP’in başka manifeste ait lock dosyası bırakılmaz.

Adapter ve prompt klasörleri mevcut projenin tam içeriğini korur; kaldırılmış bir kural/adapter yeni ZIP’ten tekrar eklenmez. Prompt README’si yeni sürümden gelir. `promptDifferences`, iki prompt setinin farklı dosyalarını listeler; yeni genel prompt iyileştirmeleri yeni ZIP’te incelenip istenirse ayrıca alınır. Araç eski temiz ZIP’i istemez ve üç yönlü metin merge’ü yapmaz; hangi prompt farkının ekip değişikliği olduğunu tahmin etmez.

## Standart config yolları ve özel dosyalar

Repo kökü, `designer/` ve `mcp/` altında şu yollar otomatik tanınır:

- `.env*`, `.npmrc`, paket/lock dosyaları, `.gitignore`, `.dockerignore`, `.editorconfig`.
- Mevcut projenin `AGENTS.md` ajan yönergeleri. Ekip bu dosyaların içeriğini kendi çalışma kurallarına göre yönetir.
- `*config.*`, `.eslintrc*`, `.prettierrc*`, `.stylelintrc*`; örneğin `tsconfig.json`, `toolchain.config.js`.
- Kök YAML dosyaları, `Dockerfile*` / `Containerfile*`, `Jenkinsfile*`, `.eslintignore`, `.prettierignore`.
- MCP istemcisinin `mcp/mcp.json`, `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json` dosyaları. Proje dışındaki kişisel IDE ayarları bu dosya taşımasının kapsamı dışındadır.
- `config/`, `deploy/`, `deployment/`, `deployments/`, `k8s/`, `helm/`, `openshift/`, `vendor/`, `.azure-pipelines/`, `.github/workflows/`, `.github/actions/`, `.circleci/`, `.vscode/`.
- `share/` ve `public/` statik kaynakları; üretilmiş bağlantı JSON’ı hariç.

Farklı isimde bir config veya ek deployment scripti için **mevcut projenin köküne** bir kez `update.paths.json` ekleyin:

```json
{
  "include": [
    "designer/team-settings.json",
    "designer/scripts/deploy.sh"
  ]
}
```

Liste dosya veya klasör yolu alır; glob kullanmaz. Kendisi de taşınır. Adapter/prompt altına yeni dosya eklemek için bu listeye kayıt gerekmez. Tanınmayan ve yeni ZIP’te bulunmayan özel dosyalar, alt klasör ve uzantıdan bağımsız olarak `unassigned` listesiyle işlemi durdurur. Taşımak istediğiniz yolları `include` listesine alın. Bilerek bırakmak istediğiniz eski dosyalar için aynı JSON'a örneğin `"exclude": ["docs/eski-kurulum.md"]` ekleyin. `exclude` yalnızca tanınmayan eski dosyalar için kullanılır. Ürün `src/` dosyaları, teknik kontratlar ve yeni ZIP’teki ürün scriptleri bu listeden ezilemez. Symlink takip edilmez.

## Paket farkı varsa

Ekibin ek paketleri ve dev/build komutları korunur. Yeni ZIP’in ortak dependencies/devDependencies/peerDependencies/optionalDependencies, overrides/resolutions, engines, paket türü veya zorunlu scriptleri mevcut manifestte karşılanmıyorsa araç hazırlamayı durdurur. Bu kontrol sürüm aralıklarının **metinsel karşılaştırmasıdır**, semver/peer uyumluluğu kanıtı değildir.

Rapordaki alanları iki `package.json` arasında inceleyin. Gerekirse mevcut projenin bir çalışma kopyasında manifesti uzlaştırıp lock dosyasını yeniden üretin; aracı o kopyadan tekrar çalıştırın. Sıradan editör değişikliğinde paket gereksinimleri aynıysa bu adım yoktur. Araç paket kurmaz, npm lifecycle scripti çalıştırmaz.

## 3. Kurun ve doğrulayın

Hazırlanan **çıktı klasöründe** [Proje kurulumu](SETUP.md) sırasını izleyin: paketler → uygun yerel/sunucu env ayarları → Designer build/export → MCP build/başlatma → IDE ve son kabul. Taşınan kurum paket/adapter/config eşlemelerini kullanın. Export ve üretilmiş bağlantı JSON'ını yeni kaynaklardan yeniden oluşturun.

Dosyaların taşınmış olması gerçek adapter/paket uyumluluğu veya deployment kabulü değildir; [yazma/geri okuma/kayıt kontrolünü](SETUP.md#kabul) tamamlayın. Tarayıcı IndexedDB’sindeki tasarımlar proje dosyası değildir; bu araç onları taşımaz. Public origin değişirse mevcut tasarımları uygulamanın JSON export/import yolu ile taşıyın.
