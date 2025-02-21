import express, { request } from 'express'

const app = express()

app.get('/characters', (req, res) => {
    res.send('Ok, deu bom')
})

app.listen(3000)