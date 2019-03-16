process.stdout = null;
const Tesseract = require('tesseract.js');

const verifyCodeParser = async src => {
    let code;
    await Tesseract.recognize(src, {
        tessedit_char_blacklist: `~!@#$%^&*()_+-=[]{}\  |;':",./<>? `
    })
        .then(data => (code = data))
        .finally(() => Tesseract.terminate());
    return code.words[0].text;
};

module.exports = verifyCodeParser;
