const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operatorsAliases: false,

	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle
	}
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blog = require("./blog.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
	through: "user_roles",
	foreignKey: "roleId",
	otherKey: "userId"
});
db.user.belongsToMany(db.role, {
	through: "user_roles",
	foreignKey: "userId",
	otherKey: "roleId"
});

db.refreshToken.belongsTo(db.user, {
	foreignKey: 'userId',
	targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
	foreignKey: 'userId',
	targetKey: 'id'
});

db.blog.belongsToMany(db.category, {
	through: "blog_categories",
	foreignKey:"blogId",
	otherKey: "categoryId"
})

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;