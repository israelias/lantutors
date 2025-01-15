require('@babel/register');
const models = require('./models/');

const MAX_RETRIES = 3;

export const truncate = async (retries = 0) => {
  try {
    return await Promise.all(
      Object.keys(models).map((key) => {
        if (['sequelize', 'Sequelize'].includes(key)) return null;
        return models[key].destroy({ where: {}, force: true });
      })
    );
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('Deadlock') && retries < MAX_RETRIES) {
      return truncate(retries + 1);
    }
    throw error;
  }
};