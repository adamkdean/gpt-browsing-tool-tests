// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const express = require('express')
const app = express()
const port = process.env.HTTP_PORT || 8000

app.use(express.json())

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
    <title>Albert Einstein</title>
    </head>
    <body>
    <h1>Albert Einstein</h1>
    <p>Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics (alongside quantum mechanics). His work is also known for its influence on the philosophy of science. He is best known to the general public for his mass–energy equivalence formula E = mc2, which has been dubbed "the world's most famous equation". He received the 1921 Nobel Prize in Physics "for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect", a pivotal step in the development of quantum theory.</p>

    <p>He was known to be a slow learner in his early years, and was a poor student, with a notably rebellious attitude. He later attended a Catholic elementary school from the age of five until ten (1903-1908). At the age of eight, he was transferred to the Luitpold Gymnasium (now known as the Albert Einstein Gymnasium), where he received advanced primary and secondary school education until he left the German Empire seven years later.</p>

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
