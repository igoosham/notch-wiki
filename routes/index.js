const express = require("express");

const partA = require("./partA");
const partB = require("./partB");
const partC = require("./partC");

const router = express.Router();

router.use(partA);
router.use(partB);
router.use(partC);

module.exports = router;
