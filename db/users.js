var records = [
    {
        id: 1,
        username: 'abc',
        password: '123',
        role: 'Super_Admin',
        displayName: 'Jack', 'country': 'CHINA',
        emails: [{value: 'jack@example.com'}]
    }
    , {
        id: 2,
        username: 'abc2',
        password: '123', role: 'Admin', 'country': 'USA',
        displayName: 'Jill',
        emails: [{value: 'jill@example.com'}]
    }
];


exports.findByUsername = function (username, callback) {

    for (let element of records) {
        if (element.username === username) {

            return callback(null, element);
        }
    }

    return callback({success: false, message: 'Authentication faild'}, null);

}


