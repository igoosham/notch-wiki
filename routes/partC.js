const express = require("express");
const wiki = require("wikijs").default;
const jwt = require("jsonwebtoken");

const { validateName, validateLang } = require("../misc/validators");

const controller = require("../controller/inMemory");

const router = express.Router();

router.get("/c/introduction/:articleName", async (req, res) => {
  const token = req.headers["x-authorization"];

  let lang;

  try {
    lang = controller.get(token);
  } catch ({ message }) {
    res.status(400).send(message);
    return;
  }

  const { articleName } = req.params;
  const isValidName = validateName(articleName);
  if (!isValidName) {
    const message = `Article name can only are comprise of letters, hyphens (-), underscores (_) and numbers`;
    res.status(400).send(message);
    return;
  }

  let summary;
  const apiUrl = `https://${lang}.wikipedia.org/w/api.php`;
  try {
    summary = await wiki({ apiUrl })
      .page(articleName)
      .then((page) => page.summary());
  } catch ({ message }) {
    res.status(400).send(message);
    return;
  }

  const result = {
    scrapeDate: new Date().getTime(),
    articleName,
    introduction: summary,
  };

  res.status(200).send(result);
});

router.post("/c/user", (req, res) => {
  const { userName, language } = req.body;
  console.log({ userName, language });

  const errors = [];

  const isValidLang = validateLang(language);
  if (!isValidLang) {
    errors.push(`Language should consist of two letters only.`);
  }

  const isValidName = validateName(userName);
  if (!isValidName) {
    errors.push(`User name can only comprise of letters, hyphens (-), underscores (_) and numbers`);
  }

  if (errors.length) {
    res.status(400).send(errors);
    return;
  }

  var token = jwt.sign({ userName, language }, "myVerySecretKey");

  controller.add(token, language);

  res.status(200).send(token);
});

module.exports = router;
