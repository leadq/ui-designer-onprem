# JSON alan sözlüğü ve kod karşılıkları

Önce bu sayfanın 1–3. bölümlerini, sonra tasarımda bulunan alanların bölümlerini oku. Uygulama sırası [React üretim tarifi](react-generation.md), kaynak ve taşıma başlangıç rehberi (geliştirme reposundaki kaynak). Bu belge mevcut modelin okuma kılavuzudur; yeni şema değildir. Yetkili anlam [yürütme kontratı](execution-contract.md), alanlar document.ts (Designer reposunda `src/types/document.ts`), preview.ts (Designer reposunda `src/types/preview.ts`), flow.ts (Designer reposunda `src/types/flow.ts`), parser ve seçili adapter kataloğudur. Çelişkide kaynak revizyonunu kontrol et, sessiz yorum yapma.

## 1. Hangi JSON'u okuyorsun?

| Biçim | Tanıma ve kullanım |
| --- | --- |
| Nested tam tasarım | `version`, `adapterId`, `nodes`. Her node'un children/slots dizileri yine node nesneleridir; **iç içe ağaçtır** |
| Flat tam tasarım | `format: "ui-design/flat"`, `version`, `designVersion`, `rootIds`, `nodesById`, `behavior`. Aynı ağacın kimliklerle bağlanmış biçimi |
| Davranış manifesti | `execution: "declarative-preview"`; ağaç/props/stil yerine türetilmiş state/flow bilgisi. Tek başına ekranı oluşturmak veya import için yeterli değil |
| Library sözlüğü | `ui-adapter-dictionary/v1`; native kaynak inceleme çıktısı. Tasarım JSON'u değildir |
| MCP yanıt zarfı | Belge yanında editorId/snapshot sürümü vb. olabilir. Yalnız belgeyi ilgili parser'a ver; zarf alanlarını node'a taşıma |

