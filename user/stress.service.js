const express = require('express');
const app = express();
const dotenv = require('dotenv');
const os = require('os');
const cluster = require('cluster');

dotenv.config();

//In this example we are using cluster module to create a simple stress test endpoint that can handle multiple requests 
//This will suitably simulate a heavy computation task and it is also a good way to test the performance of your service 
// under load by utilizing all available CPU cores

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });
} else {
    app.get('/stress-test', (req, res) => {
        for (let i = 0; i < 10000000000; i++) {
            // Simulation of a heavy computation
        }
        res.send(`Stress Test Endpoint hit by worker ${process.pid}`);
    });

    app.listen(3002, () => {
        console.log(`Worker ${process.pid} started. User Service is running on Port 3002`);
    });
}