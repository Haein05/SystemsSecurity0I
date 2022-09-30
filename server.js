const express = require('express');
const bodyParser = require('body-parser');
const {v4 : uuidv4} = require('uuid');
const port = 3000;
const app = express();
const {createClient} = require('redis');
const md5 = require ('md5');
const res = require('express/lib/response');
const { stringify } = require('uuid');
const redisClient = createClient(
    {
        Url:'redis://default@localhost:6379',
    }
);

app.use(bodyParser.json());

app.listen(port, async ()=>{
    await redisClient.connect();
    console.log('listening on port '+port);
});

app.get('/', (req,res)=>{
    res.send('Hello World!')
});

app.post('/user', (req,res)=>{
    const newUserRequestObject = req.body;
    console.log('New User:', JSON, stringify(newUserRequestObject));
    redisClient.hSet('users', req.body.email, JSON, stringify(newUserRequestObject));
    res.send('New user'+newUserRequestObject.email+'added');

});

app.post("/login", (req,res)=>{
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    //res.send("Who are you?");

    if (loginEmail == "lee21025@byui.edu" && loginPassword == "Leehaein134!"){
        const token = uuidv4();
        res.send(token);
    } else{
        res.status(401);//unothorized
        res.send("Invalid user or password");
    }

});
