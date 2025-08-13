const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app  = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Abhi0810shek'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password()
  ];
};

// // inserting new data into the user table
// let q = "insert into user(id,username,email,password) values ?";

// let data = [];
// for(let i = 1; i<=100; i++){
//   data.push(getRandomUser());
// }

app.get("/", (req,res) => {
  let q = 'select count(*) from user'
  try{
  connection.query(q, (err,result) => {
    if(err) throw err;
    let count = result[0]["count(*)"];
    res.render("home.ejs", { count });
  });
  } catch(err){
    console.log(err);
    res.send("some error in database connection")
  }
});

app.get("/users", (req,res) => {
  let q = 'select * from user'

  try{
    connection.query(q,(err,result) =>{
      if(err) throw err;
      let users = result;
      res.render("users.ejs", { users });
    })
  }catch(err){
    res.send("some error occurred");
  };
});

app.get("/users/:id/edit", (req,res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user where id='${id}'`;

  try{
    connection.query(q, (err,result) => {
      if(err) throw err;
      let user = result[0];
      console.log(result[0]);
      res.render("edit.ejs", {user})
    })
  }catch(err){
    console.log(err);
    res.send("some error occoured");
  }
});

app.patch("/users/:id", (req,res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user where id='${id}'`;

  try{
    connection.query(q, (err,result) => {
      if(err) throw err;
      let user = result[0];
      password = req.body.password;
      username = req.body.username;
      if(user.password === password){
        let q2 = `update user SET username='${username}' where id='${id}'`;
        connection.query(q2, (req,result) => {
          if (err) throw err;
        })
        res.redirect("/users")
      }else{
        res.send("incorrect password");
      }
    })
  }catch(err){
    console.log(err);
    res.send("some error occoured");
  }
});

app.get("/users/add", (req,res) => {
  res.render("add.ejs");
});

app.post("/users", (req,res) => {
  let q = `insert into user (id,username,email,password) values (?, ?, ?, ?)`
  let data = [
    uuidv4(),
    req.body.username,
    req.body.email,
    req.body.password
  ];
  try{
    connection.query(q , data, (err,result) => {
    if(err) throw err;
    console.log(result);
    })
  }catch(err){
    console.log(err);
    res.send("some error occoured");
  }
  res.redirect("/users");
});

//delete user from database
app.delete("/users/:id", (req,res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user where id='${id}'`;

  try{
    connection.query(q, (err,result) => {
      if (err) throw err;
      console.log(result);
      let q2 = `delete from user where id='${id}'`;
      connection.query(q2, (err,result) => {
        if (err) throw err;
        console.log(result);
      })
      res.redirect("/users");
    })
  }catch(err){
    console.log(err);
    res.send("some error occoured");
  }
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// try{
//   connection.query(q,data, (err,result) => {
//     if(err) throw err;
//     console.log(result);
//   });
// } catch(err){
//   console.log(err);
// }

// connection.end();