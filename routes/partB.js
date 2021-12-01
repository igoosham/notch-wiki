const express = require("express");
const wiki = require("wikijs").default;
const { validateName, validateLang } = require("../misc/validators");

const router = express.Router();

router.get("/b/introduction/:articleName", async (req, res) => {
  const lang = req.headers["accept-language"].toLowerCase();

  const isValidLang = validateLang(lang);

  if (!isValidLang) {
    const message = `Accept-Language header value consist of two letters only`;
    res.status(400).send(message);
    return;
  }

  const { articleName } = req.params;

  const isValidName = validateName(articleName);

  if (!isValidName) {
    const message = `Article name can only comprise of letters, hyphens (-), underscores (_) and numbers`;
    res.status(400).send(message);
    return;
  }

  let summary;

  const apiUrl = `https://${lang}.wikipedia.org/w/api.php`;

  try {
    summary = await wiki({ apiUrl })
      .page(articleName)
      .then((page) => page.summary());
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }

  const result = {
    scrapeDate: new Date().getTime(),
    articleName,
    introduction: summary,
  };

  res.status(200).send(result);
});

module.exports = router;
