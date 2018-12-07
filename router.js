const authentication = require('./controllers/authentication')

module.exports = app => {
    app.post('/singup', authentication.singup)
    app.post('/singin', authentication.requireAuth, authentication.singin)
}