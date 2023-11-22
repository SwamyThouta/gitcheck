require("dotenv").config();
const express = require('express')
const nodemailer = require("nodemailer");
const uuid = require('uuid');
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser')
const multiparser = require("./multiparser");
const port = 8001
const dev = true;

app.disable('x-powered-by');
app.use(cors());
app.use(multiparser());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb', extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'static')))
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(cookieParser("Ascent"));
app.use(expressLayouts);
app.use("/", require("./routes/user"));
app.use("/admin", require("./routes/admin"));
app.listen(port, () => {
    console.log(`Ascent app listening on port ${port}`)
})







