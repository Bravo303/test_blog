const bcrypt = require('bcrypt');
const { User } = require('../db/models');

exports.isValid = (req, res, next) => { // в папку мидлвееер
  const { username, password, email } = req.body;
  console.log(req.body)
  if (username && password && email) next();
  else res.status(401).end();
};

exports.createUserAndSession = async (req, res, next) => {
  const { username, password, email } = req.body;
  console.log('req.body: ', req.body);
  try {
    // Мы не храним пароль в БД, только его хэш
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // записываем в req.session.user данные (id & name) (создаем сессию)
    req.session.user = { id: user.id, name: user.username, email: user.email }; // req.session.user -> id, name
    console.log(req.session.user)
  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    return failAuth(res, err.message);
  }
  //res.json({ 'status': 200 }) //otvet Json 200 при использование фича !
  res.redirect('/') // Добавили с Эндрю!
};

exports.checkUserAndCreateSession = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // Пытаемся сначала найти пользователя в БД
    const user = await User.findOne({ where: { username: username }, raw: true });
    if (!user) return failAuth(res, ' Нет такого пользователя!');

    // Сравниваем хэш в БД с хэшем введённого пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return failAuth(res, 'Неправильный пароль!');

    req.session.user = { id: user.id, name: user.username, email: user.email }
    // req.session.user = { id: user.id, name: user.username }; // записываем в req.session.user данные (id & name) (создаем сессию)

  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    return failAuth(res, err.message);
  }
  res.json({ 'status': 200 }) //otvet Json 200 при использование фича !
};

exports.destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('sid');
    res.redirect('/');
  });
}

exports.renderSignInForm = (req, res) => res.render('logForm', { isSignin: true });

exports.renderSignUpForm = (req, res) => res.render('regForm', { isSignup: true });

/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 * @param err  сообщение об ошибке
 */
function failAuth(res, err) {
  return res.status(401).json({ err: err });
}
