const { authJwt } = require("../middleware");

module.exports = app => {
	const categories = require("../controllers/category.controllers");
  
	var router = require("express").Router();

	router.post("/", categories.create);
	router.get("/", categories.findAll);
	router.get("/:id", categories.findOne);
	router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.update);
	router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.delete);
	router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], categories.deleteAll);
	app.use('/categories', router);
  };