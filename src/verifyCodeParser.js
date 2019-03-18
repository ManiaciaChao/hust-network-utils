const Tesseract = require('tesseract.js');

const verifyCodeParser = async img => {
    let code;
    await Tesseract.recognize(img, {
        tessedit_char_whitelist: `AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789`
    })
        .then(data => (code = data));
    // console.log(code.words[0].text)
    return code.words[0].text;
};

module.exports = verifyCodeParser;
