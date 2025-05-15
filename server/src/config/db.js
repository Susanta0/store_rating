const {Pool}= require("pg")
require("dotenv").config()

const dbConnection = new Pool({
    connectionString: process.env.DATABASE_URL,
})

module.exports = dbConnection