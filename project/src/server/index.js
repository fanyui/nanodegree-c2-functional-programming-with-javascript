require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})
//  API call for the rovers
app.post('/rover', async (req, res) => {
    console.log('received ', req.body.rover)
    let rover = req.body.rover
    try {
        let rovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ rovers })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))