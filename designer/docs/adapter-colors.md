# Adapter renk paleti

Her UI library kendi `src/adapters/<library>/colors.ts` dosyasını sağlar.
`src/adapters/index.ts` içindeki kendi kaydına `colors` eklenir. Başka
adapterın paleti kullanılmaz. Palet yoksa renk bölümü gösterilmez.
Editor UI renkleri bu paletten etkilenmez.

## Kurum kütüphanesi örneği

Aşağıdaki paket/import yolu temsildir; gerçek paketin yayımladığı yolu yazın.
Sass ve CSS değişkenlerinin adlarının aynı olması gerekmez.

```ts
import type { ColorToken } from '@root/utils/colorTokens/types'

export const corporateColors: ColorToken[] = [
  {
    id: 'primary-red',
    label: 'Primary red',
    group: 'Ana renkler',
    cssValue: 'var(--color-primary-red)',
    sass: {
      variable: '$color-primary-brand-red',
      importPath: '@company/ui/assets/common/colors',
    },
    usages: ['backgroundColor', 'color', 'borderColor'],
  },
  {
    id: 'primary-white',
    label: 'Primary white',
    group: 'Ana renkler',
    cssValue: 'var(--color-primary-white)',
    usages: ['backgroundColor', 'color', 'borderColor'],
  },
]
```

Adapter kaydında `colors: corporateColors` verin. CSS değişkenlerini tanımlayan
kütüphane stil dosyasını adapter Provider girişinde **açıkça import edin**.
Palet örnekleri sağ panelde de gösterildiğinden değişkenler yalnız native
bileşen altına değil, editor belge kökünde erişilebilir olmalıdır. Exportu
tüketen uygulama da aynı CSS'i import eder. SDK/Rspack'e otomatik Sass import
veya kaynak tarama ayarı eklenmez.

`cssValue` düz CSS rengi de olabilir; mevcut Mantine/MUI/Ant örnekleri kendi
native tema değerlerinden üretilir. CSS değişkeni kullanıldığında hex'e
çevrilmez: tema değiştiğinde aynı referans yeni değeri kullanır.
Sass yalnız derleme zamanında vardır. Designer tarayıcıda `$...` çözmez;
opsiyonel `sass` alanı hedef SCSS üretimi içindir. Agent bu yolu import eder
ve ilgili değişkeni kullanır. TSX ara çıktısı CSS değerini kullanır.

## Alanlar ve kullanım

- `id`: adapter içinde benzersiz, kalıcı kimlik; yeniden adlandırma eski belgeleri etkiler.
- `label`: kullanıcıya gösterilen isim; istenirse doğrudan değişken adı yazılır.
- `group`: seçicide grup başlığı; palet sırası korunur.
- `cssValue`: native köke ve renk örneğine uygulanacak CSS değeri.
- `usages`: bu rengin seçilebildiği özellikler; arka plan/yazı/kenarlık.
- `sass`: isteğe bağlı hedef kod eşlemesi; runtime veya bundler talimatı değildir.

Sağ panel > Düzen > Renkler'de özellik başlığı açılır. Aynı anda bir seçici
açıktır; iki sütunlu liste arama ve sanal kaydırma kullanır. Kapalı listeler
mount edilmez. Seçim anında uygulanır; geri alınabilir. Sıfırlama aktif
breakpoint override'ını kaldırır, üst katmandan/native temadan mirası geri getirir.
Kenarlık rengi kendiliğinden kenarlık kalınlığı/stili oluşturmaz.
Native component renk propları ayrı semantiğini korur; kök dışındaki native
alt parçalar otomatik boyanmaz.

## JSON, preview ve export

```json
{
  "styleTokens": { "backgroundColor": "primary-red" },
  "responsiveStyleTokens": { "lg": { "color": "primary-white" } }
}
```

Alanlar bileşen node'una aittir; frame/flow'a yazılmaz. Şema v14.
Katalog `colorPalette` ve `authoringContract.colorTokens` üzerinden keşfedilir.
Ham `style.color` veya rastgele hex token ID kabul edilmez. Responsive sıra
base/xl → wide → lg → md → sm → xs; alt görünüm üst değerleri miras alır.
Tokenlar native root üzerinde layout/default stilden sonra uygulanır.

