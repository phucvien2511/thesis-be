const verifyData = (data) => {
    // If value can be converted to a number, return true
    return !isNaN(Number(data.value));
}

module.exports = { verifyData };