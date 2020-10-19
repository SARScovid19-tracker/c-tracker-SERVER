require('dotenv').config()
const express = require('express')
const app = express()
// const PORT = process.env.PORT || 3000
const routers = require('./routers/index')
const bp = require("body-parser")
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')

app.set("view engine", "ejs")
app.use(bp.urlencoded({ extended : false }))
app.use(bp.json())

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use(routers)
app.use(errorHandler)

// app.listen(PORT, () => {
//     console.log(`Server C-Tracker is running on port http://localhost:${PORT}`)
// })
module.exports = app