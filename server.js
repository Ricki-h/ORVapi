import express, { request } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

app.post('/characters', async (req, res) => {
    await prisma.character.create({
        data: {
            name: req.body.name,
            constellation: req.body.constellation,
            race: req.body.race,
            img1: req.body.img1,
            img2: req.body.img2,
            description: req.body.description
        }
    })
})

app.get('/characters', async (req, res) => {
    const characters = await prisma.character.findMany()
    res.status(200).json(characters)
})

app.listen(3000)