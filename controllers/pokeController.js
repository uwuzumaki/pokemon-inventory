const homepage = (req, res) => {
  res.render("homepage", { title: "Pokemon Search" });
};

module.exports = {
  homepage,
};
