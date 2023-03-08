// database configurations here
const {Client}= require ("pg")

const client = new Client({
    user:'',
    database:'',
    password:'',
    port:5432,
    host:'localhost'
})

module.exports= {client}
