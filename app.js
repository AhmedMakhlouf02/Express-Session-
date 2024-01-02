require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const connect = require("./db/connect");
const MongoStore = require("connect-mongo")(session);

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbString = process.env.MONGO_URL;
const dbOptions = {
  useNewUrlParser:true,
  useUnifiedTopology: true
}

const connection = mongoose.createConnection(dbString, dbOptions);


const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    },
  })
);

app.get('/',(req,res)=>{
  if(req.session.viewCount){
    req.session.viewCount++
  }else{
    req.session.viewCount = 1
  }
  res.send(`<h1>You have visited this page ${req.session.viewCount}</h1>`);
})

const start = async () => {
  try {
    // await connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
