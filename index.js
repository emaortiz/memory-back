const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
// parse application/json
app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
  res.setHeader("Access-Control-Allow-Headers","x-Requested-With, Content-Type")
  res.setHeader("Access-Control-Allow-Credentials",true)
  next()
})

//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'scores'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//show all scores
app.get('/scores',(req, res) => {
  let sql = "SELECT * FROM scores ORDER BY totalTime";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify(results));
  });
});

//add new score
app.post('/scores',(req, res) => {
  let data = {name: req.body.name, time: req.body.time, totalTime: req.body.totalTime};
  let sql = "INSERT INTO scores SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//delete a score
app.delete('/scores',(req, res) => {
  let query = conn.query('DELETE FROM scores WHERE id = ' + req.body.id, (err,results) => {
    if(err) throw err;
    res.send(JSON.stringify(results));
  })
}); 
//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});