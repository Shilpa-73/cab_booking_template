//Old ES5 code

// const express = require('express')
// const app = express()
// const port = 3000

//NEW ES6 code
import express from 'express';
const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
