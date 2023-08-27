const express = require('express');
const cors = require('cors')
// require('./db');

const app = express()
const port = 3500

app.use(cors())
app.use(express.json())
app.use('/auth' , require('./routes/authorisation'))

app.get('/' , (req ,res) =>{
    res.send("hello world")
})

app.listen(port , () =>{
    console.log("authorisation backend listening at http://localhost: " + port);
})