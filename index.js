import express, { request } from 'express'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import path from 'path'

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 3001
app.use(express.json())
app.use(express.static('public'))

// Configuração do Multer para armazenamento de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img')
    },
    filename: function (req, file, cb) {
        // Gera um nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Aceita apenas imagens
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Apenas imagens são permitidas!'), false)
        }
        cb(null, true)
    }
})

app.get('/', (req, res) => {
    res.send('ORVapi')
})
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
app.post('/characters', upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 }
]), async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const img1Url = req.files['img1'] ? `${baseUrl}/img/${req.files['img1'][0].filename}` : null
        const img2Url = req.files['img2'] ? `${baseUrl}/img/${req.files['img2'][0].filename}` : null

        await prisma.character.create({
            data: {
                name: req.body.name,
                constellation: req.body.constellation,
                race: req.body.race,
                description: req.body.description,
                img1: img1Url,
                img2: img2Url
            }
        })

        res.status(201).json({
            ...req.body,
            img1: img1Url,
            img2: img2Url
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
app.put('/characters/:id', upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 }
]), async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const img1Url = req.files['img1'] ? `${baseUrl}/img/${req.files['img1'][0].filename}` : req.body.img1
        const img2Url = req.files['img2'] ? `${baseUrl}/img/${req.files['img2'][0].filename}` : req.body.img2

        await prisma.character.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                constellation: req.body.constellation,
                race: req.body.race,
                description: req.body.description,
                img1: img1Url,
                img2: img2Url
            }
        })

        res.status(200).json({
            ...req.body,
            img1: img1Url,
            img2: img2Url
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get("/img/kimdokja1.png", (req, res) => {
    res.sendFile('img/kimdokja1.png', { root: './public' })
})

// Endpoint para upload de imagens
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' })
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
    res.json({ url: imageUrl })
})

// Rota para deletar todos os personagens
app.delete('/characters/delete-all', async (req, res) => {
    try {
        await prisma.character.deleteMany({})
        res.status(200).json({ message: 'Todos os personagens foram deletados com sucesso' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})