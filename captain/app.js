
const express=require('express');
const app=express();
const morgan=require('morgan');
const dotenv=require('dotenv');

dotenv.config();
const connectDb=require('./db/conn');
const cookieParser=require('cookie-parser');

const captainRoutes=require('./routes/captain.routes');
const rabbitmq=require('./service/rabbit');

//Connect to RabbitMq
rabbitmq.connect();


connectDb();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/',captainRoutes);




module.exports=app;