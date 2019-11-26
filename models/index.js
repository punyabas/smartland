const knex = require('knex');
const db = require('./../config').DATABASE;

var database = knex({
	client: 'mysql',
	connection: db,
	pool: { min: 0, max: 7 }
});

module.exports = { database };