const Tesseract = require('tesseract.js');

const verifyCodeParser = async src => {
    const code = await Tesseract.recognize(src, { lang: 'eng' });
    return code.words[0].text;
};

module.exports = verifyCodeParser;
