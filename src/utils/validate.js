const ValidatorJS = require('validatorjs');

const sequelize = require('../config/SequelizeConfig');

/**
 *
 * @param {*} data
 * @param {ValidatorJS.Rules} rules
 * @returns {[passes, *, ValidatorJS.Errors]} validation
 */
function validate(data, rules) {
  ValidatorJS.register("password_validations", (value) => {
    return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(value)
  }, "A password must contain at least one capital letter, one small letter, one special character")

  ValidatorJS.register("name_validations", (value) => {
    return /^[A-Za-z\s]*$/.test(value)
  }, "A name must contain alpha letters and space only")


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
