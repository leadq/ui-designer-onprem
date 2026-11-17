# Mevcut kurum adapterının bileşen tanımlarını güncelle

Bu görevi kurumun Designer reposunda uygula. Amaç, bir ekranı inceleyen ajanın bileşenin adını bilmeden onu MCP kataloğunda bulabilmesi ve görünen parçaları kurumun desteklediği prop, slot veya alt bileşenlerle kurabilmesidir. Kullanıcı belirli bileşenler verdiyse onları, aksi hâlde hedef kurum adapterının kayıtlı bileşenlerini incele.

## Doğru kaydı bul

Yollar Designer proje köküne göredir. `src/adapters/index.ts` içindeki `UI_ADAPTERS` kaydından kurumun `adapterId` değerini ve kullandığı registry'yi bul. Her `type` için mevcut `ComponentMeta` tanımının geldiği dosyayı takip et. Tanımları o dosyada veya ilgili ailenin zaten kullandığı ortak tanımda güncelle. Yerel tipler `src/types/componentContract.ts` ve `src/types/propSchema.ts` içindedir.

Her bileşenin kurulu sürümdeki native prop tiplerini, renderer'ını, export eşlemesini ve varsa çalışan kullanım örneğini karşılaştır. Tekrarlanan düzenlerde hangi parça sabit, hangisi içerik, varyant veya durumla değişiyor? Bu parçayı özel bir bileşenin mi, genel bileşenin bir varyantının mı, yoksa birden fazla kayıtlı bileşenin mi sağladığını kaynaktan doğrula. Mevcut doğru tanımları, kimlikleri, prop/slot adlarını ve varsayılanları koruyarak eksik bilgiyi tamamla.

## Her bileşende hangi alanı dolduracaksın?

| Alan | Ne yazılır? | MCP'de nerede okunur? |
| --- | --- | --- |
| `ComponentMeta.description` | Bileşenin hangi işi karşıladığını bir cümleyle yaz. Özel bir türse onu genel bileşenden ayıran kullanımını belirt. | İlk katalog özeti |
| `ComponentMeta.visualHints` | Ekranda görülebilen, benzer adayları ayıran birkaç kısa ipucunu `string[]` olarak yaz. Sınırın nereye kadar uzandığı, parçaların birlikte hizalanması veya içerik değişirken hangi düzenin korunduğu iyi ipuçlarıdır. | İlk katalog özeti |
| `propsSchema[].description` | Her sunulan prop'un hangi parçayı yönettiğini, seçeneklerin anlamını, önemli varsayılanı ve varsa koşulunu yaz. Alan ailesinde etiket, yardım, hata veya sıralama desteğini her ilgili tür için doğrula. | Seçilen bileşenin ayrıntıları |
| `ComponentMeta.recipes` | Bir görünümün hangi gerçek prop, slot veya `children` bileşimiyle kurulacağı karışabiliyorsa kullanım tarifi ekle. Basit bir bileşen için açıklama ve ipuçları yeterli olabilir. | Seçilen bileşenin ayrıntıları |

Örneğin düğmenin etrafını dolaşan çizgi ile iki içerik bölgesi arasında uzanan çizgi farklı adaylara götürür. Bitişik kutuların ortak dış kenarı bir grubu düşündürebilir. Kutuların tek seçim mi yoksa bağımsız eylemler mi sunduğunu gerçek API veya kullanım örneği belirler. Bu ayrım kurulumu değiştiriyorsa koşulu recipe'nin `when` alanına yaz. Görünür bir ayırt edici işaret doğrulanamıyorsa `visualHints` boş kalabilir. `searchKeywords` palet aramasındaki eş anlamlı adlar içindir.

## Bir bileşen ve kullanım tarifi örneği

Aşağıdaki kesit, `textInput` türünün `label` ve `description` metin prop'larını gerçekten desteklediği bir adapter içindir. Alanları kurumun kendi kaydına birleştirirken mevcut `propsSchema` ve `recipes` öğelerini koru.

