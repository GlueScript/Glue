var app = require('express')(),
    bodyParser = require('body-parser');

app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
app.use(bodyParser.text({type : 'application/xml'}));
app.use(bodyParser.json({type : 'application/json'}));

// use env.PORT if set
var PORT = 8781;

// App
app.get('/', function (req, res) {
    res.json({"description":"Glue - scripting for services"});
});

app.post('/', function(req, res) {
    // accept a script in the body of the request
    var body = req.body;
});

app.listen(PORT);

console.log('Running on http://localhost:' + PORT);
