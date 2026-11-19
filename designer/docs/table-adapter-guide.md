# Yeni UI kütüphanesi için tablo adapter eşleme rehberi

> Bu teknik rehberdeki test komutları geliştirme reposuna aittir. Teslim branch’inde test runner yoktur; kurum adapterı kabulü docs/component-adapter-checklist.md üzerinden yapılır.

Bu rehber, ortak tablo tasarlama deneyimini başka bir UI kütüphanesinin **gerçek Table bileşenine** bağlayacak geliştirme agent'ı içindir. 18 Ekim 2026 kaynakları esas alınır. Önce [yeni-library onboarding](adapter-onboarding.md) ve [ortak kabul checklistini](component-adapter-checklist.md) oku.

Bu belge uygulama yol haritasıdır; JSON alanlarının yetkili kaynağı [belge/yürütme kontratı](contracts/README.md), metadata tipleri [componentContract.ts](../src/types/componentContract.ts), geçerli kabul sınırı [ortak validator](../src/utils/designer/componentContract/validateComponentContract.ts) ve [tablo validator'ıdır](../src/utils/tableAuthoring/validateTableContents.ts). Çelişki görürsen kaydet ve gider; rehberdeki örneği yeni bir kontrat sayma.

## 1. Aynı deneyim, native görünüm

Akış: **kullanıcı → ortak editör belgesi ↔ adapter ↔ native UI bileşeni**.

| Ortak editör / core | Adapter |
| --- | --- |
| Satır/sütun ekleme, silme, metin düzenleme | Gerçek Table ve zorunlu native alt parçalar |
| Hücrenin bütün bileşen ağacını bağımsız kopyalama | `children` veya `columns`/`dataSource`/callback eşlemesi |
| Seçim, sağ panel, menü, history, undo/redo | Native prop, ref, provider, DOM ve stil farkları |
| Stabil kimlikler, JSON doğrulama ve kayıt | Native TSX üretimi, importlar ve gereken CSS |
| Hücre tipini türetme, + kontrolleri ve zoom geometrisi | Gerçekten desteklenen yeteneği metadata ile bildirme |

Yeni library için ayrı tablo editörü, ayrı kopyalama motoru veya core içinde library adına göre koşul yazma. Native görünümü özel bir grid ile taklit etme. Her library'nin kendi görünümü kalır. Yeni library eklemek, mevcut bir library belgesini otomatik dönüştürmek değildir; `adapterId` ve native prop izolasyonunu koru.

## 2. Değişmeden taşınacak editör modeli

Bağımsız hücreli tablonun node alanları:

| Alan | Anlamı |
| --- | --- |
| `type: dataTable` | Registry'deki ortak semantik tür |
| `props.columns[]` | Stabil `key`, metin `header`, destekleniyorsa `width` ve `align` |
| `props.rows[]` | Her satır için stabil, benzersiz `{ id }` |
| `props.data` | Bağımsız modda boş dizi; eski scalar veriyi buraya karıştırma |
| `slots.cellContents[]` | Her gövde hücresine bir bağımsız inline `box` DesignNode ağacı |
| `children` | Tablo node'unda boş; gerçek içerikler hücre slotundadır |

Hücre sırası **row-major**: `rowIndex * columns.length + columnIndex`. 2×2 örnekte sıra A1, B1, A2, B2'dir. Slot kökü sayısı tam `rows.length × columns.length` olmalı; boş hücre de boş bir `box` köküdür. Hücre alt bileşenlerini metne stringify etme; ortak renderer'dan gelen React içeriğini native hücreye yerleştir.

Satır `id`, sütun `key` ve alt node ID'leri başlık/sıra indeksinden bağımsızdır. Araya ekleme eski içeriği ve kimlikleri korur. Toplu uygulama hedef içeriği **bütün alt ağaç ve değerleriyle bağımsız kopya** ile değiştirir; ortak template bağlantısı veya yalnız value yayma değildir. Bu işlemler [getEditedTable](../src/utils/tableAuthoring/getEditedTable.ts) ve [store action](../src/stores/editor/utils/getTableActions.ts) sorumluluğudur.

Yeni palet tablosu 6 sütun × 10 gövde satırı; `Column1…Column6` ve `Row 1-1…Row 10-6` ile başlar. Bu içerik yalnız [getInitialTableNode](../src/utils/tableAuthoring/getInitialTableNode.ts) üzerinden **oluşturma sırasında** üretilir. Import/render sırasında çalıştırma. Sonradan eklenen satır/sütunların gövde hücreleri boştur. Güncel sınırlar 1–20 sütun, 1–100 satır; [ortak sabitleri](../src/utils/tableAuthoring/constants.ts) kullan.

### Eski belgeyi koru

`rows`/`cellContents` bulunmayan eski `columns + data` modu ayrı kalır; açılınca 6×10'a büyütülmez. Registry'de destekleniyorsa eski `renderCell(value, record, index, columnKey)` slotunu da koru. Ortak [slot katmanı](../src/components/Canvas/hooks/useSlotElements.tsx) callback kapsamını kurar. Bağımsız modda `renderCell` veya saved-design `cellContents` referansı kullanılmaz. Kesin boş/değer verilmemiş kabulü için validator'ı izle; falsy kontrolüyle `0`, `false` veya boş metni kaybetme.

## 3. Metadata ve kayıt adımları

1. Kurulu native paket sürümünü, Table tiplerini ve DOM yapısını incele. Native prop desteğini adından tahmin etme.
2. Yeni library'nin registry/provider kaydını [UI_ADAPTERS](../src/adapters/index.ts) üzerinden normal adapter kontratına bağla. `box` ve hücrelerde kullanılacak bileşenlerin kayıtlarını da doğrula; salt Table renderer yeterli değildir.
3. `dataTable` metadata'sında ortak `TABLE_AUTHORING_SCHEMA`, `TABLE_COLUMNS`, `TABLE_DATA` ve `initializeNode: getInitialTableNode` düzenini kullan. Bu sabitlerin tek başına yeni bağımsız tabloyu oluşturmadığına dikkat et: initializer gerekli hücre ağaçlarını üretir. Schema array'ini ve paylaşılan default nesnelerini mutate etme.
4. Native renderer'ı ve `exportConfig.renderTableJSX` eşlemesini tamamla. `exportConfig` import yolu/adı, compound parçalar, provider/CSS ihtiyacını belirtmeli.
5. Bağımsız hücreler, düzenleme, kayıt ve export gerçekten çalışınca `tableContents: true` bildir. Bu alan, upstream library'de “Table” bulunmasının eş anlamlısı değildir.
6. Header **ve** body native hizası aynı anlamla çalışıyorsa `tableColumnAlignment: true` bildir. Yok/false olduğunda ortak hizalama paneli ve menüsü sunulmaz; desteklenmeyen özelliği görünürde açma.
7. Eski callback slotu sunuluyorsa [TABLE_CELL_SLOT](../archive/adapters/shared/tableCellSchema.ts) ve native callback imzasını eşle. Callback slotu ile bağımsız `cellContents` birbirinin yerine geçmez.

Çalışan metadata örnekleri: [Mantine](../archive/adapters/mantine/dataTable.ts), [Material](../archive/adapters/material/constants/components/dataTable.ts), [Ant](../archive/adapters/antd/constants/components/dataTable.ts). Bunları native API farklarını inceleyerek örnek al; hepsinin opsiyonel prop listesinin aynı olduğunu varsayma.

## 4. Mevcut üç library'deki somut eşleme

| Ortak anlam | Mantine | Material UI | Ant Design |
| --- | --- | --- | --- |
| Native kök | `@mantine/core` Table | `@mui/material` Table; DataGrid değil | `antd` Table |
| Header/gövde | `thead/tbody/tr/th/td` (Mantine 6) | `TableHead/Body/Row/Cell` | `columns` ve `dataSource` |
| Başlık | `Th` içeriği | Header `TableCell` içeriği | `column.title` |
| Hücre içeriği | İlgili `Td` çocuğu | İlgili `TableCell` çocuğu | `column.render` dönüşü |
| Satır kimliği | `Tr` React key = `row.id` | `TableRow` key = `row.id` | `rowKey` = `row.id` |
| Sütun kimliği | `Th/Td` key = `column.key` | Cell key = `column.key` | `column.key`, `dataIndex` |
| `columns[].align` | Header/body `style.textAlign` | Header/body `TableCell.align` | `column.align` |
| `columns[].width` | Header `style.width` | Header `style.width` | `column.width` |
| `hasTableBorder` | `withBorder` | Native Table `sx` border | `bordered` |
| Pagination | Native Table'da ek motor yok | Native Table'da ek motor yok | Açıkça `pagination={false}` |

Renderer kaynakları: [Mantine](../archive/adapters/mantine/DataTableRenderer.tsx), [Material](../archive/adapters/material/DataTableRenderer.tsx), [Ant](../archive/adapters/antd/DataTableRenderer.tsx).

Mantine çizgili satır/hover/kolon sınırını native prop'larla, Material native `sx`/row hover üzerinden eşler. Ant metadata'sı bunları şu anda sunmaz; `hasTableBorder` sunar. Başka library'de de desteklenmeyen opsiyonları eşlenmiş gibi raporlama.

`align` yoksa native varsayılanı koru; “Varsayılan” seçimi alanı kaldırır. Açık `left/center/right`, header ve gövdeye uygulanır. Hücre içindeki açık Typography hizasını veya Flex düzenini ezme; alt bileşen stilini bu işlem için yeniden yazma. `text-align`, keyfi component yerleşimini zorla taşıma anlamına gelmez.

## 5. DOM kökü, tıklama ve editör geometrisi

Native render çalışması tek başına Canvas düzenlemesinin çalıştığını kanıtlamaz:

- `rootRef`, `rootClassName`, `style`, `data-node-id` aynı ölçülebilir tasarım yüzeyini hedeflemeli. Native ref DOM yerine instance veriyorsa adapter içinde çöz. Ant mevcut uygulaması bunun için native Table çevresinde ölçülebilir Box kullanır; wrapper normal tasarım ağacına sahte hücre eklemez.
- Tasarım modunda **gerçek header hücresine** `data-table-column={column.key}` koy.
- Gerçek gövde hücresine aynı sütun işaretiyle `data-table-row={rowIndex}` koy. Bu DOM sıra indeksi, kayıtlı satır kimliği değildir.
- İşaretler preview'da bulunmaz. Native library `th/td` prop'larını callback üzerinden istiyorsa Ant `onHeaderCell/onCell` örneğini izle; işareti görünmez wrapper'a koyma.
- Ortak [native hücre bulma](../src/components/Canvas/TableEditingLayer/utils/getNativeTableCells.ts) ve [TableEditingLayer](../src/components/Canvas/TableEditingLayer/index.tsx) bu geometriyi kullanır. İç içe tabloyu parent'ın hücresi sanmamalı; nested senaryoyu sınayın.
- Başlığa tek tık sütun özellikleri, çift tık başlık metni, sağ tık sütun menüsünü açar. Gövde düzenleme ve normal rich alt component seçimi korunur. Seçili key yalnız editor state'tir; table prop'una yazma.
- + Yeni Kolon kontrolü son native header'ın sağında ve onun yüksekliğinde; + Yeni Satır tablonun altındadır. Bunlar native veri hücresi değildir. Yatay scroll'da son sütunu izler, viewport'a yapışmaz; yazı/boşluk/kenarlıkları gerçek canvas zoom ile aynı oranda ölçeklenir. Frame başlığındaki zoom telafisini buraya taşıma.

Library sanal liste, split/fixed header, klon hücre veya birden fazla tablo DOM'u üretiyorsa mevcut selector'ların yeterli olduğunu varsayma. Bu faz için ilgili native özelliği kapat veya ortak geometri sözleşmesini açıkça genişletip tüm adapter regresyonlarını çalıştır. Adapter sınıf adlarını core'a gömerek geçici çözüm üretme.

## 6. Render, JSON, MCP ve TSX birlikte tamamlanır

Ortak export önce her bağımsız hücre alt ağacını render eder; adapter `renderTableJSX` ile native Table yapısına yerleştirir. [getNodeJSX](../src/utils/designExport/getNodeJSX.ts) ayrımını koru.

- Compound çocuklu library için [getNativeTableJSX](../archive/adapters/shared/tableExport/getNativeTableJSX.ts) kullanılabilir. Native tag adlarını, header/body ayrımını, `alignment: style | prop` ve native props listesini doğru ver. [Material örneği](../archive/adapters/material/getTableJSX.ts) ek importları metadata'da da tanımlar.
- Data/column callback API'si için [getAntTableJSX](../archive/adapters/shared/tableExport/getAntTableJSX.ts) örneğini izle; her satırın kendi hücre içeriğini döndür. Bütün satırlarda tek hücre şablonunu tekrar etme.
- JSX metin/başlık kaçışları, özel karakterler, boolean/sayı tipleri ve eksik varsayılanlar korunmalı. Renderer ile export aynı native anlamı üretmeli. Stil önceliğini adapter varsayılanı → node stili → responsive override olarak koru.
- Seçili sütun, türetilen Sayı/Metin/Özel/Karma, menü, + ve hover yardımcıları JSON'a veya TSX/preview'a girmez. Gerçek hücre metni, alt bileşenler ve açık `columns[].align` girer.
- Yeni library aynı modeli kullanıyorsa şema sürümünü sırf library eklendi diye artırma. Yeni kalıcı alan/anlam gerekiyorsa parser/migration ve [yetkili kontrat](contracts/README.md) birlikte ele alınır.
- [getComponentAuthoring](../src/utils/designer/authoringContract/getComponentAuthoring.ts) capability'den `authoring.tableContents` ve `columnAlignment` bilgisini üretir. Gerçek MCP `get_design_catalog` cevabında yeni adapter'ı kontrol et; `read_design_guide` ile data-display (MCP reposunda `designer/contracts/data-display.md`) rehberini oku. Yeni default/öncelik/yazım/preview anlamı varsa authoringContract ve rehberleri aynı değişiklikte güncelle.
- Çalışan nested örnek → flat → nested dönüşümünü **yeni adapterId ile** doğrula. Örnekler [adapter klasörlerinde](../src/adapters/) `<library>/tests/fixtures/table-authoring/` altında bulunur. Geçersiz cardinality ve hizalama girişini de reddettir; bu işlem açık kullanıcı tasarımını bozmamalı.

## 7. Yeni library'nin testlere gerçekten katılması

Önce testlerin adapter seçimini incele. Mevcut scriptin yeşil sonucu yeni adapter'ın kapsandığını tek başına kanıtlamaz.

| Yer | 18 Ekim kaynak durumu / yapılacak |
| --- | --- |
| check-table-authoring (geliştirme reposundaki kaynak) | `test.each` adapter listesi + `UI_ADAPTERS` eşlemesini kullanır; **align TSX assertion'ı library adına göre dallanır**, yeni native eşlemeye uyarlanmalı |
| Playwright projects (geliştirme reposundaki kaynak) | Üç library ID'si sabit liste; yeni library için Chromium/Firefox/WebKit projeleri eklenmeli |
| adapterCases (geliştirme reposundaki kaynak) | Native varyant/kontrol örnekleri yeni library için tanımlanmalı |
| check-table-mcp (geliştirme reposundaki kaynak) | Üç ID ve evidence listesi sabit; yeni library/fixture eklenmeli |
| check-table-performance (geliştirme reposundaki kaynak) | Normal koşum adapter test manifestlerini keşfeder; profile koşumu yalnız Mantine |
| Diğer adapter/slot/export/MCP kontrolleri | `scripts` ve `tests` içindeki ID listeleri/varsayımlar ayrıca aranmalı; otomatik katılım varsayılmamalı |

Yeni adapter implementasyonunda ilgili kabul kontrolleri:

1. Palette 6×10; başa/ortaya/sona boş ekleme; var olan içerik/kimlik korunması; silme; undo/redo.
2. Çok bileşenli hücreyi satır/sütuna tam kopyala; kopyayı düzenle ve kaynak/diğer hücrelerin bağımsızlığını doğrula. Yapısal cell root'u genel node işlemleriyle bozma.
3. Header tek tık/çift tık/sağ tık; satır/sütun menüleri; seçili sütun önüne ekleme, sütun silme ve belge yüklemede doğru inspector.
4. Native header/body hizası ve alanı kaldırınca varsayılan; açık inner component hizasının korunması; diğer sütunların etkilenmemesi.
5. Native design/preview görünümü, gerçek DOM ölçüleri, farklı zoom ve scroll'da + konumu; editör kontrollerinin tıklamaları hücre seçimine dönüşmemeli.
6. Legacy tabloyu değiştirmeden açma; nested/flat/reload; gerçek MCP katalog/rehber; hatalı cardinality/align reddi.
7. TSX importları/sözdizimi ve native prop eşlemesi. Çalışan çıktı iddiası verilecekse **ayrı React sayfasında** exportu render et; TSX string assertion'ını runtime testi diye sunma.
8. Gerçek uygulamada 3 tablo/180 hücre ile hücre/sütun seçimi ve metin düzenleme. Seçim belgeyi/autosave'ı veya kapalı exportu tetiklememeli; düzenleme yalnız hedef hücreyi etkilemeli. Başlangıç MCP eşitlemesinin bitişini yanıtla ayır; sabit bekleme ile sayıları maskeleme.

Aşağıdaki komutlar yalnız test altyapısı olan kaynak geliştirme reposu içindir. Kurum tesliminde build/export/MCP başlangıcı için [Proje kurulumu](../../SETUP.md), gerçek adapter kabulü için [checklist](component-adapter-checklist.md) kullanılır. Kaynak repoda yeni adapter kapsama alındıktan sonra:

```sh
npm test -- table-authoring.test.ts
npm test -- adapter-contracts.test.ts
npm test -- slot-contracts.test.ts
npm run test:browser -- table-performance.spec.ts
npm run build
npm run build:backend
npm test -- table-mcp.test.ts
npm run test:e2e -- src/adapters/tests/e2e/table-authoring.spec.ts --workers=1
npm run check
```

Bu liste ilgili kontrolleri gösterir; `check` bunların bir bölümünü zaten çalıştırır. Yeni değişiklik/başarısızlık yoksa geçmiş başarılı testleri sırf liste için tekrar etme. Tablo MCP testi `check` içindeki Jest keşfine dahildir; tablo E2E ise ayrı kapıdır. table-authoring.spec.ts (geliştirme reposundaki kaynak) içindeki native prop/görünüm varsayımlarını da incele. Sonuç kaydında gerçekten çalışan **adapter × tarayıcı** ve atlananları belirt; mevcut üç library'nin eski test sayılarını yeni library kanıtı olarak kopyalama.

## 8. Gelecek özellikler ve kapsam sınırı

Temel tablo tasarlama, hücre içeriği ve sütun hizası mevcut kapsamdır. Sorting, filtreleme, pagination, sticky header/row, runtime satır seçimi veya iki liste arasında veri taşıma için genel motor bu teslimde yoktur. Upstream Table'ın bunları desteklemesi editörün de desteklediği anlamına gelmez.

Bu yetenekler eklenirse önce ortak kullanıcı anlamını ve kalıcı/geçici değer ayrımını tanımla; sonra metadata ile destek bildir, ortak paneli yetenekle aç, native renderer/export eşlemesini ve JSON/MCP/testleri birlikte tamamla. Yeni library'ye özel sahte çalışan panel seçeneği ekleme.

Liste/Tabs ve tek açılır bölüm için doğrudan authoring altyapısı mevcut; diğer compound aileleri otomatik desteklenmez. Metadata/native/UX/export adımları [adapter onboarding](adapter-onboarding.md) içindedir.

## 9. Agent'a verilecek görev ve teslim şablonu

Görev örneği:

> Yeni UI library'nin Table bileşenini `docs/table-adapter-guide.md` ve ortak adapter checklistine göre bağla. Ortak tablo düzenleme modelini koru; native renderer, metadata capability, TSX, JSON ve gerçek MCP eşlemelerini tamamla. Yeni adapter'ı test listelerine gerçekten dahil et, mevcut adapter regresyonlarını çalıştır. Desteklenmeyen özellikleri ve runtime export doğrulamasının kapsamını açıkça kaydet; AGENTS'teki hafıza kapanışını tamamla.

Yeni adapter çalışma kaydı:

```text
Library / kurulu sürüm / adapterId / native Table:
Registry / provider / CSS / ölçülebilir kök:
Metadata / renderer / TSX kaynakları:
Ortak alan → native alan → varsayılan → destek → test kanıtı:
Bağımsız cellContents desteği ve legacy davranışı:
Header/body hizası ve iç component önceliği:
DOM hit işaretleri / nested table / zoom-scroll sonucu:
Güncellenen test adapter listeleri / gerçek çalışan projeler:
JSON nested-flat-nested / invalid giriş / gerçek MCP kanıtı:
TSX tip-sözdizimi kontrolü / ayrı export runtime kontrolü:
Desteklenmeyen özellikler ve gerekçeleri:
Kontrat/authoringContract/guide güncellemesi veya gerekmeme nedeni:
Current-task / feature / karar / changelog / backlog kapanışı:
```

## 22 Ekim — geniş hücre tasarım yüzeyi
`tableContents` yeteneğini sağlayan adapter ortak Hücreyi tasarla menüsünü de kullanır; ayrı library koşulu yoktur. Taslak mevcut native renderer/rootRef/propsSchema ve layout çözümleyicisiyle çizilir. Hücre kökü/ID korunur, yalnız Bitir atomik olarak cellContents ağacını değiştirir. Kütüphanenin her eklenen bileşeni gerçek renderer ve ölçülebilir rootRef kontratını sağlamalıdır. Test: tests/integration/table-cell-designer.test.ts ve tests/e2e/table-cell-designer.spec.ts; dinamik adapter keşfiyle çalışır. İsimli özel kayıt ve yeniden ekleme, satır/sütuna bağımsız rich copy ve preview/reload da birlikte doğrulanır.
