// database configurations here
const {Client}= require ("pg")

const client = new Client({
    user:'postgres',
    database:'challenge',
    password:'admin',
    port:5432,
    host:'localhost'
})

module.exports= {client}