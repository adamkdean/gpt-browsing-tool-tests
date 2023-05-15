// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const express = require('express')
const app = express()
const port = process.env.HTTP_PORT || 8000

const memory = {}

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
