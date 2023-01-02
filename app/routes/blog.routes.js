module.exports = app => {
	const blogs = require("../controllers/blog.controllers");
  
	var router = require("express").Router();

	router.post("/", blogs.create);
	router.get("/", blogs.findAll);
	router.get("/published", blogs.findAllPublished);
	router.get("/:id", blogs.findOne);
	router.put("/:id", blogs.update);
	router.delete("/:id", blogs.delete);
	router.delete("/", blogs.deleteAll);
	app.use('/blogs', router);
  };