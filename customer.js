var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(err){
    if(err) {
        throw err
    } else{
        displayStuff();
    }    
});

function displayStuff(){
    connection.query('SELECT * FROM products', function(err, res){
        if (err){
            throw err;
        }
        console.log(res);
        askForStuff(res)
    })
}
function askForStuff(stuff){
    inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'Input the ID of the product you want.'
        }
    ]).then(function(res){
        var id = parseInt(res.choice);
        var item = doWeGot(id, stuff);

        if(item){
            howMuch(item);
        }else{
            console.log('We are out of stock for that item.');
            displayStuff();
        }
    });
}
function doWeGot(id, stuff){
    for (let i = 0; i < stuff.length; i++){
        if (stuff[i].item_id === id){
            return stuff[i]
        }
    }
    return null;
}
function howMuch(item){
    inquirer.prompt([
        {
            type: 'input',
            name: 'quantity',
            message: 'How many will you be purchasing?'
        }
    ]).then(function(res){
        var ammount = parseInt(res.quantity);

        if (ammount > item.stock_quantity){
            console.log('We arent carrying that much of that product at the moment.');
            displayStuff();
        } else {
            transaction(item, ammount)
        }
    })
}
function transaction(item,quantity) {
    connection.query(
        'UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id = ?',
        [quantity, item.item_id],
        function(err, res) {
        console.log('purchaed' + quantity + ' ' + item.product_name)
        displayStuff();
        }
    )
}