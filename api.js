const client = require('./connection.js')
const express = require('express');
const app = express();

app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3300");
})

client.connect();

app.get('/users', (req, res)=>{
    client.query(`SELECT * FROM logins`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/login/:username/:password', (req, res)=>{
    client.query('SELECT username FROM logins WHERE username=$1 AND password = $2',[req.params.username,req.params.password], (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/getuser/:username', (req, res)=>{
    client.query('SELECT username FROM logins WHERE username=$1',[req.params.username], (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.post('/insertPost', (req, res)=> { //TODO
    const user = req.body;
    client.query(`INSERT INTO posts VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,[req.body.id,req.body.username,req.body.text,req.body.radius,0,req.body.tag1,req.body.tag2,req.body.tag3,req.body.tag4,req.body.tag5,req.body.lat,req.body.lon,req.body.time], (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})


