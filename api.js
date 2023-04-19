const client = require('./connection.js')
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
app.use(express.json());


app.listen(port, ()=>{
    console.log("Sever is now listening at port "+port);
})

client.connect();

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

app.post('/getNearby',(req,res)=>{
    const {latitude,longitude,radius} = req.body
    var mileToLat = 0.01449275362;
    var mileToLon = 0.01831501831;
    var maxLatitude = latitude + (mileToLat * (radius/1609.34));
    var minLatitude = latitude  - (mileToLat * (radius/1609.34));
    var maxLongitude = longitude  + (mileToLon * (radius/1609.34));
    var minLongitude = longitude - (mileToLon * (radius/1609.34));
    console.log(maxLatitude);
    console.log(maxLongitude);
    console.log(minLatitude);
    console.log(minLongitude);

    client.query('SELECT * FROM posts p WHERE p.latitude <= $1 AND p.latitude >= $2 AND p.longitude <= $3 AND p.longitude >= $4 LIMIT 50',[maxLatitude,minLatitude,maxLongitude,minLongitude],(err,result)=>{
        if(!err){
            console.log(result.rows);
            res.send(result.rows);
        }
        else{
            res.send(err);
            console.log(err);
        }
    });
    client.end;
})

//UNTESTED

//User should check if the username is taken before attempting or will get error
app.post('/createAccount/:username/:password',(req,res)=>{
    client.query('INSERT INTO logins SELECT $1,$2 WHERE NOT EXISTS (SELECT 1 FROM logins WHERE username = $1)',[req.params.username,req.params.password],(err,result)=>{
        if (!err){
            console.log(result.rows);
            res.send('Account created successfully');
        }
        else{
            console.log(err.message);
            res.send("1");
        } 
    });
})

app.post('/insertPost', (req, res)=> {
    client.query(`INSERT INTO posts SELECT max(id)+1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 FROM posts`,[req.body.username,req.body.text,req.body.radius,0,req.body.tag1,req.body.tag2,req.body.tag3,req.body.tag4,req.body.tag5,req.body.lat,req.body.lon,req.body.time], (err, result)=>{
        if(!err){
            res.send("Inserted")
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.post('/insertComment',(req,res)=>{
    client.query('INSERT INTO comments SELECT max(id)+1, $1, $2, $3, $4, $5 FROM comments',[req.body.postid,req.body.text,0,req.body.author,req.body.time],(err,result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{
            console.log(err.message)
        }
    })
})

app.get('/likePost/:postid',(req,res)=>{
    client.query('UPDATE posts SET likes = likes + 1 WHERE id = $1',[req.params.postid],(err,result)=>{
        if(!err){
            res.send('The post has been liked');
        }
        else{
            res.send(err);
            console.log(err);
        }
    });
})

app.get('/likeComment/:commentid',(req,res)=>{
    client.query('UPDATE comments SET likes = likes + 1 WHERE id = $1',[req.params.commentid],(err,result)=>{
        if(!err){
            res.send('The comment has been liked');
        }
        else{
            res.send(err);
            console.log(err);
        }
    });
})

app.get('/dislikePost/:postid',(req,res)=>{
    client.query('UPDATE posts SET likes = likes - 1 WHERE id = $1',[req.params.postid],(err,result)=>{
        if(!err){
            res.send('The post has been liked');
        }
        else{
            res.send(err);
            console.log(err);
        }
    });
})

app.get('/dislikeComment/:commentid',(req,res)=>{
    client.query('UPDATE comments SET likes = likes - 1 WHERE id = $1',[req.params.commentid],(err,result)=>{
        if(!err){
            res.send('The comment has been liked');
        }
        else{
            res.send(err);
            console.log(err);
        }
    });
})

app.get('/deletePost/:postid',(req,res)=>{
    client.query('DELETE FROM posts WHERE id = $1',[req.params.postid],(err,result)=>{
        if(!err){
            res.send('The post has been deleted');
        }
        else{
            res.send(err);
            console.log(err);
        }
    });
})

app.get('/deleteComment/:commentid',(req,res)=>{
    client.query('DELETE FROM comments WHERE id = $1',[req.params.commentid],(err,result)=>{
        if(!err){
            res.send('The comment has been deleted');
        }
        else{
            res.send(err);
        }
    });
})

app.get('/getPostLikes/:postid',(req,res)=>{
    client.query('SELECT likes FROM posts WHERE id = $1',[req.params.postid],(err,result)=>{
        if(!err){
            res.send(result.rows)
        }
        else{
            res.send(err);
        }
    });
})

app.get('/getPostComments/:postid',(req,res)=>{
    client.query('SELECT * FROM comments WHERE postid = $1',[req.params.postid],(err,result)=>{
        if(!err){
            res.send(result.rows)
        }
        else{
            res.send(err);
        }
    });
})

app.get('/getUserPosts/:username',(req,res)=>{
    client.query('SELECT * FROM posts WHERE author = $1',[req.params.username],(err,result)=>{
        if(!err){
            res.send(result.rows)
        }
        else{
            res.send(err);
        }
    });
})

app.get('/getPost/:postid',(req,res)=>{
    client.query('SELECT * FROM posts WHERE id = $1',[req.params.postid],(err,result)=>{
        if(!err){
            res.send(result.rows)
        }
        else{
            res.send(err);
        }
    });
})

app.get('/getComment/:commentid',(req,res)=>{
    client.query('SELECT * FROM comments WHERE id = $1',[req.params.commentid],(err,result)=>{
        if(!err){
            res.send(result.rows)
        }
        else{
            res.send(err);
        }
    });
})
