const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult, query } = require("express-validator");

require("dotenv").config();
const server = express();

server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

const port = process.env.PORT;
server.listen(port, () => {
  console.log("Server is running on port http://localhost:" + port);
});

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
    console.log(err);
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
    console.log(err);
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

server.get("/large-groups", async (req, res) => {
  const connection = await getDBConnection();
  const queryLargeGroups = "SELECT * FROM shops WHERE fk_shop_type = ?";
  const [result] = await connection.query(queryLargeGroups, [3]);

  connection.end();
  res.status(200).json({
    status: "success",
    results: result,
  });
});

server.get("/gelato", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const queryGelato = "SELECT * FROM shops WHERE fk_shop_type = ?";
    const [result] = await connection.query(queryGelato, [6]);

    connection.end();

    res.status(200).json({
      status: "success",
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
server.get("/breweries", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const queryBrewery = "SELECT * FROM shops WHERE fk_shop_type = ?";
    const [result] = await connection.query(queryBrewery, [1]);

    connection.end();

    res.status(200).json({
      status: "success",
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

server.get("/rooftops", async (req, res) => {
  const connection = await getDBConnection();
  const queryRooftops = "SELECT * FROM shops WHERE fk_shop_type = ?";
  const [result] = await connection.query(queryRooftops, [5]);
  connection.end();

  res.status(200).json({
    status: "success",
    results: result,
  });
});

server.get("/specialty-coffee-shops", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const querySpecialtyCoffee = "SELECT * FROM shops WHERE fk_shop_type = ?";
    const [result] = await connection.query(querySpecialtyCoffee, [4]);

    connection.end();

    res.status(200).json({
      status: "success",
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

server.get("/brunch", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const queryBrunches = " SELECT * FROM shops WHERE fk_shop_type = ?";
    const [result] = await connection.query(queryBrunches, [2]);
    connection.end();
    res.status(200).json({
      status: "success",
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
server.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const connection = await getDBConnection();
    const passwordHahsed = await bcrypt.hash(password, 10);
    const queryAddUser =
      "INSERT INTO users(username,email,password) VALUES (?,?,?)";
    const [newUserResult] = await connection.query(queryAddUser, [
      username,
      email,
      passwordHahsed,
    ]);
    connection.end();

    const infoToken = {
      email: newUserResult[0].email,
      id_user: newUserResult[0].id_user,
    };
    const token = jwt.sign(infoToken, "clave_secreta", {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    console.log(err);

    let message = "Internal server error";

    if (err.code === "ER_DUP_ENTRY") {
      message = "User already exists";
    }

    res.status(500).json({
      status: "error",
      message,
    });
  }
});
server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const connection = await getDBConnection();
  const queryEmail = "SELECT * FROM users WHERE email = ?";
  const [userResult] = await connection.query(queryEmail, [email]);

  connection.end();

  console.log(userResult);

  if (userResult.length > 0) {
    const isSamePassword = await bcrypt.compare(
      password,
      userResult[0].password
    );

    if (isSamePassword) {
      const infoToken = {
        email: userResult[0].email,
        id_user: userResult[0].id_user,
      };
      const token = jwt.sign(infoToken, "clave_secreta", {
        expiresIn: "1h",
      });
      res.status(200).json({
        status: "success",
        token: token,
      });
    } else {
      res.status(403).json({
        status: "error",
        message: "Credenciales inválidas",
      });
    }
  } else {
    res.status(403).json({
      status: "error",
      message: "Usuario no encontrado",
    });
  }
});
