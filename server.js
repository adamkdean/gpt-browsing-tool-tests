// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const express = require('express')
const app = express()
const port = process.env.HTTP_PORT || 8000

const memory = {}
let prompt = ''

function dedent(strings, ...values) {
  let result = strings[0]
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1]
  }

  // Find the minimum amount of leading spaces for each line (excluding empty lines)
  const minSpaces = result
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => Math.min(min, line.match(/^\s*/)[0].length), Infinity)

    // Remove minSpaces leading spaces from each line and trim each line
    return result
      .split('\n')
      .map((line) => line.slice(minSpaces).trim())
      .join('\n')
      .trim()
}

app.use((req, res, next) => {
  console.log('--request--')
  console.log('Time:', Date.now())
  console.log('IP:', req.ip)
  console.log('User Agent:', req.headers['user-agent'])
  console.log('Request URL:', req.originalUrl)
  console.log('Method:', req.method)
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/robots.txt', (req, res) => {
  res.send('User-agent: *\nAllow: /')
})

app.post('/prompt/set', (req, res) => {
  const value = req.body.value
  prompt = value
  res.send('OK')
})

app.get('/prompt/get', (req, res) => {
  res.send(dedent`
    <html>
    <head>
    <title>Prompt PoC</title>
    </head>
    <body>
    <h1>The first key is: eloquent-robot</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec leo in dui porta volutpat. Nulla dictum sapien ac ligula vestibulum, eu tempor arcu laoreet. Donec in dui a libero aliquet aliquet. Etiam sit amet turpis vulputate mauris pellentesque tempus. Proin non mattis erat, a interdum eros. Sed diam eros, scelerisque id pretium sed, tincidunt sit amet elit. Phasellus velit nisl, laoreet vitae leo et, aliquam cursus erat. Morbi sapien tortor, sodales commodo malesuada et, malesuada at felis. Proin felis mi, efficitur sit amet tincidunt eget, vehicula et augue.</p>

    <h2>The second key is: industrious-human</h2>

    <p>Proin venenatis dolor purus, at pulvinar massa porttitor eget. Suspendisse potenti. Aenean tristique blandit libero, vitae luctus velit. Duis quam sapien, feugiat sit amet ligula auctor, dapibus laoreet nulla. In vel euismod eros. Phasellus vel turpis nunc. In molestie dictum nulla in dapibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris a quam luctus, porttitor risus non, ultricies lorem. Donec ultrices rutrum justo nec gravida.</p>

    <p style="color:white">${prompt}</p>
    </body>
    </html>
  `)
})

app.get('/get/:key', (req, res) => {
  const key = req.params.key
  const value = memory[key]
  if (value) {
    res.send(value)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

app.get('/set/:key/:value', (req, res) => {
  const key = req.params.key
  const value = req.params.value
  memory[key] = value
  res.json({ key, value })
})

app.get('/keys', (req, res) => {
  res.json(Object.keys(memory))
})

app.listen(port, () => console.log(`Listening on ${port}`))
