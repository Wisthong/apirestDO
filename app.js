require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connection } = require("./db/connection");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3010;

/**
 * API Rest
 */
app.use("/api", require("./routes"));

app.listen(port, () =>
  console.log(`Tu server esta listo por el puerto ${port}`)
);

/**
 * Define your database engine
 */

// dbConnectMySQL();
