
const express=require('express');
const app=express();
const morgan=require('morgan');


app.use(morgan('dev'));


app.get('/',(req,res)=>{
    for(let i=0;i<10000000000;i++){
       //Simulation of a heavy computation 
    }
    res.send(`Welcome to the stress Service Api`)
})

app.listen(3001,()=>{
    console.log(`Stress Service is running on port 3001`);
})

