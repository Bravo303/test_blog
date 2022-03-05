const express = require('express')
const createError = require('http-errors');
const session = require('express-session'); // подключаем библиотеку + установка npm i express-session *** Dimka ***

const logger = require('morgan'); // Логи сервера!* npm i morgan
const path = require('path'); // Путь в зависимости от разных ОС
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
require('dotenv').config() // библиотека для .evn файла подключаем тут и в sequelizerc ! + мееням в database.json + во всех файлах где обращаемся к БД

const app = express();
const PORT = 3100;

const dbConnectionCheck = require('./db/config/dbConCheck.js') //- Проверка подключения к БД**




// Импортируем созданный в отдельный файлах рутеры.

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
// const entriesRouter = require('./routes/entries');






app.set('view engine', 'hbs'); // Сообщаем express, что в качестве шаблонизатора используется "hbs". // подключение хэндлбарс (усики)
app.set('views', path.join(__dirname, 'views')); // Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "Папка Проекта/views".


app.use(logger('dev')); // Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(express.static(path.join(__dirname, 'public'))); // Подключаем middleware, которое сообщает epxress, что в папке "Папка Проекта/public" будут находится статические файлы, т.е. файлы доступные для скачивания из других приложений.
app.use(express.urlencoded({ extended: true })); // Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.json()); // Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.

dbConnectionCheck();//- Проверка подключения к БД**

const sessionConfig = { // Скопировал из лекции Ромы *** Dimka ***
  name: 'sid', // название куки
  store: new RedisStore({ client: redisClient }), // подключаем БД для храненя куков
  secret: process.env.COOKIE_SECRET, // ключ для шифрования cookies // require('crypto').randomBytes(10).toString('hex')
  resave: false, // Если true,  пересохраняет сессию, даже если она не поменялась
  saveUninitialized: false, // Если false, куки появляются только при установке req.session
  cookie: {
    secure: process.env.NODE_ENV === 'production', // В продакшне нужно "secure: true" для работы через протокол HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 10, // время жизни cookies, ms (10 дней)
  },
};
app.use(session(sessionConfig)); // req.session.user = {name: '....'}*** Dimka ***

app.use((req, res, next) => {
  // console.log('file /middelware/user.js req.session.user :', req.session.user);
  if (req.session.user) res.locals.useremail = req.session?.user?.email;
  next();
});

// сохраняем в обьект res.locals.username имя пользователя для использования username в layout.hbs
app.use((req, res, next) => {
  console.log(req.session.user)
  res.locals.useremail = req.session.user.email; //* ** Dimka ***
  // res.locals.username = req.session.username;
  // console.log(req.session.username);
  console.log('\n\x1b[33m', 'req.session.email.email:', req.session.user.email); //* ** Dimka ***
  console.log('\x1b[35m', 'res.locals.useremail:', res.locals.useremail); //* ** Dimka ***
  next();
});


// app.get('/', (req, res) => { // тестовая ручка
//   res.render('index')
// });

// app.get('/regForm', (req, res) => {
//   res.render('regForm')
// })

// app.get('/logForm', (req, res) => {
//   res.render('logForm')
// })

app.use('/', indexRouter);
app.use('/auth', authRouter);
// app.use('/entries', entriesRouter);



app.listen(PORT, () => {
  console.log(`>>> Server Started at PORT: ${PORT} ...(+)`);
});
