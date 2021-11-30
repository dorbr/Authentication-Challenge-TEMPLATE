// import dotenv from "dotenv";
// dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 8080;

module.exports = app.listen(PORT, () =>

  console.log(`app listening at http://localhost:${PORT}`)
);
 
