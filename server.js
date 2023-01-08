const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const { apiDocumentation } = require('./docs/apiDoc')

const app = express()

var corsOptions = {
  origin: '*',
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

const db = require('./app/models')
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Synced db.')
    initial()
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message)
  })

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to paulus-lestyo.my.id.',
  })
})

require('./app/routes/blog.routes')(app)
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/category.routes')(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

function initial() {
  Role = db.role
  User = db.user

  Role.create({
    id: 1,
    name: 'admin',
    users: [
      {
        username: 'paul',
        email: 'paul@gmail.com',
        password: '12345678',
      },
    ],
  }, {
	include: [User]
  })
  Role.create({
    id: 2,
    name: 'writer',
  })
  Role.create({
    id: 3,
    name: 'user',
  })

}
