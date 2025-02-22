import express, { request } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.get('/', (req, res) => {
    res.send('ORV API')
})

// app.post('/characters', async (req, res) => {
//     await prisma.character.create({
//         data: {
//             name: req.body.name,
//             constellation: req.body.constellation,
//             race: req.body.race,
//             img1: req.body.img1,
//             img2: req.body.img2,
//             description: req.body.description
//         }
//     })
//     res.status(201).json(req.body)
// })

// app.put('/characters/:id', async (req, res) => {
//     await prisma.character.update({
//         where: {
//             id: req.params.id
//         },
//         data: {
//             name: req.body.name,
//             constellation: req.body.constellation,
//             race: req.body.race,
//             img1: req.body.img1,
//             img2: req.body.img2,
//             description: req.body.description
//         }
//     })
//     res.status(201).json(req.body)
// })

app.get('/characters', async (req, res) => {
    let characters = []
    if (req.query) {
        characters = await prisma.character.findMany({
            where: {
                name: req.query.name
            }
        })
    }
    else {
        characters = await prisma.character.findMany()
    }
    res.status(200).json(characters)
})


// app.delete('/characters/:id', async (req, res) => {
//     await prisma.character.delete({
//         where: {
//             id: req.params.id
//         },
//     })
//     res.status(200).json({ message: 'Personagem deletado com sucesso!' })
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })