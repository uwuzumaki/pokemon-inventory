const express = require("express");
const path = require("path");
const app = express();
const pokeRouter = require("./routes/pokeRouter");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", pokeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Runnning on ${PORT}`);
});
