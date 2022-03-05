const { sequelize } = require('../models')

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log('>>> База подключена ...(+) <<<');
  } catch (error) {
    console.error('>>> Невозможно подключиться к Базе Дынных <<<', error.message)
  }
};
