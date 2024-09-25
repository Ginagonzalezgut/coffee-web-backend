const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

require("dotenv").config();
const server = express();

server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

const port = 5001;
server.listen(port, () => {
  console.log("Server is running on port http://localhost:" + port);
});

console.log(process.env);
async function getDBConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  connection.connect();
  return connection;
}

server.get("/coffee", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const query =
      "SELECT coffee.id_coffee, coffee.name, coffee.photo_url, country.name as country, shops.name as shop FROM coffee, country, shops WHERE coffee.fk_shops= shops.id_shop AND coffee.fk_country = country.id_country";
    const [result] = await connection.query(query);

    connection.end();

    res.status(200).json({
      info: "sucess",
      results: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

server.get("/shops", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const queryShops = "SELECT * FROM shops";
    const [result] = await connection.query(queryShops);

    connection.end();

    res.status(200).json({
      info: "sucess",
      results: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

server.get("/coffee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const connection = await getDBConnection();
    const queryId = "SELECT * FROM coffee WHERE id_coffee=?";
    const [result] = await connection.query(queryId, [id]);

    connection.end();

    res.status(200).json({
      status: "sucess",
      results: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

server.get("/countries", async (req, res) => {
  const connection = await getDBConnection();
  const queryCountries = "SELECT * FROM country ";
  const [result] = await connection.query(queryCountries);
  connection.end();
  res.status(200).json({
    status: "success",
    results: result,
  });
});

server.post("/coffee", async (req, res) => {
  console.log(req.body);

  const {
    name,
    altitude_min,
    altitude_max,
    provider,
    note,
    country,
    shop,
    photo_url,
  } = req.body;
  const connection = await getDBConnection();
  const queryCoffee =
    "INSERT INTO coffee(name, altitude_min,altitude_max,provider,note,fk_country,fk_shops,photo_url)VALUES(?,?,?,?,?,?,?,?)";
  const [result] = await connection.query(queryCoffee, [
    name,
    altitude_min,
    altitude_max,
    provider,
    note,
    country,
    shop,
    photo_url,
  ]);
  connection.end();
  res.status(200).json({
    status: "success",
    results: result,
  });
});
server.get("/shop/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const connection = await getDBConnection();
    const queryShop = "SELECT * FROM shops WHERE id_shop=?";
    const queryCoffees = "SELECT * FROM coffee WHERE fk_shops=?";
    const [resultShop] = await connection.query(queryShop, [id]);
    const [resultCoffee] = await connection.query(queryCoffees, [id]);

    connection.end();

    res.status(200).json({
      status: "sucess",
      shop: resultShop[0],
      coffees: resultCoffee,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});
