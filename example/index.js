function isAdult(user) {
    return user.age >= 18;
}
var justine = {
    name: 'Justine',
    age: 23,
};
var isJustineAnAdult = isAdult(justine);
console.log(isJustineAnAdult);
var express = require('express');
var app = express();
var port = 3000;
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
