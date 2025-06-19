const autocannon = require('autocannon');

const runTest = (url, duration = 30) => {
  autocannon({
    url,
    connections: 50,
    duration
  }, (err, result) => {
    if (err) {
      console.error(`Error testing ${url}:`, err);
      return;
    }
    console.log(`URL: ${url}`);
    console.log(`Total requests in ${duration} seconds: ${result.requests.total}\n`);
  });
};

runTest('http://localhost:3001/', 30);
runTest('http://localhost:3001/stress-test', 30);
