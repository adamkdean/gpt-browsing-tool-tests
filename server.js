// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const express = require('express')
const app = express()
const port = process.env.HTTP_PORT || 8000

app.use((req, res, next) => {
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

app.listen(port, () => console.log(`Listening on ${port}`))
