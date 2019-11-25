var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection established!");
  start();
  makePurchase();
});

const start = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          " | " +
          res[i].product_name +
          " | " +
          res[i].department_name +
          " | " +
          res[i].price +
          " | " +
          res[i].stock_quantity
      );
    }
    console.log("-----------------------------------");
  });
};

function makePurchase() {
  connection.query("SELECT * FROM products", function (err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
          .prompt([
              {
                  name: "choice",
                  type: "rawlist",
                  choices: function () {
                      var choiceArray = [];
                      for (var i = 0; i < results.length; i++) {
                          choiceArray.push(results[i].product_name);
                      }
                      return choiceArray;
                  },
                  message: "What item would you like to buy?"
              },
              {
                  name: "amount",
                  type: "input",
                  message: "How many would you like to buy?"
              }
          ])
          .then(function (answer) {
              // get the information of the chosen item
              var chosenItem;
              for (var i = 0; i < results.length; i++) {
                  if (results[i].product_name === answer.choice) {
                      chosenItem = results[i];
                      console.log(chosenItem)
                  }
              }
              if (chosenItem.stock_quantity > parseInt(answer.amount)) {
                  //there is enough in stock so update db.
                  var newStock = chosenItem.stock_quantity -= answer.amount
                  connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                          {
                              stock_quantity: newStock
                          },
                          {
                              item_id: chosenItem.item_id
                          }
                      ],
                      function (error) {
                          if (error) throw err;
                          console.log("\n" + "Thank you for using Bamazon!" + "\n");
                          console.log("Total cost: $" + parseInt(answer.amount) * parseInt(chosenItem.price));
                          start();
                      }
                  );
              }
              else {
                  // bid wasn't high enough, so apologize and start over
                  console.log("There is not enough in stock. Please retry your order with a lower quantity.");
                  start();
              }
          });
  });
}