const express = require("express");
const multer = require("multer");
const cors = require("cors");

const path = require("path");
const app = express();
let mysql = require("mysql");

app.use(express.static(path.join(__dirname + "/uploads")));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname + "/dist/fileUpload")));

let conn = mysql.createConnection({
  host: "localhost", // Replace with your host name
  user: "root", // Replace with your database username
  password: "", // Replace with your database password
  database: "file_db", // // Replace with your database Name
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

let upload = multer({ storage: storage }).single("file");

app.post("/file", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    }
    const { fileName, authorName, description, price } = req.body;
    let sql =
      "INSERT INTO `publisher`(`fileName`,`authorName`, `description`,`image`,`price`) VALUES ('" +
      fileName +
      "','" +
      authorName +
      "','" +
      description +
      "','" +
      req.file.buffer +
      "','" +
      price +
      "')";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created");
    });
    // res.json({
    //   path: req.file.filename,
    // });
  });
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected successfully !");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
