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
                        fields
                    ) {
                        if (err) throw err;
                        dataResult = res;
                        console.log(
                            "\n" +
                            "id | name | department | price | stock" +
                            "\n" +
                            "|==|=====|===========|======|======|"
                        );
                        for (var i=0; i < dataResult.length; i++) {
                            console.log(
                                dataResult[i].item_id +
                                " | " +
                                dataResult[i].product_name +
                                " | " +
                                dataResult[i].department_name +
                                " | " +
                                dataResult[i].price +
                                " | " +
                                dataResult[i].stock_quantity
                            );
                        }
                        console.log(
                            "\n" + "Run 'node bamazonManager' again to return to the choices menu."
                        );
                    });
                    endConncetion();
                    break;

                case "View Low Inventory":
                    connection.query("SELECT * FROM products", function(
                        err,
                        res,
                        fields
                    ) {
                        dataResult = res;
                        if (err) throw err;
                        console.log(
                            "\n" +
                            "id | name | stock" +
                            "\n" +
                            "===|======|======="
                        );
                        for (var i=0; i < dataResult.length; i++) {
                            if (dataResult[i] < 5) {
                                console.log(
                                dataResult[i].item_id +
                                " | " +
                                dataResult[i].product_name +
                                " | " +
                                dataResult[i].stock_quantity
                                );
                            };
                        };
                        console.log(
                            "\n" + "Run 'node bamazonManager' again to return to the choices menu."
                        );
                    });
                    endConnection();
                    break;
            }
        })
};

function endConnection() {
    connection.end();
};
