# UI Designer — kurum teslimi

`designer/` ve `mcp/` bağımsız proje kökleridir. Her ekip bundle/config, CI/CD ve deployment düzenini kendi çalışan projelerine göre hazırlar. Bu teslim uygulama kaynaklarını, adapter kontratını ve MCP çalışma sözleşmesini içerir.

## Buradan başlayın

**[Proje kurulumu — SETUP.md](SETUP.md):** paket kurulumu, yerel ve sunucu ayarları, IDE bağlantısı, kopyalanan kimliğin kullanımı ve troubleshooting. Her adımın sonunda kontrol edilecek sonuç bulunur.

- İlk kurum paket/CLI eşlemesi ve adapter yazımı: [Designer hazırlığı](designer/installation/README.md).
- Teknik bağlantı/deployment ayrıntıları: [bağlantı sözleşmesi](designer/docs/connection.md), [MCP rehberi](mcp/README.md).
- Yeni ZIP'e mevcut projeyi taşıma: [UPDATE.md](UPDATE.md). Bu teslimde değişen dosyalar: [CHANGELOG.md](CHANGELOG.md).

## Uçtan uca kabul

Designer bağlantısı → IDE HTTP MCP bağlantısı → kurum bileşenini katalogdan okuma → `validate_design` → `import_design` sonucunda `applied` ve `isPersisted=true` → `get_design` ile aynı frame'i okuma. Render kullanılacaksa ayrıca görüntü alın. Gerçek kurum paketleri, adapterı ve ortamıyla bu kabulü tamamlayın.
