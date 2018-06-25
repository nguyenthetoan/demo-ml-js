import reformat from 'reformat-number';
import bar from './bar';
import trainingData from './trainData';
import brain from 'brain.js';

console.info('nodeEnv:', process.env.NODE_ENV);
console.info('VERSION:', VERSION);
console.info('PRODUCTION:', PRODUCTION);
console.info('DEBUG:', DEBUG);

if (DEBUG) {
    console.info('Debug message');
    console.info('Code fragment using DefinePlugin:', CODE_FRAGMENT);
}

if (PRODUCTION) {
    console.info('Production code', reformat('75900.56'));
} else {
    console.info('Development code');
}

function encode(string) {
    const s = nonAccentVietnamese(string);
    return s.split('').map(c => c.charCodeAt())
}

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

function processDataSet() {
    return trainingData.map(item => {
        return {
            input: encode(item.input),
            output: item.output
        }
    })
}

console.info(reformat('1123581321'));
let net = new brain.recurrent.LSTM();
net.train(processDataSet(), {log: true, iterations: 406});

window.predict = function(input) {
    return net.run(encode(input));
}
