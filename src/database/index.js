// database configurations here
const {Client}= require ("pg")

const client = new Client({
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST


})
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports= {client}
