// database configurations here
const {Client}= require ("pg")

const client = new Client({
    user:'postgres',
    database:'challenge',
    password:'admin',
    port:5432,
    host:'localhost'
})
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports= {client}