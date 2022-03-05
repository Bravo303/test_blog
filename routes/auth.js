const express = require('express');
const {
  checkUserAndCreateSession,
  createUserAndSession, destroySession,
  isValid,
  renderSignInForm,
  renderSignUpForm
} = require("../controllers/authCon");

const router = express.Router();

router
  .route('/regForm')
  // Страница регистрации пользователя
  .get(renderSignUpForm) // посылаю в командную строку - страница!
  // Регистрация пользователя
  .post(isValid, createUserAndSession); // Посылаю данные на сервер! - функции валид и создать

router
  .route('/logForm')
  // Страница аутентификации пользователя
  .get(renderSignInForm)
  // Аутентификация пользователя
  .post(checkUserAndCreateSession);

router.get('/logOut', destroySession);

module.exports = router;
