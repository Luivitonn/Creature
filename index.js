const client = require('./Handlers/clientHandler')
const Luicik = require('./Handlers/loaderHandler')
require('./Handlers/functionHandler')
process.on('uncaughtException', console.log)
process.on('unhandledRejection', console.log)

Luicik.connect()
Luicik.fetchCommands()
Luicik.fetchEvents()


const express = require('express');
const app = express ();
const port = 3000;

app.get('/'), (req, res) => {

res.sendStatus(200);
}};

app.listen(port, () => {
  console.log("Sunucu ${port} numaralı bağlantı noktasına yürütülüyor.");
  }};
