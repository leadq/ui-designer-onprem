# Prop metadata yazım kuralları

Bu örnekler **varsayımsal bir library** içindir; API isimlerini gerçek library'ye kopyalamayın. Yetkili şekil [PropSchema](../../../../src/types/propSchema.ts), slot/değer modeli [ComponentMeta](../../../../src/types/componentContract.ts) ve [preview](../../../../src/types/preview.ts) içindedir.

## Her sunulan prop için tamamlanacak bilgi

| Bilgi | Konumu / kural |
| --- | --- |
| Designer anahtarı | key; native ad farklıysa renderer/export dönüşümünü doğrula |
| Editör etiketi | label; teknik açıklamanın yerine geçmez |
| Etki | description; somut olarak neyi değiştirdiğini söyle |
| Değer alanı | type + options/min/max/itemSchema; kaynak API'nin desteklediği alt küme |
| Değerlerin anlamı | description içinde seçenek başına görünüm/davranış farkı; yalnız isimleri tekrar etme |
| Başlangıç | defaultValue ve component defaultProps birbiriyle tutarlı; native omitted davranışı farklıysa description'da açıkla |
| Birlikte çalışma | description içinde hangi başka prop/slot/durumla etkili olduğu, varsa öncelik |
| Responsive | isResponsive yalnız gerçekten desteklenen scalar görünüm alanında; event/kimlik/semantik yapı yerine kullanma |
| Export | Public native prop/değer/slot karşılığı; renderer ile aynı anlam |

description string'dir. optionDescriptions/nativeType/required gibi yeni alanlar bu şemada yoktur; bunları varmış gibi ekleme. Zorunlu native girdiyi geçerli başlangıç veya desteklenen modelle karşılayamıyorsan eksikliği raporla. Eski adapterlarda description opsiyonel olabilir; bu skill ile yeni eklenen her sunulan prop'a anlamlı description yaz.

## Scalar örneği

Varsayım: gerçek kaynakta outline/filled seçenekleri ve outline varsayılanı doğrulandı. Aşağıdaki parça `PropSchema` biçimindedir:

```ts
{
  key: 'variant',
  label: 'Görünüm',
  description: 'outline: şeffaf zemin ve kenarlık; filled: dolu zemin. Başlangıç outline. İçeriği veya tıklama davranışını değiştirmez.',
  type: 'select',
  options: ['outline', 'filled'],
  defaultValue: 'outline',
}
```

Component defaultProps içinde variant yazılıyorsa aynı başlangıç değerini taşımalıdır. Library'nin native default'u farklıysa adapterın başlangıç tercihini açıkça belirt. Sayı alanında birimi; boş/0/false değerinde native anlamı; koşullu prop'ta etkili olduğu koşulu yaz. “Bileşenin variant'ını ayarlar” yeterli açıklama değildir.

## ReactNode slot örneği

Varsayım: gerçek input public API'sindeki `abc` tek ReactNode kabul ediyor ve input altında gösteriliyor. Anchor da adapterda kayıtlı. Slot şeması:

```ts
{
  key: 'abc',
  label: 'Alan altı içerik',
  description: 'Input altında yardımcı içerik gösterir. Bağlantı için Anchor child düğümünü abc slotuna koy; input dışına kardeş olarak ekleme. Boşken içerik yoktur.',
  type: 'slot',
  defaultValue: null,
  slotDescription: 'Input altında gösterilen içerik',
  slotAcceptsMultiple: false,
  slotRenderMode: 'node',
  slotShowPlaceholder: false,
}
```

Bu parça tek başına çalışan adapter değildir. Renderer slotu native `abc` prop'una iletmeli; export aynı yerde ReactNode üretmelidir. JSON child yapısı `node.slots.abc` altında tutulur. Scalar `props.abc` alanına JSX, ReactNode nesnesi veya callback konmaz. Mevcut kayıtlı slot şablonu referansı ile inline slot çocuklarının önceliği için JSON kontratını izle; ikinci bir model icat etme.

Native API `(item) => ReactNode` istiyorsa node örneğini kör kopyalama: slotRenderMode callback ve gerçek slotArgumentNames gerekir; item bağlamını mevcut collection/slot altyapısı üretir. Çoklu children desteği native API ile uyumlu olmalı. ReactNode tipinin geniş olması, array/string/element biçimlerinin hepsinin bu adapterda otomatik desteklendiği anlamına gelmez.

## Description, hint ve recipe sınırı

- Component description: “Üst etiketi ve alt yardımcı içerik alanı olan metin girişi.”
- visualHints: “Input'un altında sola hizalı bağlantı metni aynı alanın yardımcı içeriği olabilir.”
- Prop description: Yukarıdaki abc açıklaması; alanın konumu ve doldurma biçimi.
- Recipe: “Alan altı aksiyon” görünümünde abc slotuna gerçek Anchor type'ı koy; link propslarını gerçek kaynaktan eşle; instructions/avoid ve aynı input type'ına ait geçerli DesignNode example ile göster.

Recipe id/title/when/instructions/example zorunludur; avoid/images isteğe bağlıdır. Örneği gerçek adapterda `validate_design` ile denemeden geçerli sayma. Gizli iş kuralı, network isteği veya form validasyonu görünüşten çıkarılmaz. Görüntüde kırmızı metin olması tek başına link veya hata mesajı olduğunu kanıtlamaz.
