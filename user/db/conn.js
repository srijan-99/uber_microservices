
const mongoose=require('mongoose');





 connectDb=async()=>{
    try{
        console.log("MONGO_URI",process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongoDB");

    }
    catch(err){
        console.error("Error connecting to mongodb",err);
        process.exit(1);
    }
  
    
}
module.exports=connectDb;