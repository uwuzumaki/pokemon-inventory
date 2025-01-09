const express = require("express");
const path = require("path");
const app = express();
const pokeRouter = require("./routes/pokeRouter");

// Sets views using EJS
app.set("view engine", "ejs");

// Sets static route for styles and assets
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Leads to routes
app.use("/", pokeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Runnning on ${PORT}`);
});
