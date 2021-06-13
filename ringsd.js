const express = require('express');
const app = express();
const path = require('path');
const _port = process.env.PORT || 3000;

app.use(express.static('ringsLib'));
app.use(express.static('webapp/static'));
app.get('/', (req, res, next) => { res.sendFile(path.join(__dirname, '/webapp', 'index.html')) });
app.listen(_port, () => process.stdout.write(`Ring server listening. Access: http://localhost:${_port}/\n\n`))