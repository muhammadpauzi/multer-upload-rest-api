const response = (res = {}, code = 200, body = {}) => {
    return res.status(code).json(body);
}

module.exports = response;