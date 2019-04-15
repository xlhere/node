var express = require('express')
var path = require('path')
var router = require('./router.js')
var bodyParser = require('body-parser')
var session = require('express-session')
var app = express()

app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))

//配置解析表单 post 请求体插件（一定要在app.use(router)之前）
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//session要在app.use(router)之前
app.use(session({
    //配置加密字符串，他会在原有的加密基础之上和这个字符串拼接起来去加密
    //目的是为了增加安全性，防止客户端恶意伪造
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true //无论你是否使用session，都默认给你直接分配一把钥匙
}))
app.use(router)

//配置一个处理 404 的中间件
app.use(function(req,res){
    res.render('404.html')
})
//配置全局错误处理中间件
app.use(function(err,req,res,next){
    res.status(500).json({
        err_code:500,
        message:err.message
    })
})

app.listen(3000,function(){
    console.log('running...')
})