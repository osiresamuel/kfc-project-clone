const { Router } = require("express");
const Menu = require("../model/menuSchema");
const searchRouter = Router();

searchRouter.get("/item", async (req, res) => {
  const search = String(req.query.search || "").trim();
  let items = await Menu.find({
    title: { $regex: search, $options: "i" },
  });
  res.json(items);
});
module.exports = searchRouter;
