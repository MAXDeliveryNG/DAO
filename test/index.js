'use strict'

const should = require('should')
const DAO = require('../lib/dao')

describe('General test cases for DAO', function () {

	describe('creates an instance correctly', function () {
		let dao = DAO()

		it('should be an Object', function () {
			dao.should.be.Object()
		})

		it('should be instance of DAO', function () {
			dao.should.be.instanceof(DAO)
		})
	})
})