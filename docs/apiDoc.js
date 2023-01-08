const { createUser, createUserBody, deleteUser } = require("./users");

exports.apiDocumentation = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'My REST API - Documentation',
    description: 'Description of my API here',
    termsOfService: 'https://mysite.com/terms',
    contact: {
      name: 'Paulus Lestyo Adhiatma',
      email: 'lestyo24@gmail.com',
      url: 'http://paulus-lestyo.my.id/',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:8080/',
      description: 'Local Server',
    },
    {
      url: 'http://api.paulus-lestyo.my.id/',
      description: 'Production Server',
    },
  ],
  tags: [
    {
      name: 'Roles',
    },
    {
      name: 'Users',
    },
  ],

  paths: {
    users: {
      post: createUser,
    },
    'users/{id}': {
      delete: deleteUser,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      createUserBody,
    },
  },
}