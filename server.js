const express = require("express");

var app = express();
app.use(express.static(__dirname + "/dist"));

app.listen(3000, "0.0.0.0", () => console.log("Running at Port 3000"));
