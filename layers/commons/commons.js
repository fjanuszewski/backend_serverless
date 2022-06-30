const responseHandler = (error, result) => ({
    statusCode: (error) ? error.response.status : 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: (error) ? JSON.stringify(error.response.data) : JSON.stringify(result)
});

module.exports = {
    responseHandler
};