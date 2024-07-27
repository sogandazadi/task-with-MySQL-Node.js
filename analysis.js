const mysql = require("mysql");
const dbConfig = require("./views/config");
const { performance } = require('perf_hooks');
const percentile = require("percentile");

const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

connection.connect(function(err) {
if (err) throw err;
console.log("connected");
});

const queryPromise = (sql) => {
    return new Promise((resolve, reject) => {
    connection.query(sql, function(err, result) {
    if (err) {
    return reject(err);
    }
    resolve(result);
    });
    });
};

const getBooksName = async () => {
    try {
    const sql = `SELECT name FROM books_table`;
    const books_name = await queryPromise(sql);
    return books_name;
    } catch (err) {
    console.error(err);
    return [];
    }
};

var req_times = [];
(async () => {
    try {
    // var times = [];
    const books_name = await getBooksName();
    for (let i = 0; i < 1000 ; i++) {
        const random_id = Math.floor(Math.random() * books_name.length);
        const random_book_name = books_name[random_id].name;

        const sql = `SELECT * FROM books_table WHERE name="${random_book_name}"`;
        const start_time = performance.now();

        try {
            const result = await queryPromise(sql);
            const end_time = performance.now();
            const result_time = end_time - start_time;
            // console.log(start_time)
            // console.log(end_time)
            // console.log(result_time)
            req_times.push(result_time);
        } 
        catch (err) {
            console.error(err);
        }
    }
    } 

    finally {
    connection.end();
    }
    sorted_times = req_times.sort();
    console.log(sorted_times)
    console.log("============================================")
    const p50 = percentile(50 , sorted_times)
    const p90 = percentile(90 , sorted_times)
    const p95 = percentile(95 , sorted_times)
    const p99 = percentile(99 , sorted_times)

    console.log(`The 50th percentile is : ${p50}`)
    console.log(`The 90th percentile is : ${p90}`)
    console.log(`The 95th percentile is : ${p95}`)
    console.log(`The 99th percentile is : ${p99}`)



})();


