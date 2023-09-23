// require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/routes");
const cors = require("cors");
const cookiParser = require("cookie-parser")
const port = 5000;

app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(router);


app.get('/',(req,res)=>{
    res.json({message:`The Backend App is Working on ${port}`})
})
app.listen(port,()=>{
    console.log(`server start at port no : ${port}`);
})
