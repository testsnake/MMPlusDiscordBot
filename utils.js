

// RegExp test
function rxt(reg, str) {
    return reg.test(str);
}

// truncate string
function ts(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    }

    return str.slice(0, maxLength);
}

let globalVars = {}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


module.exports = {
    rxt,
    ts,
    globalVars,
    delay,

}