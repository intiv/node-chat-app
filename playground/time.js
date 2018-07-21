const moment = require('moment');

let date = moment();

console.log(date.format('Do of MMM, YYYY'));

//Challenge: 10:35 am format, no padding for hours, yes for minutes (eg: 06:05 am -> 6:05 am)

console.log(date.format('h:mm a'));