Nested/flat aynı kimliği korur. TSX base CSS değerini ve
`data-designercolortokens` / `data-designerresponsivecolortokens`
aktarır; ara çıktının responsive metadata'sını hedef uygulama media query'ye
çevirmelidir. MCP hedef üretiminde paletten Sass eşlemesi alınabilir.
Adapter değişiminde tokenlar isim benzerliğine göre çevrilmez; bilinmeyen
ID doğrulamada reddedilir. Adapter kaldırılırken colors dosyası ve kayıt importu
diğer native kaynaklarla birlikte taşınır.

## Kabul

Jest: color-tokens.test.ts, color-mcp.test.ts, tests/unit/colors.
Playwright: src/adapters/tests/e2e/color-tokens.spec.ts.
Bu testler aktif adapter keşfini kullanır; yeni library için sabit liste eklenmez.

## Library varsayılan zemini

UIAdapter kaydındaki isteğe bağlı `backgroundColor`, aynı adapterın `colors`
paletinde `backgroundColor` kullanımına izin verilen bir token ID'sidir.
Örneğin `backgroundColor: 'gray.0'`. Palet hover örneği, tüm responsive frame
zeminleri ve ayrı önizleme/capture alanı aynı tokenın `cssValue` değerini kullanır.
CSS variable referansı korunur; ilgili değişkenler document root'ta erişilebilir olmalıdır.
Alan yoksa veya eşleşen izinli token bulunamazsa yüzeyin nötr editör zemini kullanılır.
Noktalı çalışma alanı ve editör toolbarları library rengine boyanmaz.
Native bileşenlerin kendi arka planları ve açık styleTokens seçimleri korunur.

Bu varsayılan adapter metadata'sıdır; frame/flow içine stil veya yeni JSON alanı
kaydedilmez. Eski belgeler de aktif adapterın güncel varsayılanını kullanır.
MCP kataloğundaki `backgroundColor` izinli token ID'sini (yoksa `null`) bildirir.
Hedef uygulamada preview ile aynı sayfa zemini isteniyorsa bu token sayfa yüzeyine
uygulanır; node TSX exportu kendiliğinden bir sayfa arka planı eklemez.

## Native font ve tema

Paket fontu zaten `@font-face` ile yüklüyorsa adapter içinde o aileyi seçmek yeterlidir.
Library'nin tema API'sini veya kendi bileşen sınıflarını kullanın. Örneğin adı
`ekip-ui-` ile başlayan native sınıflar için adapterın `typography.module.scss` dosyası:

```scss
:global([class^='ekip-ui-']),
:global([class*=' ekip-ui-']) {
  font-family: 'EkipFontu', sans-serif;
}
```

Bu dosyayı aktif adapterın `Provider.tsx` dosyasından import edin. Örnekteki öneki ve font adını
paketin gerçek değerleriyle değiştirin. Library belirli bir input veya ikon için ayrı font
kullanıyorsa seçiciyi ilgili metin sınıflarına daraltın. Native sınıfı doğrudan hedefleyen
kural, dropdown içeriği body altına portal ile açıldığında da çalışır. Renkler için aynı
kapsamda paketin kendi tema değişkenlerini kullanın. Editör aynı sayfada kendi kontrol ve
portal köklerinde kendi tema değerlerini kullanır.

Core tema değişkenleri `--designer-*` adlarını kullanır. Kütüphanenin
`--primary`, `--text-primary` veya `--font-family` gibi değişkenleri kendisine aittir.

Paket geniş eleman seçicileri getiriyorsa düz SCSS girişinde ilgili kuralları
native alanla sınırlayın. Örneğin `src/adapters/<ad>/theme.scss` içinde:

```scss
@use '../../styles/mixins/library';

@include library.surface {
  :scope { font-family: var(--font-family); }
  button, input { color: var(--text-primary); }
}
```

Bu giriş adapter Provider tarafından bir kez import edilir. İçinde yalnız eleman
ve bileşen kuralları olan bir stil dosyasını aynı blokta Sass `meta.load-css`
ile yükleyebilirsiniz. Paket aynı CSS'i ayrıca global olarak yüklüyorsa o kopya
kapsam dışında kalır. `:root` ve `body` yerine yüzeyde `:scope` kullanın.
Native menüsü body altına portal açan paketlerde, adapterın kendi portal
container'ına da `data-designer-library` verin. `body` ortak kapsayıcıdır.
