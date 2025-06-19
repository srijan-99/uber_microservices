

//The two services arr running on different ports
//index.service.js is running on port 3001
//stress.service.js is running on port 3002
//gateway.service.js is running on port 3000
//The gateway service will proxy requests to the other two services


//The use gateway service
//When you run the gateway service,all client requests go to the gateway(on Port 3000),and the gateway service will calls each microservices as needed 

//The client only need to know the gateway address(http://localhost:3000) and the gateway service will handle the routing to the appropriate microservice

//The gateway forward (proxies) requests to the appropriate microservices(like index.service.js on port 3001 and stress.service.js on port 3002) based on the request path
//This allows the client to interact with multiple services through a single entry point 
//This is a common pattern in microservices architecture,
// where a gateway service acts as a reverse proxy to route 
// requests to various backend services













const express=require('express');
const app=express();
const proxy=require('express-http-proxy');
const morgan=require('morgan');

app.use(morgan('dev'));

app.use('/stress-test',proxy('http://localhost:3002'));
app.use('/',proxy('http://localhost:3001'));


app.listen(3000,()=>{
    console.log(`Gateway service is running on port http://localhost:3000`);
})



