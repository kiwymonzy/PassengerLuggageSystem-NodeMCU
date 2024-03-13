const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require("./routes/index");
var path = require('path');

const userController = require('./controllers/userController');

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json());

var urlencodedParser = bodyParser.urlencoded( {extended: false});

//customer post
app.post('/create-user', userController.create_user_post);
app.post('/register', userController.register_post);
app.post('/login', userController.login_post);

mongoDB = "mongodb://127.0.0.1:27017/passengerDB";

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use("/", indexRouter);

module.exports = app;
