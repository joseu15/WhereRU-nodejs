const {Client} = require('pg')

const client = new Client({
    host: "whereru.cui0zqioehzd.us-east-2.rds.amazonaws.com",
    user: "postgres",
    port : 80,
    password: "password1",
    database: "postgres"
})

module.exports = client