const mongoose = require("mongoose");

const DB = "mongodb://127.0.0.1:27017/MERN-AUTH-JWT";

mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=> console.log("DataBase Connected")).catch((error)=>{
    console.log(error.message)
    console.log(error);
})