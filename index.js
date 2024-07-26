const mysql = require("mysql");
const express = require ("express");
const ejs = require("ejs")
const bodyParser = require("body-parser")
const faker = require("faker");
const dbConfig = require("./views/config")

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine" , "ejs")
const connection = mysql.createConnection({
    host:dbConfig.host,
    user: dbConfig.user,
    password : dbConfig.password,
    database: dbConfig.database
})

connection.connect(function(err){
    if(err) throw err;
    console.log("connected")
})

app.get("/" , (req , res) =>{
    res.render("index.ejs")
})

app.post("/results" , (req , res ) =>{
    const bookName = req.body.book_name;
    const sql = `select * from books_table where name="${bookName}"`;
    connection.query(sql, function(err , result){
        if(err) throw err;
        // const data = JSON.stringify(result) ;
        res.render("index.ejs" , {res : result})
    })
})

app.listen(port , () => {
    console.log(`Running on port ${port}`)
})