function queryId() {
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
                if (chosenItem.stock_qty > parseInt(answer.amount)) {
                    //there is enough in stock so update db.
                    var newStock = chosenItem.stock_qty -= answer.amount
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_qty: newStock
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Thank You for your order!");
                            listItems();
                        }
                    );
                }
                else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("There is not enough in stock, please retry your order with a lower quantity.");
                    listItems();
                }
            });
    });
}