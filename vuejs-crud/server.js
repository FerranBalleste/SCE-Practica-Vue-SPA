var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var paypal = require('paypal-rest-sdk');
var app = express();

var PRODUCTS_FILE = path.join(__dirname, 'src/assets/js/components/product-data.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - thims allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

paypal.configure({ 
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'AR-lNrChOfCCPAF4RCwnrZhkpg3bB5F5jrUhMwMfY2XsBnJ_UnoAMO7us71rLF9PmFHjRX455iB4hnxx', // please provide your client id here 
    'client_secret': 'EG3nQ2w4UkODc_9I_0QDkFLYwBMXOYsZvaU8JfWE4gukMdPXghNt_NVnVkCoSVObw1ZFzT8tQtfdfjWO' // provide your client secret here 
});
   
const cities = [
    "Tarragona","Reus", "Torredembarra", "Girona", "Torregrossa", "Toledo", 
    "Manresa", "Terrassa", "Cambrils", "Castelldefels", "Tarrés", "Tivissa", 
    "Torrebesses", "Torrefarrera", "Tossa de Mar"];

app.post('/checkout' , (req , res) => {
    console.log(req.body);
    var execute_payment_json = {
        "payer_id": req.body.data.payerID,
    };
    const payment = {};
    payment.amount = req.body.data.amount;
    const paymentID = req.body.data.paymentID;
    paymentPaypal(paymentID, execute_payment_json, payment,(err, result) => {
        if(err) {
            res.status(400).json(JSON.stringify(err));
        } else {
            console.log(res.status(200).json(payment));
        }
    });
});
app.get('/process', function(req, res){ 
    var paymentId = req.query.paymentId; 
    var payerId = {'payer_id': req.query.PayerID }; 
    paypal.payment.execute(paymentId, payerId, function(error, payment){ 
    if(error){ 
    console.error(error); 
    } else { 
    if (payment.state == 'approved'){ 
    res.send('payment completed successfully'); 
    } else { 
    res.send('payment not successful'); 
    } 
    } 
    }); 
});
app.get('/api/city/:city', function(req, res) {
    citiesStart = []
    console.log(req.params.city);
    iter = 0
    input = req.params.city.toUpperCase()
    for (city2 in cities) {
        if (cities[city2].toUpperCase().startsWith(input)) {
            citiesStart.push(cities[city2]);
            iter++
        }
        if(iter == 5)
            break
    }
    console.log(citiesStart);
    res.json(citiesStart);
});

app.get('/api/search/:city', function(req, res) {
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var json = JSON.parse(data);
        var result = []

        for(var i = 0; i <= json.length-1; i++)
        {
            city_array = json[i]['unavailable']
            var found = false
            for(var j = 0; j <= city_array.length-1; j++)
                if(city_array[j] == req.params.city)
                    found = true
            if(!found)
                result.push(json[i])
        }

        console.log(result);
        res.json(result);
    });
});

app.get('/api/product/:id', function(req, res) {

    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        var json = JSON.parse(data);

        for(var i = 0; i <= json.length; i++)
        {
            if(json[i]['id'] == req.params.id)
            {
                res.json(json[i]);
                break;
            }
        }
    });
});

app.post('/api/product/create', function(req, res) {

    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var products = JSON.parse(data);

        var newProduct = {
            id: Date.now(),
            name: req.body.name,
            price: req.body.price,
        };
        products.push(newProduct);
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 4), function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(products);
        });
    });
});

app.patch('/api/product/edit/:id', function(req, res) {
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var products = JSON.parse(data);

        for(var i = 0; i <= products.length; i++)
        {
            if(products[i]['id'] == req.params.id)
            {
                var product = products[i];
                product.name = req.body.name;
                product.price = req.body.price;

                products.splice(i, 1);
                products.push(product);

                fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(products);
                });
                break;
            }
        }
    });
});

app.delete('/api/product/delete/:id', function(req, res) {
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var products = JSON.parse(data);

        for(var i = 0; i <= products.length; i++)
        {
            if(products[i]['id'] == req.params.id)
            {
                products.splice(i, 1);

                fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(products);
                });
                break;
            }
        }
    });
    
});
var paymentPaypal = (paymentID, execute_payment_json, payment, cb) => {
    paypal.payment.execute(paymentID, execute_payment_json,(error, paymentLog) => {
        if (error)
        {
            return cb(error);
        }
        else
        {
            // the server logic after successful payment
            // here just print out the payment information to the console
            payment.email = paymentLog.payer.payer_info.email;
            payment.first_name = paymentLog.payer.payer_info.first_name;
            payment.last_name = paymentLog.payer.payer_info.last_name;
            console.log(payment);
            cb(null, JSON.stringify(payment));
       }
    });
}  
app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});