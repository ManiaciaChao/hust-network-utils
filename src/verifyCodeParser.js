process.stdout = null;
const Tesseract = require('tesseract.js');
const tesseract = require('tesseractocr')

// const recognize = tesseract.withOptions({
//     oem:0,
//     psm: 7,
//     configfiles: './tesseract.conf',
//     tessdataDir: '/home/user7z1w40/projects/hust-network-utils/src'
// })

// const verifyCodeParser = async Readable => {
//     try {
//         const code = (await recognize(Readable)).trim();
//         console.log(code)
//         return code;
//     } catch(e){
//         console.log(e);
//     }
// }

const verifyCodeParser = async img => {
    let code;
    await Tesseract.recognize(img, {
    tessedit_char_whitelist: `AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789`
    })
        .then(data => (code = data));
        // console.log(code.words[0].text)
    return code.words[0].text;
};

// verifyCodeParser('./U201814494.gif')

module.exports = verifyCodeParser;
