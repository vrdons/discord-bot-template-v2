# Discord.js Template Bot

Bu proje, **Discord.js v14** ve **Bun.js** üzerine kurulmuş, modern bir Discord botu şablonudur. **Komut çeşitliliği**, **sharding**, **PostgreSQL** desteği ve yüksek performans için optimize edilmiş mimarisi ile gelişmiş projeler için güçlü bir temel sağlar.

---

## 🚀 Özellikler

### 🎛️ Çoklu Komut Desteği

Bu altyapı; farklı kullanıcı etkileşimlerini destekleyecek şekilde 3 tür komut yapısını bir arada sunar:

- **Prefix Komutları:** Kullanıcıların `!yardım`, `!ping` gibi klasik komutları yazmasını sağlar.
- - **Multi Prefix Desteği:** Kullanıcıların birden çok prefix kullanmasını olanak sağlar.
- **Slash Komutları:** Discord’un modern arayüzünde görünen `/yardım`, `/profil` gibi etkileşimli komutlar.
- **Context Menu Komutları:** Kullanıcı veya mesaj üzerine sağ tıklanarak tetiklenen bağlam menüsü komutları.

### 🌐 Otomatik Sharding

Discord'un ölçeklenebilir bot mimarisi için önerdiği **sharding** sistemi entegre edilmiştir. Shard yöneticisi, API limitlerine takılmadan çok sayıda sunucuda stabil çalışmayı garanti eder.

### 🧬 PostgreSQL Entegrasyonu

Veri yönetimi için güçlü bir ilişkisel veritabanı olan **PostgreSQL** kullanılır.

### ⚡ Bun.js ile Maksimum Performans

Node.js’e kıyasla daha hızlı çalışan **Bun**, bu projede temel çalışma zamanıdır. Komut işleme, başlatma süresi ve paket yüklemelerinde gözle görülür performans artışı sağlar.

### 📁 Temiz ve Modüler Dosya Yapısı

Kod yapısı, genişletilebilir ve anlaşılır bir biçimde düzenlenmiştir.

## ⚙️ Kurulum

### 1. Gereksinimler

- [Bun](https://bun.sh)
- Discord bot token
- PostgreSQL veritabanı

### 2. Projeyi Başlat

```bash
git clone https://github.com/Axeronbot/template.git
cd template
bun install
bun start
```
