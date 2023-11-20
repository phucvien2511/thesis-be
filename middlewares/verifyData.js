const verifyData = (value) => {
    // If value can be converted to a number, return true
    return !isNaN(Number(value));
}

module.exports = { verifyData };