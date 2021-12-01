function validateName(value) {
  const validator = /^[0-9A-Za-z\-\_]+$/;
  return validator.test(value);
}

function validateLang(value) {
  const validator = /^[a-z]{2}$/;
  return validator.test(value);
}

module.exports = { validateName, validateLang };
