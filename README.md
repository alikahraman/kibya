# Kibya (Kitap Depo Yönetimi)

Kibya, kitap depo yönetimini kolaylaştırmak için tasarlanmış bir web uygulamasıdır. Kullanıcılar, kitap ve raf bilgilerini yönetebilir, stok takibini yapabilir ve toplu veri girişi sayesinde işlemlerini hızlandırabilir. MERN Stack ile geliştirilmiş bu proje, modern bir arayüz ve güçlü bir backend ile kullanıcı dostu bir deneyim sunar.

---

## Özellikler
- **Kullanıcı Kimlik Doğrulaması (JWT)**: Güvenli giriş ve erişim kontrolü sağlar.
- **Kitap Bilgisi CRUD Operasyonları**: Kitapları ekleyebilir, güncelleyebilir, görüntüleyebilir ve silebilirsiniz.
- **Raf-Lokasyon Bilgisi CRUD Operasyonları**: Raf bilgilerini kolayca yönetebilirsiniz.
- **Stok Operasyonları**: Kitapların depo stok durumlarını, raf-lokasyon bazlı takip edebilirsiniz.
- **Toplu Veri Girişi**: Hızlı veri girişi için toplu yükleme imkanı sunar.

---

## Kurulum
1. Bu repoyu klonlayın:
   ```bash
   git clone https://github.com/alikahraman/kibya.git
   ```
2. Proje 'backend' dizinine gidin:
   ```bash
   cd kibya/backend
   ```
3. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Örnek bir `.env` dosyası oluşturun ve aşağıdaki gibi doldurun:
   ```env
   NODE_ENV=development
   PORT=8000
   MONGO_URI=mongodb+srv://kullanici:şifre@cluster0.mongodb.net/dbname
   JWT_SECRET=sizin_secret_kelimeniz
   ```
5. Sunucuyu 8000 portunda başlatın:
   ```bash
   npm run dev
   ```
6. Proje 'frontend' dizinine gidin:
   ```bash
   cd kibya/frontend
   ```
7. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
8. Projeyi 3000 portunda başlatın:
   ```bash
   npm run dev
   ```

## Kullanılan Teknolojiler

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Material UI](https://mui.com/)

## Gelecek Planları

- Kullanıcı rollerine göre erişim kontrolü
- Detaylı raporlama ve istatistikler
- Sipariş modülü ile tekli veya çoklu siparişi toplama
- Mobil cihazlar için optimize edilmiş kullanıcı arayüzü
- El Terminali için optimize edilmiş kullanıcı arayüzü
- E-Ticaret sitesi entegrasyonu için XML altyapısı