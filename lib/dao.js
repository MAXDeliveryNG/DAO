'use strict'

const config = require('./config')

const knex = require('knex')
const bookshelf = require('bookshelf')



module.exports = (function () {

	function DAO(options) {

		if (!(this instanceof DAO)) {
			return new DAO(options)
		}

		options = options || {}

		const adapter = options.adapter || 'postgres'

		this.connection = config[adapter]
		this.knex = knex(this.connection)
		this.bookshelf = bookshelf(this.knex)

		// Register global plugins
		this.bookshelf.plugin(require('bookshelf-scopes'))
		this.bookshelf.plugin(require('bookshelf-deep-changed'))
		this.bookshelf.plugin(require('bookshelf-relationships'))
		this.bookshelf.plugin(require('bookshelf-history'))
			// this.bookshelf.plugin(require('../plugins/bookshelf-postgis'))
	}

	DAO.prototype.init = function (args) {
		return this.bookshelf
	}

	return DAO
}())