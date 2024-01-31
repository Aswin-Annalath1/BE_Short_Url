//Here we import connection url from .env file...
    //async-await will hold connection till it is fully connected...
    const mongoose=require('mongoose')
    const connection=async()=>{
                                    //It is to take from .env file.
        await mongoose.connect(process.env.MONGO_URL) //{useNewUrlParser:true}
            
        console.log("Mongodb is connected")
        }
        module.exports=connection;




        