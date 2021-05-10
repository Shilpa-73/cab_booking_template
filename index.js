import express from 'express';
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.status(200).send('Hello Welcome to the Cab-Booking API!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
