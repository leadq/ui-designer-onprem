# İkon adapterı örnekleri

- `lucide/`: metadata kataloğu, asenkron native ikon yükleme ve gerçek pakete TSX export örneği.
- `legacy/tabler/`: kaynak kimliğini değiştirmeden native render/export eşleme örneği.

Kurum paketinizi kurup örneği `src/adapters/iconLibrary/<kurum>/` altında uyarlayın; `src/adapters/iconLibrary/index.ts` içindeki tek `DESIGN_ICON_LIBRARY` kaydını ayarlayın. Ayrıntı: [kurum ikon kaynağı](../../src/adapters/iconLibrary/README.md).

Bu klasör aktif değildir. Designer’ın kendi Tabler kontrol ikonları `components/common/EditorIcon` altında kalır.
