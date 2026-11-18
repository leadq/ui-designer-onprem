# İkon adapterının katalog bilgisi

Kurumun ikon kullanım açıklamalarını, görsel ipuçlarını ve tariflerini `src/adapters/iconLibrary/<kurum>/` altındaki `IconLibrary` nesnesinin **`componentMeta`** alanında tutun. `src/adapters/iconLibrary/index.ts` bu nesneyi `DESIGN_ICON_LIBRARY` olarak seçer. Ortak `src/registry/designIconRegistry.ts` bu bilgiyi bütün aktif UI adapterlarının tek `icon` bileşenine aktarır.

`componentMeta` isteğe bağlıdır. Alan eklenmemiş eski ikon adapterları çalışmaya devam eder. Eksik `description` ortak açıklamayı kullanır; `visualHints` ve `recipes` yalnız tanımlandığında eklenir. Her alanın değeri kaynaktan alınır; tarif dizileri başka bir kayıtla otomatik birleştirilmez. Bileşenin renderer, propsSchema, varsayılan, boyut ve export kuralları ortak kayıtta kalır.

| Alan | İçerik |
| --- | --- |
| `componentMeta.description` | Bağımsız ikon bileşeninin hangi işi karşıladığı |
| `componentMeta.visualHints` | Görünür ipuçları; özellikle bağımsız ikon ile başka kontrolün kendi ikonunu ayırmaya yardımcı gözlemler |
| `componentMeta.recipes` | `ComponentRecipe[]`: id, title, when, instructions, example; isteğe bağlı avoid/images |
| `entries[].keywords` | Tek bir simgeyi ikon aramasında bulmak için eş anlamlılar; bileşen tarifi değildir |

Örneği mevcut `IconLibrary` nesnesine uyarlayın. `team:Search` yerine kurum kataloğunda gerçekten bulunan `libraryId:iconId` değerini kullanın; mevcut entries/load/getExportConfig eşlemesini koruyun.

```ts
componentMeta: {
  description: 'Kurum ikon kataloğundan bağımsız bir simge gösterir.',
  visualHints: [
    'Küçük bir simge metnin yanında bağımsız içerik olarak görünebilir.',
    'Bir kontrolün içindeki simge o kontrolün prop veya slotuyla sağlanabilir; önce kontrolü incele.',
  ],
  recipes: [{
    id: 'standalone-symbol',
    title: 'Bağımsız simge',
    when: 'Simge başka bir kontrolün native parçası olmadan gösteriliyor.',
    instructions: ['search_icons ile kayıtlı simgeyi bul ve tam kimliğini props.glyph alanına ver.'],
    example: {
      id: 'example-search',
      type: 'icon',
      props: { glyph: 'team:Search', size: 24, accessibleLabel: 'Ara' },
      style: {},
      children: [],
    },
  }],
},
```

Tarifleri aynı ikon adapterının içinde ayrı dosyalara ayırıp `componentMeta.recipes` dizisine import edebilirsiniz. `example.type` her zaman `icon` olmalı ve örnek, ortak ikon kontratındaki prop'ları kullanmalıdır. Başka bir bileşenin native ikon prop/slot eşlemesini o bileşenin kendi metadata'sında anlatın.

Görsel eklenirse mevcut [recipe görsel sözleşmesi](designer-agent.md#recipe-referans-görselleri) geçerlidir: PNG dosyaları `src/adapters/<uiAdapterId>/recipes/icon/<recipeId>/screenshots/` altında export edilir. İkon kaynağının altındaki PNG'ler otomatik export edilmez. Birden çok UI adapterında aynı görsel kullanılacaksa dosyanın her ilgili UI adapterının bu yolunda bulunması gerekir.

## Ortak registry'ye yazılmış kurum bilgisini taşıma

1. Eski kurum projesindeki `src/registry/designIconRegistry.ts` dosyasından kuruma ait `description`, `visualHints` ve `recipes` bilgilerini alın; ilgili recipe importlarını da takip edin.
2. Bu üç alanı aktif ikon adapterının `componentMeta` alanına birleştirin. Recipe dosyalarını ve gereken importlarını korunan `src/adapters/` ağacına taşıyın. `displayName`, `renderer`, `propsSchema`, `defaultProps` ve export davranışı bu metadata alanına eklenmez; bu kısımlarda kurum değişikliği varsa ayrıca karşılaştırın.
3. Yeni teslimin `src/types/iconLibrary.ts` ve `src/registry/designIconRegistry.ts` dosyalarını kullanın. ZIP taşıma aracı yeni ortak kaynakları alır ve kurumun `src/adapters/` ağacını korur. Eski registry'deki serbest kodu semantik olarak taşımaz; ilk metadata taşıması bir kez yapılmalıdır. Migration çıktısında bilgi yoksa kaynağı eski kurum klasöründen alın.
4. Designer build ve `npm run export:mcp -- /tam/yol/mcp` sonrasında MCP build'ini çalıştırın, sunucuyu güncel çıktıyla yeniden başlatın. `get_design_contract` overview yanıtında `icon` açıklama/ipucunu; aynı `contractRevision` ile details ve `componentTypes: ['icon']` yanıtında tarifleri kontrol edin. Recipe örneğini geçerli bir belgeye ekleyip `validate_design` ile doğrulayın.

Tamamlanma ölçütü: metadata kurumun korunan adapter dosyasında bulunur, gerçek MCP yanıtında görünür ve örnek kayıtlı glyph/prop'larla doğrulanır. Kurum projesi erişilebilir değilse ilk taşımanın yapıldığını varsaymayın.
