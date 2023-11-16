const mongoose=require("mongoose")


const connectToDb=()=>{
    mongoose.connect("mongodb://localhost:27017/inotebook").then(()=>{console.log("connected to db")})
}

module.exports=connectToDb;