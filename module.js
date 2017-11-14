const ab = require('./models/angent');
const dateFormat = require('dateformat');

// ab.isDuplicationName('abc2', (err, data) => {
//
//     console.log(data);
// });

ab.getAllAgent((err, data) => {

    let x = new Date();
    let u = dateFormat(x, 'yyyy-mm-dd,HH:MM:ss ')
    console.log(u);
})