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
  if (err)throw err;
  console.log("Connection established!");
  chooseAction();
});

function chooseAction() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "Choices",
                choices: [
                    new inquirer.Separator(),
                    "View All Products",
                    "View Low Inventory",
                    "Add Inventory",
                    "Add New Product",
                    "Exit",
                    new inquirer.Separator()
                ]
            }
        ])
        .then(function(answer) {
            var searchTerm = answer.Choices;

            switch (searchTerm) {
                case "View All Products":
                    connection.query("SELECT * FROM products", function(
                        err,
                        res,
                    ) {
                        if (err) throw err;
                        dataResult = res;
                        console.table(res)
                        console.log(
                            "\n" + "Run 'node bamazonManager' again to return to the choices menu."
                        );
                    });
                    endConncetion();
                    break;

                case "View Low Inventory":
                    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(
                        err,
                        res
                    ) {
                        dataResult = res;
                        if (err) throw err;
                        console.table(res);
                        console.log(
                            "\n" + "Run 'node bamazonManager' again to return to the choices menu."
                        );
                    });
                    endConnection();
                    break;

                case "Add Inventory":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Product ID?",
                                name: "choice",
                                validate: function(val) {
                                    return !isNaN(val);
                                }
                            },
                            {
                                type: "input",
                                message: "How many to add?",
                                name: "quantityAdded",
                                validate: function(val) {
                                    return val > 0;
                                }
                            }
                        ])

                    // I should break this into two or three separate functions
                    // First display the current stock for selected item
                    // Second prompt for the quantity to add
                    // THird update the stock of the item

                        .then(function(res, answer) {
                            var addStock = answer;
                            // var quantityAdded = answer;
                            console.log(res);
                            console.log(res[0]);
                            console.log(Number.parseInt(res.addStock));
                            // var newStock  = newStock + Number.parseInt(res.quantityAdded);
                            // console.log(newStock);
                            console.log(typeof(res.addStock));

                            updateStock(addStock, res)
                        });
                    break;

                case "Add New Product":
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Product name?",
                                name: "productName"
                            },
                            {
                                type: "input",
                                message: "Product department?",
                                name: "productDepartment"
                            },
                            {
                                type: "input",
                                message: "How many to add?",
                                name: "productQuantity"
                            },
                            {
                                type: "input",
                                message: "Price per product?",
                                name: "productPrice"
                            }
                        ])
                        .then(function(answer) {
                            addNewProduct(answer);
                        });
                        break;

                case "Exit":
                    endConnection();
                    break;

                default:
                    console.log(
                        "Please select a valid option from the list below."
                    );
                    askQuestion();
                    break;
            };
        });
};

function endConnection() {
    connection.end();
};

function updateStock(addStock, res) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
        [addStock, res.item_id],
    function(err, res) {
        if (err) console.log(err);
        newStock =
            Number.parseInt(res.stock_quantity) +
            Number.parseInt(res.addStock);

        // connection.query(
        //     "UPDATE products SET ? WHERE ?",
        //     [
        //         {
        //             stock_quantity: newStock
        //         },
        //         {
        //             item_id: addStock
        //         }
        //     ]
        //     );
            // function(err, res) {
            //     if (err) throw err;
                console.log("Stock updated successfully");
                console.log("\n" + "Run 'node bamazonManager' again to return to the choices menu.");

    })
        // endConnection();
}


// function addNewProduct(answer) {
//     var newProductQuery =
//     "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?)";
//     var values = [
//         answer.productName,
//         answer.productCategory,
//         Number.parseInt(answer.productCost),
//         Number.parseInt(answer.productQuantity)
//     ];
//     connection.query(newProductQuery, [values], function(err, result) {
//         if (err) throw err;
//         console.log("Added new product");
//         console.log(
//              "\n" + "Run 'node bamazonManager' again to return to the choices menu."
//         );
//         endConnection();
//     });
// };


// const viewLowInventory = function() {
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//         if (res[i].quantity < 5) {
//       console.log(
//         res[i].item_id +
//           " | " +
//           res[i].product_name +
//           " | " +
//           res[i].department_name +
//           " | " +
//           res[i].price +
//           " | " +
//           res[i].stock_quantity
//       );
//     };
//     };
//     console.log("-----------------------------------");
//   });
// };


// function makePurchase() {
//   connection.query("SELECT * FROM products", function (err, results) {
//       if (err) throw err;
//       // once you have the items, prompt the user for which they'd like to bid on
//       inquirer
//           .prompt([
//               {
//                   name: "choice",
//                   type: "rawlist",
//                   choices: function () {
//                       var choiceArray = [];
//                       for (var i = 0; i < results.length; i++) {
//                           choiceArray.push(results[i].product_name);
//                       }
//                       return choiceArray;
//                   },
//                   message: "What would you like to do?"
//               },
//               {
//                   name: "amount",
//                   type: "input",
//                   message: "How many would you like to buy?"
//               }
//           ])
//           .then(function (answer) {
//               // get the information of the chosen item
//               var chosenItem;
//               for (var i = 0; i < results.length; i++) {
//                   if (results[i].product_name === answer.choice) {
//                       chosenItem = results[i];
//                       console.log(chosenItem)
//                   }
//               }
//               if (chosenItem.stock_quantity > parseInt(answer.amount)) {
//                   //there is enough in stock so update db.
//                   var newStock = chosenItem.stock_quantity -= answer.amount
//                   connection.query(
//                       "UPDATE products SET ? WHERE ?",
//                       [
//                           {
//                               stock_quantity: newStock
//                           },
//                           {
//                               item_id: chosenItem.item_id
//                           }
//                       ],
//                       function (error) {
//                           if (error) throw err;
//                           console.log("\n" + "Thank you for using Bamazon!" + "\n");
//                           console.log("Total cost: $" + parseInt(answer.amount) * parseInt(chosenItem.price));
//                           start();
//                       }
//                   );
//               }
//               else {
//                   // bid wasn't high enough, so apologize and start over
//                   console.log("There is not enough in stock. Please retry your order with a lower quantity.");
//                   start();
//               }
//           });
//   });
// }
