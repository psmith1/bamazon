DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

USE bamazon_DB;
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('hoses', 'garden', 5, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('buckets', 'garden', 5, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('blenders', 'kitchen', 10, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('frying pans', 'kitchen', 10, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('kettles', 'kitchen', 5, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('shirts', 'clothing', 20, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('jeans', 'clothing', 30, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('pants', 'clothing', 30, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('socks', 'clothing', 20, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('hats', 'clothing', 10, 20);

