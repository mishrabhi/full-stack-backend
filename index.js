const express = require("express");
const connect = require("./config/db");
const cors = require("cors");
// const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");

require("dotenv").config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(1234, async () => {
  await connect();
  console.log("Server is up and running on port 1234");
});