```json
{
  "description": "Etiketi ve yardımcı açıklamasıyla tek satırlık metin girişi sağlar.",
  "visualHints": ["Farklı alan adları ve kısa yardım metinleri giriş kutularıyla aynı hizada tekrarlanabilir."],
  "propsSchema": [
    {
      "key": "description",
      "label": "Yardım metni",
      "type": "text",
      "defaultValue": "",
      "description": "Bu giriş alanına ait yardımcı metni gösterir. Boşken açıklama görünmez."
    }
  ]
}
```

Burada `propsSchema[].description` ajana prop'un anlamını açıklar. Tasarımda kullanıcıya gösterilecek metin ise aşağıdaki örnekteki `props.description` değeridir.

Tarifi `src/adapters/<adapterId>/recipes/<componentType>/<recipeId>/recipe.ts` içinde tut. Bu örnekte `textInput.ts`, `labelDescriptionRecipe` tanımını `./recipes/textInput/label-description/recipe` yolundan import eder. İlk tarifse `recipes: [labelDescriptionRecipe]` yaz, mevcut tarifler varsa aynı diziye ekle. Tarif kimliği bileşen içinde tekil olmalı ve `example.type` kayıtlı türle eşleşmelidir.

```ts
import type { ComponentRecipe } from '@root/types/componentContract'

export const labelDescriptionRecipe: ComponentRecipe = {
  id: 'label-description',
  title: 'Etiket ve yardımcı metin içeren alan',
  when: 'Etiket ve yardım metni aynı giriş alanına ait.',
  instructions: ['Etiketi label, yardımcı metni description prop’una ver. İkisini de alanın kendisi çizer.'],
  avoid: ['Birkaç alanı birlikte açıklayan bir notu form grubunda tut.'],
  example: {
    id: 'example-email',
    type: 'textInput',
    props: { label: 'E-posta', description: 'İş adresinizi girin.' },
    style: {},
    children: [],
  },
}
```

Recipe'de `id`, `title`, `when`, `instructions` ve `example` kullanılır. `avoid` ve referans görselleri (`images`) isteğe bağlıdır. Kurum bileşeni aynı rolü adlandırılmış bir slotla sağlıyorsa örnekte gerçek slot adını ve `slots` altındaki geçerli düğümleri kullan. Bir özelliği destekleniyor olarak anlatmak için adapterın onu render ve export edebildiğini doğrula. Yalnız native pakette bulunan bir özellik için eksik eşlemeyi raporla.

## Güncellemeyi gerçek katalogda doğrula

1. Designer kökünde projenin build'ini ve `npm run export:mcp -- /tam/yol/mcp` komutunu çalıştır. MCP kökünde `npm run build` çalıştır ve güncel çıktıyla yerel MCP sunucusunu başlat. Katalog tanımları bu export ile Designer'dan MCP'ye geçer.
2. `get_design_contract({ adapterId, phase: "overview" })` çağrısında `catalog.components` içinden bir görünümü bileşen adını söylemeden bulmayı dene. Adayın `description` ve `visualHints` alanlarında onu seçtiren gözlemi göster.
3. Aynı yanıttaki `contractRevision` ile `get_design_contract({ adapterId, phase: "details", contractRevision, componentTypes: [adayType] })` çağrısını yap. Birbirine benzeyen adaylar varsa türlerini aynı isteğe ekle. Seçimi doğrulayan prop/değer, slot veya recipe'yi göster. Tarifin anahtarlarını `authoring.acceptedPropKeys` ve `authoring.slotKeys` ile karşılaştır. Her yeni ya da değişen recipe'nin örneğini geçerli bir frame ve akış içeren belgeye yerleştirip `validate_design` ile doğrula. Sahiplik veya görünüm bilgisi için çalışan bileşen ve React çıktısını karşılaştır.
4. Sonuçta adapter kimliğini, güncellenen bileşenleri ve dosyaları, katalogda doğruladığın örnek bir eşlemeyi ve açık kalan destek eksiklerini kısaca bildir. MCP ortamına erişemediysen hangi kontrolleri yerelde tamamladığını belirt.
