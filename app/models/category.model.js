module.exports = (sequelize, Sequelize) => {
	const Category = sequelize.define("categories", {
		name: {
			type: Sequelize.STRING
		},
		slug: {
			type: Sequelize.STRING
		}
	});

	return Category;
};