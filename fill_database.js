const mysql = require("mysql");
const faker = require("faker");
const dbConfig = require("./views/config")

const connection = mysql.createConnection({
    host:dbConfig.host,
    user: dbConfig.user,
    password : dbConfig.password,
    database: dbConfig.database
})

connection.connect(function(err){
    if(err) throw err;
    console.log("connected")
    
    for(let i=0 ; i<100 ; i++){
        
        const randomAuthorName = faker.name.findName();
        const randomBookName = faker.lorem.words();
        const randomNumber = faker.datatype.number({min: 1 , max:100});
        const randomPublishedDate = faker.date.past().toISOString().slice(0,19).replace('T' , ' ');

        var sql = `INSERT INTO books_table (name , author , number , published_time) VALUES ('${randomBookName}' ,'${randomAuthorName}',${randomNumber}, '${randomPublishedDate}')`;
        connection.query(sql, function(err , result){
        if(err) throw err;
    });
    }
    connection.end();
});