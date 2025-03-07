const { check } = require("express-validator");
const { validateResult } = require("../helpers/handleValidator");

const validatorDO = [
  check("id_item", "El id_item es obligatorio").exists().notEmpty().isString(),
  check("lapso_inicio", "El lapso_inicio es obligatorio")
    .exists()
    .notEmpty()
    .isString(),
  check("lapso_fin", "El lapso_fin es obligatorio")
    .exists()
    .notEmpty()
    .isString(),
  check("id_co", "El id_co es obligatorio").exists().notEmpty().isString(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validatorDO };
