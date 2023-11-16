const express=require("express")
const connectToDb=require("./db")
var cors = require('cors')




connectToDb();

const app=express();
app.use(cors())
app.use(express.json())
app.use('/api/auth',require("./routes/auth"))
app.use('/api/notes',require("./routes/note"))

const port=5000;

app.get("/",(req,res)=>{
    res.send("welcome to the server")
})

app.listen(port,()=>{
    console.log(`the server is running at ${port}`)
})


module.exports=app;


