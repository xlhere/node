var express = require("express");

var router = express.Router();

var md5 = require("blueimp-md5");

var User = require("./models/user");

router.get("/", function(req, res) {
  // console.log(req.session.user)
  res.render("index.html", {
    user: req.session.user
  });
});

router.get("/login", function(req, res) {
  res.render("login.html");
});

router.post("/login", function(req, res, next) {
  // console.log(req.body)
  var body = req.body;
  User.findOne(
    {
      email: body.email,
      password: md5(md5(body.password))
    },
    function(err, user) {
      if (err) {
        // return res.status(500).json({
        //   err_code:500,
        //   message:err.message
        // })
        return next(err);
      }

      if (!user) {
        return res.status(200).json({
          err_code: 1,
          message: "Email or password is invalid"
        });
      }

      //用户存在，登录成功，通过session纪录登录状态
      req.session.user = user;

      res.status(200).json({
        err_code: 0,
        message: "OK"
      });
    }
  );
});

router.get("/register", function(req, res) {
  res.render("register.html");
});

router.post("/register", function(req, res, next) {
  //1. 获取表单提交的数据
  //   req.body
  //2. 操作数据库
  //   判断用户是否已存在 如果已存在不允许注册 如果不存在注册新建用户
  //3. 发送响应
  var body = req.body;
  //这里培训老师用了异步方法 让带脉的结构是平行的 而非是潜逃的 清晰明了
  User.findOne(
    {
      $or: [{ email: body.email }, { nickname: body.nickname }]
    },
    function(err, data) {
      if (err) {
        // return res.status(500).json({
        //   err_code: 500,
        //   message: "Internal Error"
        // });

        return next(err);
      }
      if (data) {
        return res.status(200).json({
          err_code: 1,
          message: "Email or nickname already exist"
        });
        // return res.render('register.html',{
        //   err_message:'邮箱或密码已存在',
        //   form_data:body
        // })
      }
      body.password = md5(md5(body.password));
      new User(body).save(function(err, user) {
        if (err) {
          // return res.status(500).json({
          //   err_code: 500,
          //   message: "Internal Error"
          // });
          return next(err);
        }
        req.session.user = user;
        res.status(200).json({
          err_code: 0,
          message: "OK"
        });
      });
    }
  );
});

router.get("/logout", function(req, res) {
  //清除登录状态
  req.session.user = null;

  //重定向到登录页
  res.redirect("/login");
});

router.get("/settings/profile", function(req, res) {
  res.render("settings/profile.html");
});

module.exports = router;
