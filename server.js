const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//burası yukardaki satırdan sonra gelmeli ki config.env işledikten sonra o değişkenlerle
//beraber bu dosyaya gelinebilsin.
const app = require('./app');

//node.js'in çok daha fazla environment variable seçeneği var
//console.log(process.env);
//console.log(app.get('env')); //development mode activated by express

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//bu bağlantı kodu geriye bir promise döner.
mongoose
  //.connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    //bu parametreler şu an için önemli değil. Genel kullanım bu şekilde.
    //detay için araştırma yapılabilir.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, //mongoose uyarı verdiği için bu satır eklendi. (Kursta yok)
  })
  //con değişkeni promis'in resolve değeri olacak
  // .then((con) => {
  //   console.log(con.connections);
  //   console.log('DB connection successful!');
  // });
  .then(() => console.log('DB connection successful!'));

//--- Şema oluşturma ----------
const toursSchema = new mongoose.Schema({
  //name: String,
  //rating: Number,
  //price: Number,
  name: {
    type: String,
    //required: true,
    //Aşağıdaki için ilk parametre required için olması gereken değer, ikincisi hata olursa görüntülenecek mesaj
    required: [true, 'A tour must have a name!'], // <-- validator
    unique: true, //Her tur ismi özel olmalıdır. Aynı isimli tur olamaz.
  }, //Schema Type Options Object
  rating: {
    type: Number,
    default: 4.5, //eğer rating değeri oluşturma sırasında boş bırakılırsa bu değer otomatik atanır
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!'],
  },
});

//--- Şemadan model oluşturma ----------
//ilk harfi büyük olarak özellikle yazılıyor ki "model" olarak tanımlandığı anlaşılsın.
//parametre olan Tour modelin ismi, ikinci parametre ise kullanılacak şema.
const Tour = mongoose.model('Tour', toursSchema);

// Modelden döküman oluşturmak
// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });

//ValidatorError: A tour must have a price! verecek çünkü price->required olarak ayarlı idi
// const testTour = new Tour({
//   name: 'The Park Camper',
// });

//rating: 4.5 olarak ayarlanacak. rating key'i olmadığı için "default" değer atandı. (şemadan geliyor)
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

// testTour dökümanı "save" methodu ile database'e kaydedilir. save(), promise döner.
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR: ', err);
  });
//aynı döküman tekrar kaydedilmek istenirse şemadaki "name->unique" özelliğinden dolayı hata verecektir.

const port = process.env.PORT || 8000; //process.env.PORT varsa o değeri yoksa 8000'i alır.

app.listen(port, () => {
  console.log(`App running on port ${port}...`); //buradaki tırnak işaretleri Alt Gr ile basılan ;'den geliyor
});
