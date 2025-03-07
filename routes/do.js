const express = require("express");
// const { validatorCustomer, validatorID } = require("../validators/customers");
const router = express.Router();
const { postDO, uploadFile } = require("../controller/do");
const { validatorDO } = require("../validators/do");

router.post("/", [validatorDO, postDO]);
router.post("/upload", [uploadFile]);

module.exports = router;
