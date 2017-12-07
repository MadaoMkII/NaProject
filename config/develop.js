module.exports = {
    port: 8001,
    url: 'mongodb://localhost:27017/cats',
    session: {
        secret: 'abc',
        resave: true,
        saveUninitialized: true
    },
    saltword: 'ABL'
};