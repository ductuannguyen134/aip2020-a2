const express = require("express");
require("dotenv").config(); // for loading environment variables
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const user = require("./routes/api/user");
const request = require("./routes/api/request");
const favor = require("./routes/api/favor");
const prize = require("./routes/api/prize");
const cors = require("cors");

const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// db configuration
const DB_URL = process.env.DATABASE_URL;
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected successful"))
  .catch((err) => console.log(err));

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

app.use(passport.initialize());
require("./middleware/passport")(passport);
app.use("/api/user", user);
app.use("/api/request/", request);
app.use("/api/favor/", favor);
app.use("/api/prize/", prize)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
