
const express=require('express');
const proxy=require('express-http-proxy')
const app=express();



app.use('/user',proxy('http://localhost:3001'));
app.use('/captain',proxy('http://localhost:3002'));
app.use('/ride',proxy('http://localhost:3003'));


app.listen(3000,()=>{
    console.log(`Gateway Service is running on Port 3000`)
})

