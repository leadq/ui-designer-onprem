configure.mjs sabit environment ayarından share/designer-config.json üretir; npm dev/build hookları ve deployment aynı scripti kullanır. [Bağlantı rehberi](../docs/connection.md).

preview.mjs yerelde statik build çıktısını sunar. export-mcp.mjs kayıtlı adapterları ve Designer sözleşmesini MCP reposuna aktarır. Export önce Node bundle’ını yükler ve aktif adapter kimliklerini doğrudan bu bundle’dan okur. CI/CD ve deployment adımlarını ekip kendi projelerindeki süreçlere göre oluşturur.
