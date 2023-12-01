const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middleWare/errorHandler");
const Constant = require("./utils/constant");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const port = Constant.PORT;

const app = express();

connectDB();
app.use(fileUpload());
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.use("/api/assets", express.static("assets"));

app.use("*", (req, res) => {
  res.status(400);
  throw new Error("Endpoint not found");
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
