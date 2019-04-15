var express = require('express')

var app = express()

app.use('/public/',express.static('./public'))


app.listen(5001,function(){
    console.log('running 5001...')
})