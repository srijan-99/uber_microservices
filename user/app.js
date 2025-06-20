
const express=require('express');
const app=express();
const morgan=require('morgan');
const dotenv=require('dotenv');
dotenv.config();
const connectDb=require('./db/conn');
const cookieParser=require('cookie-parser');

const userRoutes=require('./routes/user.routes');
const rabbitmq=require('./service/rabbit');

//Connect to RabbitMq
rabbitmq.connect();


dotenv.config();

connectDb();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/',userRoutes);


// For testing purpose 

// app.get('/',(req,res)=>{
//     // res.send(`Welcome the the User Service Api`)
//     for(let i=0;i<10000000000;i++){

//     }
//     res.send(`Welcome to the User Service Api`);
// })

//For testing purpose 

// app.get('/stress-test',(req,res)=>{
//     for(let i=0;i<10000000000;i++){

//     }
//     res.send(`Stress Test Endpoint hit`)
// })




module.exports=app;