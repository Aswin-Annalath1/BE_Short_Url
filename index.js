const express = require('express') 
// const mongoose=require('mongoose')

//Importing .env file 
const dotenv=require('dotenv')
dotenv.config()
//Importing Connection ...from Db file
const connection=require('./Db/connection')
connection()

const cors = require('cors') 
const allroutes = require('./routes/index.js')

const app = express();
app.use(express.json());

app.use(cors({
    origin : "*",  //(we are allowing accept the request from FE if given)
    credentials : true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))

// mongoose.connect('mongodb+srv://aswinannalath:aswinanna@cluster0.zv6kyv1.mongodb.net/Zen_queries', )   //{useNewUrlParser: true, useUnifiedTopology: true}
// .then(() => {console.log("Connected to database")})
// .catch((error) => {console.log("Error connecting to database",error)})

//Port initialized and hosting environment is dynamically given and also if needed given 8000
                    //Take default port or 8000(during deployment)
const PORT=process.env.PORT || 5000


app.use("/", allroutes)

app.listen(PORT, () => {console.log("Server is running on port",PORT)})

