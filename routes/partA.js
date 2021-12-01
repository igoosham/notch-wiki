const express = require("express");
const wiki = require("wikijs").default;
const { validateName } = require("../misc/validators");

const router = express.Router();

router.get("/a/introduction/:articleName", async (req, res) => {
  const { articleName } = req.params;

  const isValid = validateName(articleName);

  if (!isValid) {
    const message = `Article name can only are comprise of letters, hyphens (-), underscores (_) and numbers`;
    res.status(400).send(message);
    return;
  }

  let summary;

  try {
    summary = await wiki({ apiUrl: "https://en.wikipedia.org/w/api.php" })
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
