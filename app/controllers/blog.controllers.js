const db = require('../models')
const Blog = db.blog
const Op = db.Sequelize.Op

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return {
        limit,
        offset,
    }
	
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: blogs } = data
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)

    return {
        totalItems,
        blogs,
        totalPages,
        currentPage,
    }
}

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: 'Title can not be empty!',
        })
        return
    }

    const blog = {
        title: req.body.title,
        text: req.body.text,
        published: req.body.published ? req.body.published : false,
    }

    Blog.create(blog)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while creating the Blog.',
            })
        })
}

exports.findAll = (req, res) => {
    const { page, size, title } = req.query
    var condition = title
        ? {
              title: {
                  [Op.like]: `%${title}%`,
              },
          }
        : null

    const { limit, offset } = getPagination(page, size)

    Blog.findAndCountAll({
        where: condition,
        limit,
        offset,
    })
        .then((data) => {
            const response = getPagingData(data, page, limit)
            res.send(response)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving blogs.',
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Blog.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data)
            } else {
                res.status(404).send({
                    message: `Cannot find Blog with id=${id}.`,
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving Blog with id=' + id,
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id

    Blog.update(req.body, {
        where: {
            id: id,
        },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'Blog was updated successfully.',
                })
            } else {
                res.send({
                    message: `Cannot update Blog with id=${id}. Maybe Blog was not found or req.body is empty!`,
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error updating Blog with id=' + id,
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Blog.destroy({
        where: {
            id: id,
        },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'Blog was deleted successfully!',
                })
            } else {
                res.send({
                    message: `Cannot delete Blog with id=${id}. Maybe Blog was not found!`,
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not delete Blog with id=' + id,
            })
        })
}

exports.deleteAll = (req, res) => {
    Blog.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({
                message: `${nums} Blogs were deleted successfully!`,
            })
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while removing all blogs.',
            })
        })
}

exports.findAllPublished = (req, res) => {
    const { page, size } = req.query

    const { limit, offset } = getPagination(page, size)

    Blog.findAndCountAll({
        where: {
            published: true,
        },
        limit,
        offset,
    })
        .then((data) => {
            const response = getPagingData(data, page, limit)
            res.send(response)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving blogs.',
            })
        })
}
