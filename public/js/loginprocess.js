module.exports = {

  auto_generator_magiclink: function () {
    var y = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','$','!','-'];

    var magiclink = "";

    for (i = 0; i < 50; i++) { 
      magiclink = magiclink.concat(y[Math.floor((Math.random() * 39))]);
    }
    return magiclink;
  },

  mysql_login: function(mysql){
    var connection = mysql.createConnection({
      host     : '138.68.46.165',
      user     : 'usf',
      password : 'usfca',
      database : 'hackday'
    });

    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return 0;
        }
    })
    return connection;
  },

  email_generator: function(user){

    var nodemailer = require('nodemailer');
 
    // create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport('smtps://hackdayten%40gmail.com:huteng1226@smtp.gmail.com');
     
    // setup e-mail data with unicode symbols 
    var mailOptions = {
        from: '"Hackday" <hackdayten@gmail.com>', // sender address 
        to: user.email, // list of receivers 
        subject: 'MagicLink ✔', // Subject line 
        text: '<h>Hello world </h>', // plaintext body 
        html: '<b>Email Address: '+user.email+'</b><br><br><a href="http://127.0.0.1:8081/urlprocess/?magiclink='+user.magiclink+'&role='+user.role+'\">http://127.0.0.1:8081/urlprocess/?magiclink='+user.magiclink+'&role='+user.role+'</a>' // html body 
    };
     
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
        return 0;
      }
      console.log('Message sent: ' + info.response);
    });
    console.log('finished');
      
  },
};










