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

let upload = multer().single("file");

app.post("/file", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    }
    const { fileName, authorName, description, price, url } = req.body;
    let sql =
      "INSERT INTO `publisher`(`fileName`,`authorName`, `description`,`fileUrl`,`price`) VALUES ('" +
      fileName +
      "','" +
      authorName +
      "','" +
      description +
      "','" +
      url +
      "','" +
      price +
      "')";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json("success");
    });
  });
});

app.get("/file", (req, res) => {
  let sql = "select * from publisher";
  conn.query(sql, function (err, result) {
    if (err) throw err;

    res.status(200).json(result);
  });
});

app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  if (userName === "agent") {
    return res.status(200).json("agent");
  }
  return res.status(200).json("publisher");
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected successfully !");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
