const { default: slugify } = require('slugify')
const db = require('../models')
const Category = db.category
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Name can not be empty!',
    })
    return
  }

  Category.findOne({
    where: {
      name: req.body.name,
    },
  }).then((_category) => {
    if (_category) {
      res.status(400).send({
        message: 'Failed! Category is already in use!',
      })
      return
    } else {
      const category = {
        name: req.body.name,
        slug: slugify(req.body.name),
      }

      Category.create(category)
        .then((data) => {
          res.send(data)
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the Category.',
          })
        })
    }
  })
}

exports.findAll = (req, res) => {
  const { name } = req.query
  var condition = name
    ? {
        name: {
          [Op.like]: `%${name}%`,
        },
      }
    : null

  Category.findAll({
    where: condition,
  })
    .then((response) => {
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving categories.',
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Category.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Category with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Category with id=' + id,
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id

  Category.update(
    { ...req.body, slug: slugify(req.body.name) },
    {
      where: {
        id: id,
      },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Category was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Category with id=' + id,
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Category.destroy({
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Category was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Category with id=' + id,
      })
    })
}

exports.deleteAll = (req, res) => {
  Category.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Categories were deleted successfully!`,
      })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Categories.',
      })
    })
}
