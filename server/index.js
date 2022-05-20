import { createServer } from 'http';
import { parse } from 'url';
import { WebSocketServer } from 'ws';
import express from 'express';

const app = express()
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})


function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}



const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

wss1.on('connection', function connection(ws) {
  // ...

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

wss2.on('connection', function connection(ws) {
  // ...
});

const server = app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
});

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);
  console.log(`pathname: ${pathname}`);
  if (pathname === '/foo') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      console.log(request.data);
      // console.log(socket);
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/bar') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});


