const ValidatorJS = require('validatorjs');

const sequelize = require('../config/SequelizeConfig');

/**
 *
 * @param {*} data
 * @param {ValidatorJS.Rules} rules
 * @returns {[passes, *, ValidatorJS.Errors]} validation
 */
function validate(data, rules) {
  const valid = new ValidatorJS(data, rules);
  return [valid.passes(), valid.input, valid.errors.all()];
}

/**
 *
 * @param {any} value
 * @returns {boolean} validation response depending on the chosed validating function
 */
function validateAsync(value) {
  return {
    exists: async (rule) => {
      const [model, attribute] = rule.split(':');
      const user = await sequelize.model(model).findOne({ attributes: ['id'], where: { [attribute]: value } });
      if (user) return true;
      return false;
    }
  };
}

module.exports = {
  validate,
  validateAsync
};