Güncel sürüm değerleri [tek sürüm tablosunda](execution-contract.md#sürümler-ve-kaynaklar) ve katalogdadır. Flat `version` formatı, `designVersion` içerik şemasını belirtir; MCP snapshot version ve rehber bundleRevision bunlardan ayrıdır. Kontrattaki v8/v9/v11 başlıklı tarihsel anlatımlar daha sonraki kurallarla birlikte okunur; güncel ihracı eski sürüm numarasına indirme.

Agent tesliminde tercih **tek güncel flat + behavior dosyasıdır**; nested/tree editörün kanonik modelidir ve geçerli alternatif girdidir. İki tam kopya gerekli değildir. Export menüsündeki “JSON dışa aktar” nested, “Düz JSON + kontrat indir” flat indirir. İkisini aynı işlemde indirmez. Eski flat manifestine güvenmeden aynı revizyonda yeniden export et veya `validate_design(output: "flat")` yanıtındaki document'i kullan. Import behavior'ı kaynak almadığı için yalnız başarılı import eski manifesti doğrulamaz. Seçim ve teslim kararı (geliştirme reposundaki kaynak).

## 2. Tam belge alanları

| Alan | Anlam → hedef kod |
| --- | --- |
| `version` | Şema/parser seçimi; React prop'u değil. Desteklenmeyen gelecekteki sürümü tahminle açma |
| `adapterId` | Bu belgedeki tüm gerçek node type'ları için katalog/provider/native eşleme. Dosya boyunca aynı adapter; başka library'ye çevirmek ayrı dönüşümdür |
| `pageName` | Belge adı; otomatik URL, klasör veya geçerli TS identifier değildir. Hedef isimlendirmeyi proje profili belirler |
| `pageNotes` | Belgenin serbest gereksinim metni; kod veya servis kontratı değildir |
| `pageAnnotations` | `{id,kind,title?,text}` listesi. kind: behavior/validation/data/dependency/interaction. Gereksinimi incele, uygulanma/eksik bilgi kaydını tut |
| `nodes` | Sıralı kökler: flow metadata, frame ve overlay. Çocuk sırası DOM sırasının başlangıç kaynağıdır |
| `savedDesigns?` | `{id,name,nodes}` listesi. Yeniden kullanılan slot içerikleri; her kayıt ayrı node-ID alanıdır. Ana ağaçtaki aynı ID ile birleştirme |

Eksik opsiyonel alan yeni özellik anlamına gelmez. Parser'ın normalize ettiği belgeyi tüket; elindeki exportta beklenmeyen alanı sessizce çalıştırma/atma. İlgili sürüm kontratını doğrula.

## 3. Her DesignNode alanı

| Alan | Veri / anlam | React üretim karşılığı |
| --- | --- | --- |
| `id` | Kalıcı string kimlik | İlişki çözümü ve kararlı key/eşleme. Görünen label'dan yeniden türetme |
| `type` | Seçili adapter registry anahtarı veya designerFrame/designerFlow | Katalogdaki gerçek import/JSX eşlemesini seç; type'ı PascalCase yapıp tahmin etme |
| `label?` | Editörde kullanıcı adı | Anlaşılır component adı önerisine yardımcı; görünür metin veya native label prop'u değil |
| `props` | Kayıtlı component değerleri | Native prop **eşlemesinin girdisi**. Bazıları doğrudan prop, bazıları adapter tarafından dönüştürülür; tümünü spread etme |
| `style` | Temel CSS yerleşim değerleri | Proje profilinin component yanındaki CSS/SCSS Module sınıfları; önce varsayılan/fill çözümü |
| `styleTokens?` | backgroundColor/color/borderColor → adapter colorPalette ID | Native kökte kayıtlı CSS değeri veya Sass eşlemesi |
| `responsiveStyleTokens?` | wide/lg/md/sm/xs renk override katmanları | Desktop-first media query, eksik anahtar miras |
| `responsiveProps?` | Breakpoint → adapter izinli scalar prop | Kurum viewport hook'u ile aynı component'e koşullu native prop |
| `responsiveStyles?` | Breakpoint → style nesnesi | Aynı modülde responsive kuralları; sırayı/önceliği koru |
| `children` | Sıralı normal node dizisi | Alt JSX ağacı; boş dizi leaf olabilir. DOM wrapper'ı yalnız anlamlı gerçek component için üret |
| `slots?` | Kayıtlı slot adı → sıralı node dizisi | Native node-prop / callback / compound içerik; şemadan çöz |
| `notes?`, `annotations?` | Serbest veya türlenmiş gereksinimler | Uygulama planı/kanıt; eval veya otomatik API isteği değil |
| `interactions?` | Sıralı click/change kuralları | Gerçek handler ve hedef state/router/form bağları; sırf data attribute eklemek uygulama değildir |
| `prototypeHidden?` | true ise başlangıçta gizli | Başlangıç visibility; koşul önceliğini aşağıdan oku. Tasarımda silinmiş sayma |
| `stateRules?` | Hedefin visibleWhen / enabledWhen koşulları | Hesaplanan görünürlük / native disabled eşlemesi |
| `textBinding?` | `{sourceNodeId,designText?}` | Kaynak alanın güncel scalar değerini metin olarak göster; designText yalnız tasarım örneği |
| `toggleBinding?` | Boolean kaynak → hedefler/eş dışlama | Eski belgelerdeki görünürlük ve karşılıklı seçim davranışını koru |
| `flow?` | Ekran grubu/başlangıç/üyeler | Sayfa/adım/state planı; kendisi native wrapper değil |
| `overlay?` | Sahip ekran ve açılır yüzey ayarları | Kurum modal/bildirim bileşeni, open/close/focus bağları |

`props.children` metin/sayı içeriğidir; `children` node ağacıdır. Normal exportta node children doluysa ağaç önceliklidir. textBinding olan metinde runtime kaynak değeri öncelikli, boş/null kaynakta props.children yedektir. HTML stringlerini çalıştırma.

`designerFrame`: props/style boş, responsiveStyles/responsiveProps/slots yok; gerçek içerik children'dadır. `designerFlow`: props/style boş, children boş; flow.screens kök frame/overlay ID'lerini referanslar. Bunları ürün DOM'unda sırf JSON'da var diye div/Box yapma; hedef sayfanın gerçek host'u mimari profilindir.

## 4. Props ve native bilgi sınırı

Her kullanılan type için **detaylı** katalog kaydı gerekir. `defaultProps + propsSchema` kayıtlı kabul sınırını, `authoring.acceptedPropKeys` gerçek anahtar listesini verir. Her library'nin tüm olası propslarını tek statik belge doğru anlatamaz; kendi adapter sürümündeki propsSchema/defaultları ve native örneği birlikte kullan.

| Katalog alanı | Üretimde görevi |
| --- | --- |
| `defaultProps`, `defaultStyle` | Eksik değerlerin kayıtlı varsayılanları. false/0/boş string/null'u `||` ile yok sayma |
| `propsSchema` | type/options/defaultValue/isResponsive, ilgili array/object alanları, slot metadata. Panel düzenleyicisi alanları native prop değildir |
| `previewValue` | prop/defaultProp/eventProp/emptyValue; read fonksiyonunun gövdesi katalog JSON'unda yok |
| `exportConfig` | importPath/importName/importType/jsxName/additionalImports; named/default/none ayrımı. hasCustomRenderer/wrapsChildren dönüşüm ihtiyacını bildirir |
| `authoring.*` | Kabul edilen anahtarlar, collection/table/disclosure sahiplik ve başlangıç kuralları |
| `isContainer`, `collection`, `collectionItem`, `disclosure`, `tableContents` | İçeriğin hangi modelle üretileceği. Sadece children varlığına göre native API seçme |
| `overlay.presentation` | Modal/notification yeteneği; Surface implementasyonu JSON'da yok |

Props adı native adla aynı olmayabilir: custom tablo columns/rows/cellContents'ten dataSource/render üretebilir, disclosure defaultExpanded'ten native key üretebilir. `getDefaultLayoutStyle`, `previewValue.read`, `renderJSX`, `renderTableJSX`, `renderCollectionJSX`, `wrapChild` ve supportCode gibi çalıştırılabilir bilgiler tam olarak seri hale gelmez. Eşleme için teslim paketindeki (geliştirme reposundaki kaynak) native örnek/adapter kanıtı gerekir.

propsSchema kayıtlarında key prop kimliği, label editör etiketi, type editör türü, options izinli seçenekler, defaultValue panel başlangıcıdır. arrayOfObjects için itemSchema alanlarının key/label/type/required değerleri nesne biçimini anlatır. Slot için slotDescription, slotAcceptsMultiple, slotRenderMode, slotArgumentNames ve slotShowPlaceholder; tablo paneli için tableConfig(defaultColumns/defaultRows/maxColumns/maxRows) kullanılır. Bunlar katalog metadata'sıdır, node.props içine kopyalanmaz; panel varsayılanı native başlangıç değer önceliğinin yerine geçmez.

`props.style`, sx, className, onClick veya fonksiyon/JSX metni ile JSON sınırını aşma. Hedef React'te className/handler elbette üretilebilir; bunlar kaynak tasarım props'u olarak geri yazılmaz. Placeholder örnek başlangıç değeri değildir. Katalogda bulunan agentPlaceholder bitmemiş entegrasyon işaretidir.

## 5. Style ve responsive

İzinli anahtarların güncel tam listesi katalog `authoringContract.allowedLayoutKeys` içindedir. Gruplar:

| Anahtarlar | CSS amacı |
| --- | --- |
| display, flexDirection, flexWrap | Akış türü, yönü, satıra geçme |
| alignItems, alignContent, alignSelf, justifyContent, justifyItems, justifySelf | Parent/çocuk eksen hizalama |
| gap, rowGap, columnGap | Çocuklar arası boşluk |
| padding ve Top/Right/Bottom/Left; margin ve Top/Right/Bottom/Left | İç/dış boşluk |
| width/minWidth/maxWidth; height/minHeight/maxHeight | Boyut ve sınırlar |
| flex/flexGrow/flexShrink/flexBasis; order | Flex paylaşımı ve görsel sıra |
| gridTemplateColumns/gridTemplateRows/gridColumn/gridRow/gridAutoFlow | Kaynakta varsa Grid düzeni; hedef profil kuralını ayrıca kontrol et |
| overflow/overflowX/overflowY; boxSizing | Taşma ve kutu ölçüsü |

Görünüm renk/font/weight gibi kayıtlı native props ile gelir. Adapter'ın sabit layout dışı defaultStyle değerleri aynen korunabilir; kaynakta keyfi görünüm override üretilemez. Hedef CSS'e geçiş bu semantiği değiştirmez.

Öncelik: adapter defaultStyle ve prop'a bağlı native layout → node.style → aktif aralığa kadar wide → lg → md → sm → xs. `xl` temel stildir; `responsiveStyles.xl` uygulanmaz. Her katmandaki padding/margin shorthand önce miras kenar değerlerini temizler, sonra o katmanın açık kenarları uygulanır.

| Genişlik (CSS px) | Son uygulanan katman | Birikimli CSS üretimi |
| --- | --- | --- |
| ≥1440 | Temel | Media query olmadan |
| 1200–1439 | wide | width <1440 |
| 1024–1199 | lg | width <1200 |
| 768–1023 | md | width <1024 |
| 576–767 | sm | width <768 |
| <576 | xs | width <576 |

375, xs hazır ekran seçimidir; xs üst sınırı değildir. Media kurallarını bu sırada yaz; her katman büyüklerden miras alır. Hedef tarayıcıya uygun media syntax'ı profil belirler. Sadece değişen değerleri yazıyorsan shorthand'ın sıfırlama davranışını da koru.

`padding: 16` → `padding: 16px`; `flexGrow: 1` birimsiz kalır. CSS string birimini koru. `width/height: "100%"` Designer'da **kalan alanı doldur** niyetidir: parent Flex ana ekseninde grow, çapraz eksende stretch, Grid'de hücre paylaşımı çözülür. Her node'a körlemesine width:100% yazma. Açık `auto` küçük boyutta fill'i iptal edebilir. Fill kontratı (Designer reposunda `docs/fill-layout.md`) ve çözümleyici (Designer reposunda `src/utils/layout/getNodeSizingStyle.ts`) esas; native iç body'ye layout aktarımı unutulmaz. Frame host'u gereken column Flex/kullanılabilir yüksekliği sağlamalı; editörün 960px sunum minimumu ürüne taşınmaz.

## 6. Slotlar ve yapısal içerik

Slot prop'unda saved-design ID varsa ilgili savedDesigns kaydı çözülür; bulunan kayıt inline içerikten önceliklidir. Aksi halde `slots[adı]` okunur. Kayıtlı tasarım döngüleri takip edilir. Her kullanımın runtime state kimliği instance yolunu da içermelidir; aynı şablon ID'sinin tüm satırlarında ortak input state açma.

`propsSchema.slotRenderMode` / `slotArgumentNames`: native node içeriği mi callback mi, argümanların item scope'una nasıl girdiğini söyler. `item.field` / `{item.field}` sınırlı veri yoludur, JavaScript ifadesi değildir. Dış/iç item scope'larını ayrı tut. Rich içeriği string yapma.

| Model | Kaynak → native çıktı |
| --- | --- |
| `itemList → listItem` | Her listItem.children bağımsız içerik; native List.Item veya dataSource/renderItem kaynağı ağaçtan türetilir |
| `tabs → tabItem` | tabItem.props.label/disabled başlık; children panel. ID başlık-panel eşleşmesi; tabs.props.initialItemId kayıtlı başlangıç; orientation yön |
| `accordion` | title/defaultExpanded/disabled + children. Native compound/items/key → tek boolean durum. Tasarımda geçici açık hali kaydetme |
| `dataTable` bağımsız | columns[{key,header,align?}], rows[{id}], data:[], slots.cellContents. Hücre index = rowIndex × columnCount + columnIndex; her hücre bağımsız box alt ağacı |
| `list` veya legacy tablo | data + renderItem/renderCell şablonu; bağımsız içerik modeline otomatik dönüştürme |

Sütun kaydındaki opsiyonel `width` native sütun genişliğine aktarılabilir; desteklenen eşlemeyi katalog/native örnekten doğrula. Tipte bulunan `isSortable` tek başına çalışan sorting motoru değildir; mevcut export/native eşleme bunu uygulamıyorsa açık destek eksiği olarak kaydet.

Bağımsız tabloda hücre sayısı rows×columns; cellContents saved-design ID alamaz, renderCell/dolu data ile karıştırılmaz. align: left/center/right veya alan yoksa native default. Header metni/array index'i row/column kimliği değildir. Native Table ek row action/selection/filter/sort/virtualization içeriyorsa ancak kayıtlı destek ve doğrulanmış native eşleme kadar üret; Designer'ın + satır/sütun editör araçlarını uygulama toolbar'ına kopyalama.

Tabs panelleri/disclosure içeriği kapanıp açılınca beklenen form değerini korur. Tasarımcı geçici tab seçimi/disclosure görünümü; collectionEntries, designItemId, designExpanded, seçili hücre, sütun Değer tipi ve + araçları export alanı değildir. Aile ayrıntıları [data-display](data-display.md) ve tablo rehberi (Designer reposunda `docs/table-adapter-guide.md`).

## 7. Alan değeri, görünürlük, aktiflik ve metin

Alan başlangıcı için ilk **undefined olmayan** değer: node.props[runtimeProp] → node.props[defaultProp] → adapter.defaultProps[runtimeProp] → adapter.defaultProps[defaultProp] → emptyValue. null/false/0/boş string korunur. Yeni authoring'de örnek değer başlangıç prop'una yazılır. Runtime değerler ayrı uygulama state'idir; JSON'u kullanıcı yazdıkça değiştirme.

`stateRules.visibleWhen` ve `enabledWhen`: `{match:"all"|"any",conditions:[...]}`. Koşul kaynağı `{kind:"field",nodeId}`; operator ve value/upperValue aşağıdakiyle aynı. Boş koşul dizisi veya herhangi bir geçersiz giriş false verir; `any` bunu geçersiz veriyi yok saymak için kullanmaz. enabledWhen native disabled'a terslenir ve kural varsa kayıtlı props.disabled değerinin yerine geçer; kural yoksa native prop/default geçerlidir. Her node disabled desteklemez.

Görünürlükte hedef stateRules.visibleWhen eski toggleBinding görünürlük bağından önceliklidir; bağlı görünürlük aynı hedefin doğrudan show/hide/prototypeHidden durumundan önceliklidir. Gizli ancestor veya overlay owner yine görünmez kılar. State kuralı yoksa doğrudan başlangıç/aksiyon gizliliği uygulanır. Kaynak: getVisibilityRule (Designer reposunda `src/utils/conditions/componentState/getVisibilityRule.ts`).

`toggleBinding` alt alanları: visibleNodeId eski tek hedef; visibleNodeIds çoklu hedef (ikisi varsa benzersiz birleşim); hiddenWhenCheckedNodeIds bu hedeflerin ters görünen alt kümesi; exclusiveWith aynı frame/overlay'deki boolean eşler. Dışlama çift yönlü ikili ilişkidir, transitif grup değildir. Son açılan eş kazanır; başlangıçta ağaçtaki ilk true kazanır. Eşleri kapatma yapay change çalıştırmaz.

`textBinding.sourceNodeId`: input değerini metne bağlar; null/boş string için props.children kullanılır; 0 ve false yazdırılır. designText sadece tasarım tuvalindeki örnektir, input initialValue/üretim verisi değildir. Tekrarlanan slot alanlarını dış state/text kaynağı sayma; destek sınırını validator ve katalogdan doğrula.

## 8. Interactions ve koşullar

| Alan | Anlam |
| --- | --- |
| id | Kaynak node içindeki kural ID'si |
| trigger | click veya change; native callback'e adapter üzerinden bağlanır |
| action / targetNodeId | goTo, openOverlay, closeOverlay, show, hide, toggle / hedef ID |
| intent? | Yalnız goTo: formStep, navigation, stateChange. Yoksa anlamı belirtilmemiştir |
| condition? | source, operator, value?, upperValue?; tek karşılaştırma |
| otherwise? | False dalının action/targetNodeId/intent bilgisi. İç içe koşul veya else yok |

Condition.source field `{kind:"field",nodeId}` veya örnek sonuç `{kind:"example",label,defaultValue:"success"|"failure"}`. Örnek sonuç gerçek servis/OTP değildir; yalnız equals ile success/failure karşılaştırılır. Gerçek entegrasyon ayrıca teyit edilir.

| Operator | Anlam |
| --- | --- |
| equals / notEquals | Tür koruyan eşitlik; beklenen sayı ise geçerli numeric string sayıya çevrilebilir |
| greater / less / atLeast / atMost | > / < / ≥ / ≤; finite sayılar |
| between | value ve upperValue dahil aralık |
| empty / notEmpty | null veya whitespace-only string boş; false/0 dolu |

Eksik/geçersiz sayısal kaynak true/false diye zorlanmaz: interaction'ın iki dalı da atlanır. Field değişiminde önce güncel değeri kaydet → eş dışlama → bağlı görünürlük → kaynağın change kurallarını değerlendir. Aynı event'teki kurallar sırayla; koşul bir kez, seçilen dal effects'i sırayla çalışır. Native React bubbling korunur; parent click'i ek handler çağırarak iki kere tetikleme.

## 9. Flow, ekran ve overlay alanları

`flow.layout:"root"`; `startScreenId` normal frame; `screens:[{nodeId,kind:"screen"|"overlay"}]`. Her frame/overlay tam bir flow'a aittir. Flow kind eski migration verisidir; yeni üretimde intent bağlantıdadır.

`goTo` hedef flow'un frame/overlay'lerini gizler; hedef frame ve başlangıçta açık overlay'lerini gösterir. Diğer flow'u kendiliğinden gizlemez. formStep proje form/stepper'ına, navigation doğrulanmış router/URL eşlemesine, stateChange aynı sayfa görünüm state'ine çevrilir. JSON URL içermez. Açık ilişkiler görsel benzerlikten önceliklidir. Frame sırası veya sayısı tek başına adım sırası değildir; modal/state varyantı yeni form adımı olmaz.

| overlay alanı | Anlam |
| --- | --- |
| ownerFrameId | Aynı flow'daki normal frame sahibi; overlay kökte kardeştir |
| presentation? | modal veya notification; eski kayıt yoksa modal |
| kind | custom/confirmation/smsOtp; otomatik servis veya doğrulama üretmez |
| initiallyOpen | Preview başlangıç tercihi; yeni palette overlay false. Dosyadaki açık true korunur |
| withBackdrop? | Yoksa true; modal karartma tercihi |

openOverlay aynı flow ve presentation'daki diğer overlay'leri kapatır; owner frame'i açmaz. closeOverlay yalnız hedefi kapatır. Modal Escape/backdrop/close ile; notification close ile kapanır. Açan node'a focus dönüşü mümkünse sağlanır. Hidden içerik mounted kalır; yeniden başlatma ilk değerleri kurar. Aynı sayfa sayılan iki ayrı frame'in benzer input'ları otomatik tek state değildir.

## 10. Flat ve behavior alan sözlüğü

Flat ağacı rootIds → nodesById[id].childIds ve slotChildIds üzerinden sırayla kur. Her node'daki parentId/slotKey/index ters ilişkiyi doğrular; kökte parentId/slotKey null. Flat savedDesigns da kendi rootIds/nodesById indeksini taşır. Döngü, çoklu sahip, eksik/ulaşılamayan ID ve sıra çelişkisi hatadır. Davranış kaynağı node alanlarıdır; flat.behavior türetilmiştir, tek başına düzenlemek importu değiştirmez.

| behavior alanı | İçerik / tüketim |
| --- | --- |
| version / execution / visibility | Manifest formatı / declarative-preview / keep-mounted |
| nodes[] | id,parentId,type,name,notes,annotations,initiallyHidden; structural role screen-context/flow-context, frame contentNodeIds. Tam props ağacı değildir |
| flows[] | id,name,startScreenId,notes,annotations,screens (nodeId/kind/name). Flow state kapsamları |
| states[] | id,kind,scopeId,name,overlay,pageId,baseScreenIds; overlay dismiss: triggers/effects/restoreFocusTo |
| pages[] | id,frameIds; açık ve çözümlenebilir stateChange ile gruplanmış mantıksal sayfalar |
| formScopes[] | id,pageIds,screenIds,stepCount,connectionKeys,derivation,order,dataScope. formStep bağlantı grafiği; alfabetik diziyi adım sırası sanma |
| fieldInputs[] | nodeId,prop,defaultProp,eventProp,initialValue; native read gövdesi yok |
| componentStates[] | targetNodeId,visibleWhen/enabledWhen,evaluation,invalidInput; her alan değişiminde hesaplanır |
| textBindings[] | targetNodeId,targetProp,sourceNodeId,emptyText; runtime özet bağı |
| exampleResults[] | key,label,defaultValue; key sourceNodeId+interactionId'den; aynı label ayrı örnek olabilir |
| fieldBehaviors | visibility[]: sourceNodeId,targetNodeId,visibleWhen,otherwise; exclusions[]: nodeIds,policy; initialVisibility,initialConflict,implicitChanges,precedence. Legacy boolean bağları |
| stateMachine | model,visibility başlangıcı için initial.hiddenNodeIds,dispatch,ruleOrder,effectOrder,guards,evaluation,propagation,fieldUpdates. Yürütme sırasını tanımlar; hazır runtime değil |
| connections[] | Kuralın açılmış dalları; ayrıntı aşağıda |
| issues[] | code,connectionId,sourceNodeId; çözülemeyen sayfa/form anlamı. Sessizce yok sayma |

Connection: id/interactionId/branch(always,then,else), trigger/action/targetNodeId/intent/condition; sourceNodeId/sourceStateId/sourceScopeId/targetScopeId/sourcePageIds/targetPageId; order; connectionKey; effects[{operation,nodeIds}]; guard(null veya condition/inputKey/expected/invalid). connectionKey = JSON.stringify([sourceNodeId,interactionId,branch]); eski id yerine bunu benzersiz dal anahtarı olarak kullan. Guard invalid = skip-both-branches. Bütün dalların effects'ini beraber yürütme.

Issue code'ları: ambiguous-state-context, ambiguous-form-context, cross-scope-form-transition, page-transition-within-state-group. İlişkiler korunur ama belirsiz gruplama uygulanmaz. dataScope:shared-across-steps bir semantik beyandır; preview otomatik provider oluşturmuş demek değildir. Ayrıntılar [yetkili manifest sözleşmesinde](execution-contract.md).

## 11. Bu JSON'da bulunmayanlar

Canvas zoom/pan/seçim, referans PNG baytları, editor modal görünümü, geçici tab/hücre seçimi ve runtime form değerleri; scaffold completionChecklist; Basic/Detailed/phase/source politikası tasarım alanları değildir. Service endpoint, auth, gerçek OTP, URL route, işletme validation ve mimari klasör standardı exporttan uydurulmaz. Kaynak JSON'a fonksiyon veya React kod stringi eklenmez.

Mevcut native TSX export bir handoff'tur: style temel çözümünü ve data-designerprops / data-designerstyles / data-designerinteractions / data-designerstate / data-designertextbinding gibi açıklayıcı metadata'yı taşıyabilir. Bu attribute'lar tarayıcıda kendiliğinden responsive CSS, handler veya state runtime'ı çalıştırmaz. Bunların gerçek kod karşılığını sonraki tarifle tamamla.


## Responsive props

`responsiveProps` v13 alanıdır. Katalog `authoring.responsivePropKeys` / `propsSchema.isResponsive` izinlerini oku; aynı isimli prop her adapter'da aynı anlama gelmez. Şema ve enum kontrolü zorunlu. Yalnız string/number/boolean; object/array/null ve item binding yasak. Identity, type, içerik, state/value ve event/flow ortak kalır. Frame/flow bu alanı taşımaz.

| Genişlik | Uygulanan prop katmanları |
| --- | --- |
| 1440+ | defaultProps + props |
| 1200–1439 | önceki + wide |
| 1024–1199 | önceki + lg |
| 768–1023 | önceki + md |
| 576–767 | önceki + sm |
| 576 altı | önceki + xs |

`responsiveProps.xl` yazma; temel değer props'tadır. Eksik katman/key devralır; false/0/boş metin override'dır. Reset full JSON'da anahtarı kaldırır; yalnız update_design patch'inde null siler. Örneğin Mantine props.size=xl, md.size=lg, xs.size=sm; 1024→xl, 768→lg, 576→lg, 575→sm. Kaynak sadece iki görünüm tasarlasa da aralıklar aynıdır; eksik genişliğe tasarım icat etme.

`authoring.responsiveSemanticElement` varsa gerçek HTML etiketi temel props/default eşlemesinden seçilir. Görsel variant küçülünce başlık seviyesi değişmez. Her breakpoint için ayrı JSX/component/key oluşturma; state korunmalı. Üretim yolu [React tarifi](react-generation.md#responsive-propları-kurum-hookuna-çevir).

Tuvaldeki satırlar aynı canonical frame/node'un bağlı görünümüdür. Satır tercihi export edilmez; responsiveStyles ve responsiveProps aynı node'da export edilir. İlişkisiz eski kopyaları görsel benzerlikten birleştirme. MCP effectiveProps türetilmiş inceleme bilgisidir; kaynağa yazılmaz.


### Çoklu davranış notu düzenleyicisi

Editör notları başlık (`title`, isteğe bağlı) ve açıklama (`text`) olarak ayrı ayrı düzenler; tür seçimi göstermez. Yeni notlar mevcut `kind: "behavior"` varsayılanını kullanır. Mevcut türlenmiş notların `kind` değeri düzenlemede korunur; kategori alanı şemadan kaldırılmamıştır. Agent başlık/açıklamayı bağlı sayfa veya node bağlamıyla okur; kategoriye dayanarak eksik kural uydurmaz. Notlar çalıştırılabilir etkileşim veya doğrulama değildir.

Eski `notes`/`pageNotes` girdisi açıkça kaydedilirse başlık ve metni tek yeni `annotations`/`pageAnnotations` girdisine taşınır, eski metin alanı temizlenir. Node dönüşümü tek geri alma işlemidir. Açmak veya kapatmak belgeyi dönüştürmez. Ekle/güncelle/sil işlemleri kaydedilir; henüz eklenmemiş ya da kaydedilmemiş taslak kapatılınca bırakılır. Onay penceresi kapanırsa silme uygulanmaz. Pencerenin açık kalması, liste kaydırması ve geçici başarı mesajı JSON alanı değildir.


## Bileşen kullanım tarifleri

Katalogdaki description/visualHints/recipeIndex kısa tanıma bilgisidir; component details içindeki recipes kullanım tarifidir. Recipe, seçilen component'in props/slot bilgisiyle birlikte okunur; DesignNode'a recipes veya visualHints alanı yazılmaz. Tarifin when koşulunu görünür kullanımla eşleştir, instructions ve avoid ile prop/slot/compound/kardeş ayrımını koru. Örnekteki ID'leri yeni tasarıma uyarlarken yenile.

ReactNode prop'u varsa JSON'a JSX/fonksiyon/string olarak React kodu koyma: o adapter'ın gerçek kayıtlı slot adı ve slots altındaki node ağacı kullanılmalıdır. Label/description/error gibi metinler ancak o component'in propsSchema/acceptedPropKeys sınırında yazılır. Native API'de olması adapter desteği sayılmaz. Card.Header gibi compound adını tarif/registry doğrulamadan üretme; kurumun native header slotu ile düz Typography çocuğu aynı şey değildir. Tarif bulunmaması sahte bir tarif türetme izni vermez. Ekip formatı: component recipes (Designer reposunda `docs/designer-agent.md`).


### Recipe görsellerini seçerek okuma
Önce visualHints/recipeIndex ile aday bileşeni seç; component details içindeki recipe when/instructions/example ve images metadata'sını oku. Görünüm ayrımı için gerekiyorsa get_recipe_image(adapterId, componentType, recipeId, imageId, contractRevision) ile yalnız aday görseli getir. Bu hazırlanmış referanstır, mevcut tasarımın screenshot'ı değildir; otomatik render döngüsü başlatmaz. Görseldeki eşleşmeyi native prop/slot/compound tarifiyle birlikte kullan; input'a ait action/label için tarif bunu söylüyorsa ayrı anchor üretme. Kayıtlı slot yoksa icat etme. Görsel yoksa metin tarifiyle devam et; belirsizlik önemliyse sor. Görsel gizli event/state davranışını kanıtlamaz. PNG/base64/images alanlarını tasarım JSON'una yazma.

Adapter tarafında tarifler recipes/<componentType>/<recipeId>/recipe.ts, görseller aynı tarifin screenshots klasöründe tutulur. Mevcut component dosyası recipes alanına isteğe bağlı import ekler; renderer/component dosya adları değişmez. Recipes olmayan adapter geçerlidir. Bu disk düzeni DesignNode alanı değildir; MCP görseli aynı recipe kimliğiyle ister.

## Adapter kaydı ve varsayılan seçimi

`src/adapters/index.ts` içindeki UI_ADAPTERS kayıt sırası dropdown ve katalog sırasıdır; ilk kayıt yeni tasarımların varsayılanıdır. Görünen version adapter geliştiricisi tarafından manuel tutulur; bundler sürüm enjekte etmez. Kayıtlı adapterId korunur. Kimliksiz tarihsel belge ve eski storage anahtarları LEGACY_ADAPTER_ID ile yorumlanır; sıralama değişikliği eski veriyi yeni kütüphaneye dönüştürmez. Yeni JSON alanı veya şema değişikliği yoktur.

### MCP ile ikon seçimi

Bileşen ayrıntısındaki `glyph.searchTool` aracı gösterir. Ekrandaki farklı ikonları tek istekte ara. Örneğin `search_icons({queries:["navigation","arrow up","trash","settings"]})`. `results` girdi sırasını korur. Her grup `query`, `matches` ve kesilmeden önceki `total` değerini taşır. `total: 0` eşleşme bulunmadığını gösterir. Tam `libraryId:iconId` aynı kimliği kontrol eder. Normal ifadelerde ad, kimlik ve kayıtlı anahtar sözcükler üzerinde bütün kelimelerin geçmesi aranır. `limit` tüm grupların ortak bütçesidir. Varsayılan 20, 21–30 ifadede ifade sayısı, üst sınır 30 kimliktir. `props.glyph` için ilgili grubun döndürdüğü kimliği kullan.

### Bağımsız ikon

`type: "icon"` için `props.glyph`, yapılandırılmış tek ikon kaynağının katalogda bildirdiği `libraryId:iconId` seçeneğidir; gerçek kimliği katalogdan okuyun. Teslimde kaynak `null`, MCP `iconLibraries` ve picker kataloğu boştur; yalnız açık boş glyph geçerlidir. Kurum kaynağı eklendikten sonra yeni ikon ilk aktif öğeyi kullanır. Arşivdeki Lucide/Tabler örnekleri kayıtlı seçenek değildir; eski glyph’i başka pakete dönüştürmeyin.

`props.size` 1–1024 CSS piksel, varsayılan 32; `props.accessibleLabel` isteğe bağlıdır. Açıklamasız ikon dekoratiftir; native görünüm currentColor mirasını kullanır. Açık boş glyph’in ölçüsü ve açık layout width/height önceliği korunur. JSX/fonksiyon/paket yolu veya `item.*` yazılmaz. Nested/flat/MCP aynı kimliği taşır; native export eşlemesi kaynağa aittir. Picker/search/scroll JSON değildir. Kaynak kurulumu (Designer reposunda `src/adapters/iconLibrary/README.md`).
## Explicit selected-screen export

For a user request limited to selected whole screens, first read ready `get_editor_context`. Require `frameExport.eligible=true`, then call `export_selected_frames` with exactly `frameExport.frameIds`, current `expectedVersion`, `editorId` (and HTTP `clientId`, `designId`). `format` is nested (default) or flat. Only the top responsive row has frame checkboxes; they toggle whole-screen IDs without modifiers and leave component selection empty. All responsive copies show the frame outline. Active tabs, component selections, partial/mixed/reference/preview/stale selections never imply whole frames. Report the error and ask the user to select whole screens; never silently fall back to exporting all screens or infer a component's parent frame.

The result's `document` is strict-importable, with whole selected subtrees/slots/responsive values and owned overlays. Only selected flow screens remain; the first remaining normal screen becomes start if needed. Actions to excluded nodes, their external otherwise branches, and bindings/conditions depending on excluded nodes are pruned, as reported by `scope.omitted`. Internal screen links remain. No external screen/stub is added. Unrelated page notes/annotations and unused saved templates are omitted. Referenced slot templates and their transitive dependencies remain with stable IDs; missing or recursive saved content fails with INVALID_SAVED_CONTENT. Preserve authored fallbacks. Export is read-only; `get_design` remains full source. Selection and response `scope` are not document fields. See docs/contracts/README.md for error codes and pruning rules.


23 Ekim ikon varsayılanı: yeni ikon ilk kayıtlı katalog öğesiyle oluşturulur; seçim penceresi açılmaya devam eder ve iptal varsayılanı korur. Açık boş glyph eski belgeler için geçerlidir; size ölçüsü boş ikon dahil runtime ve TSX köküne uygulanır, açık layout width/height değerleri önceliklidir.

## Adapter color tokens (schema v14)

Read colorPalette in get_design_catalog for the active adapter. On component
nodes, styleTokens maps backgroundColor/color/borderColor to registered token
IDs (not raw CSS or Sass). responsiveStyleTokens holds wide/lg/md/sm/xs overrides;
base/xl then desktop-first inheritance applies. Delete an override to inherit.
Only registered usages are accepted; frames and flows cannot carry tokens.
Raw style.color/backgroundColor/borderColor remains forbidden. Nested/flat
retain IDs; runtime and preview resolve cssValue on the native root after layout.
Native color props keep their separate semantics. No cross-adapter ID inference.

İkon inspector notu: `accessibleLabel` mevcut belgelerde desteklenir ancak sağ panelde düzenlenebilir alan değildir; panel simge ve boyut seçimini sunar.

### Library surface default

Catalog backgroundColor is an optional token ID from the active adapter's colorPalette
(null when not configured or not allowed for backgroundColor). It supplies the palette
sample, default frame and prototype preview/capture viewport background. It is not a
document field: do not add backgroundColor or styleTokens to structural frames/flows.
Native component backgrounds and authored color tokens retain precedence. CSS variable
references must be available at the document root. To reproduce the preview in a target
application, apply this token to the page surface; node TSX export does not inject it.
