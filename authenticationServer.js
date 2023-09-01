const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const secretKey = "Mission-Impossible-Top-Secret-Key";

let id = 0;

let arrayOfUserDataObjects = [];

function signup(req,res){
  let signupObject = req.body;
  for(let i = 0; i < arrayOfUserDataObjects.length; i++){
    if(signupObject.username == arrayOfUserDataObjects[i].username){
      res.status(400).send();
      return;
    }
  }
  id++;
  signupObject["id"] = id;
  arrayOfUserDataObjects.push(signupObject);
  res.status(201).send();
}

function login(req,res){
  let loginJSON = req.body;
  for(let i = 0; i < arrayOfUserDataObjects.length; i++){
    if(loginJSON.username == arrayOfUserDataObjects[i].username){
      if(loginJSON.password == arrayOfUserDataObjects[i].password){
        let token = jwt.sign(arrayOfUserDataObjects[i],secretKey,{expiresIn:'1h'});
        res.json(token);
        return;
      }
    }
  }
  res.status(401).send();
}

function data(req,res){
  let headersUsername = req.headers.username;
  let headersPassword = req.headers.password;
  for(let i = 0; i < arrayOfUserDataObjects.length; i++){
    if(headersUsername == arrayOfUserDataObjects[i].username){
      if(headersPassword == arrayOfUserDataObjects[i].password){
        let arrayOfUserDataObjectsDupe = arrayOfUserDataObjects;
        for(let i = 0; i < arrayOfUserDataObjectsDupe.length; i++){
          delete arrayOfUserDataObjectsDupe[i].password;
        }
        res.json(arrayOfUserDataObjectsDupe);
      }
    }
  }
  res.status(401).send();
}


app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}`);
});

function catchAll(req,res){
  res.status(404).send();
}

function display(req,res){
    res.send(arrayOfUserDataObjects);
}

app.post("/signup",signup);
app.get("/display",display);
app.post("/login",login);
app.get("/data",data);
app.get('*',catchAll);

module.exports = app;
