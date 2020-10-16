require('dotenv').config()
const express = require('express')
const app = express()
const routers = require('./routers/index')
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use(routers)
app.use(errorHandler)

module.exports = app