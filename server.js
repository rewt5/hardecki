// Import the 'http' module
const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;

const axios = require('axios');

async function callGPT3(prompt) {
  // Replace YOUR_API_KEY with your actual API key
  const apiKey = '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';

  response = await axios.post('https://api.openai.com/v1/completions', {
      prompt: prompt,
      max_tokens: 50,
      model: 'text-davinci-003',
      temperature: 0,
  }, {
      headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
      },
  })
  console.log('callGPT3 raw response', response, response.data);
  console.log('callGPT3 response', response.data.choices[0].text);
  return response.data.choices[0].text;
}


// Create the server
const serverOld = http.createServer((req, res) => {
  res.statusCode = 200;
  console.log("Got a new request")
  res.setHeader('Content-Type', 'text/plain');
  res.end('Let me out!\n');
});

const server = http.createServer((req, res) => {
    const requestedUrl = new URL(req.url, 'http://example.com');
    const requestedPath = requestedUrl.pathname;
    console.log('Requested path:', requestedPath);

    if (requestedPath === '/fubar') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        callGPT3("what is the capital of Ohio?").then((data) => {res.end(data)})
    } else if (requestedPath === '/black.html') {
      fs.readFile(path.join(__dirname, 'black.html'), 'utf8', (err, data) => {
          if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'text/plain');
              res.end('Internal Server Error\n');
          } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.end(data);
          }
        });
    } else {
        // Read the index.html file
      fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error\n');
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
          }
        });
    }
  });

// Start listening for requests
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



//TODO next
/*
  1. Add a text input to the html file
  2. Add a button next to the text input
  3. Wire up the button so that when you press the button, it makes a call to /fubar on your server
  4. Right now, /fubar returns "fubar!" -- when the browser gets that response, write it to the screen
*/