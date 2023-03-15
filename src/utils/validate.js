const ValidatorJS = require("validatorjs")

const sequelize = require("../config/SequelizeConfig");

function validate(data, rules) {
  let valid = new ValidatorJS(data, rules)
  return [valid.passes(), valid.input, valid.errors.all()]
}

function validateAsync(value) {
  return {
    exists: async (rule) => {
      let [model, attribute] = rule.split(":")
      let project = await sequelize.model(model).findOne({ attributes: ["id"], where: { [attribute]: value } })
      if (project?.id) return true
      else return false
    }
  }
}


module.exports = {
  validate,
  validateAsync
}
