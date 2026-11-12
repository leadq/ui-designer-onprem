<!-- rule
{
  "id": "architecture",
  "title": "Klasör ve dosya mimarisi",
  "when": "react",
  "status": "needs-project-input",
  "summary": "Hedef kurum klasör/import/router/provider kararları; eksik alanları hazır kabul etme.",
  "targets": [
    "react"
  ],
  "phases": [
    "implement"
  ]
}
-->

# Hedef proje mimarisi

Durum: needs-project-input. Bu dosya ekip tarafından doldurulacak başlangıç profilidir.
Aşağıdaki bilinen kuralları uygula; eksik import/entegrasyonları hedef projeden doğrula.

- Her bileşen PascalCase klasörde, implementasyonu `index.tsx` içinde, named export.
- `src/pages/TransferPage/index.tsx` route girişidir; domain UI `src/components/Transfer/index.tsx` altında.
- Ortak UI mevcut `components/common` veya projenin UI paketinden gelir. Yeni native tag/paketle taklit etme.
- Bileşen stilleri tek SCSS module dosyasında. Örnek generator `styles.module.scss` üretir;
  ekip `style.module.scss` kullanıyorsa generator parametresiyle seçilir.
- Kök class bileşen adının camelCase biçimi: `TransferSummary` → `transferSummary`.
  Alt eleman `&__title`, daha derin `&Icon`; modifier `&--isLoading`. Inline stil üretme.
- Hook/utility'leri kullanım kapsamına göre ilgili bileşenin `hooks/`, `utils/` klasörlerine koy.
- API domain başına `src/apis/<api-name>/index.ts`, `types.ts`; fixture `src/mocks/<api-name>.json`.
- API URL normalde `src/constants/api.ts`; template başlangıcında API index'inde tutulabilir.
- Generator store, router, interceptor veya ortak constants dosyalarını otomatik değiştirmez.
- Generator öncesinde pageName/componentName, primitiveName/primitiveImport ve styleFile bilgilerini mevcut projeden doğrula. İşlev/domain adı belirsizse kullanıcıya sor; örnek Transfer adlarını yeni ekrana körlemesine kopyalama. İsteğe bağlı API çıktısı için endpoint/base API/URL/metot bilgileri api-mocks rehberine göre doğrulanmadan parametre üretme.

## Ekip dolduracak
- UI paket yolu, primitive/component export isimleri ve token referansları:
- Import alias'ları ve barrel kuralları:
- Form provider/context importları ve route kayıt örneği:
- RTK Query base API dosyası ve export adı:
- SCSS dosya adı ve ek BEM örnekleri:
- Mimari hazır kabul ölçütleri:

## Hedef ekip teknoloji şablonu

Kullanıcının belirttiği başlangıç profili: React (sürümü hedef manifestten doğrulanır), TypeScript, Redux Toolkit/RTK Query, classnames, ESLint, SCSS Modules. Bunlar hedef projede manifestten doğrulanır; Designer runtime dependency listesi değildir. Agent kendi kararıyla yeni paket kurmaz, sürüm değiştirmez. UI paket/alias, form provider, router, API ve test komutlarını ekip doldurur. Öncelikli IDE VS Code'dur; diğer IDE'lerde agent dosyası uyumu varsayılmaz.
