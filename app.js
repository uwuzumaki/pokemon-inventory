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

// //Handles any 404 errors
// app.use((req, res, next) => {
//   const error = new Error("Page not found");
//   error.status = 404;
//   next(error);
// });

//Error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.log(err.stack);
  res.status(status);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Runnning on ${PORT}`);
});
