var express = require('express');
const React = require('react');
const ReactDOM = require('react-dom');
var cookieParser = require('cookie-parser');

var app = express();
var lp = require('./public/js/loginprocess');
var mysql = require('mysql');

app.use(cookieParser());
app.use(express.static('public'));


app.get('/getphase',function(req,res){
	var connection = lp.mysql_login(mysql);
	connection.query('SELECT * from hackathon;', function (error, rows, fields) {
        if (error){
          console.log(error);
        }
   	res.send(JSON.stringify(rows[0].stage));
	})
	connection.end();
	return;
});

app.get('/urlprocess', function (req, res) {
	var magiclink = req.query.magiclink;
	var role = req.query.role;
	var email = "";

	var connection = lp.mysql_login(mysql);

	var callback = function(email) {
		if(email == -1){
			console.log("invalid magiclink");
		} else {
			res.cookie('email',email,{maxAge:800000000});
			console.log(email + "successfully login");
			res.redirect('/home.html?email=' + email);
		}
	}

	if(role == "p"){
	    connection.query('SELECT * from participant where magiclink = \''+ magiclink +'\';', function (error, rows, fields) {
		    if (error){
	          console.log(error);
	          callback(0);
	        }

		    if (rows.length == 1){
		      connection.end();
		      email = rows[0].email;
		      callback(email);
		    } else {
		      connection.end();
		      res.redirect('/message.html?err='+ 'invalid magiclink');
		    }
	    });
	} else {
	    connection.query('SELECT * from judge where magiclink = \''+ magiclink +'\';', function (error, rows, fields) {
	    if (error){
          console.log(error);
          callback(0);
        }

	    if (rows.length == 1){
	      connection.end();
	      email = rows[0].email;
	      callback(email);
	    } else {
	      connection.end();
	     res.redirect('/message.html?err='+ 'invalid magiclink');
	    }
	  });
	}
});

app.post('/post_phase', function (req, res){
	var callback = function(result) {
	    if(result == 1){
	      console.log('success');
	      res.redirect('/message.html?err='+ 'Registration complete');  
	      return; 
	    }else if(result == 0){
	      console.log('failed');  
	      res.redirect('/message.html?err='+ 'mysql_fail');  
	      return;  
	    }else if(result == -1){
	      console.log('failed');
	      res.redirect('/index.html?err='+ 'judge_Need_Permission_From_Your_Admin');
	      return;
	    }
	}

	var connection = lp.mysql_login(mysql);
	var phase = req.headers.phase;
	
	connection.query('UPDATE hackathon SET stage = \''+phase+'\';', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          });
	connection.query('UPDATE project SET status = \''+phase+'\';', function (error, results, fields) {
          	if(error){
            	console.log(error);
            	callback(0);
          	}
          	});
	if(phase === 'V'){
	connection.query('INSERT INTO grading (email,title) SELECT email, title FROM pp;', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          });
	
	}
	connection.end();
	res.send(JSON.stringify(1));
		return;
		
});

app.post('/post_admin', function (req, res){
	var callback = function(result) {
	    if(result == 1){
	      console.log('success');
	      res.redirect('/message.html?err='+ 'Registration complete');  
	      return; 
	    }else if(result == 0){
	      console.log('failed');  
	      res.redirect('/message.html?err='+ 'mysql_fail');  
	      return;  
	    }else if(result == -1){
	      console.log('failed');
	      res.redirect('/index.html?err='+ 'judge_Need_Permission_From_Your_Admin');
	      return;
	    }
	}

	var parsed_emails = req.headers.email.split(", ");
	var connection = lp.mysql_login(mysql);
	connection.query('DELETE * FROM judge Where perm=\'J\';', function (error, results, fields) {
            if (error){
            	console.log(error);
            	callback(0);
            }
    });
	connection.query('UPDATE judge SET title= \''+req.headers.name+'\', description= \''+req.headers.description+'\' WHERE index =\'1\';', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          });
	for(var i = 0; i < parsed_emails.length ; i++){
		connection.query('INSERT INTO judge (email,magiclink,perm) values (\''+parsed_emails[i]+'\', \'\', \'J\');', function (error, results, fields) {
          	if(error){
            	console.log(error);
            	callback(0);
          	}
          	});
		}
	connection.end();
	res.send(JSON.stringify(1));
		return;
		
});

app.post('/post_register', function (req, res){
	var callback = function(result) {
	    if(result == 1){
	      console.log('success');
	      res.redirect('/message.html?err='+ 'Registration complete');  
	      return; 
	    }else if(result == 0){
	      console.log('failed');  
	      res.redirect('/message.html?err='+ 'mysql_fail');  
	      return;  
	    }else if(result == -1){
	      console.log('failed');
	      res.redirect('/index.html?err='+ 'judge_Need_Permission_From_Your_Admin');
	      return;
	    }
	}

	var parsed_emails = req.headers.email.split(", ");
	var connection = lp.mysql_login(mysql);
	connection.query('INSERT INTO project (title,description,video,repo,demo,creativity,impact,viability,status) values (\''+req.headers.title+'\', \''+req.headers.description+'\', \''+req.headers.video+'\', \''+req.headers.repo+'\', \''+req.headers.demo+'\', \'0\',\'0\',\'0\',\'V\');', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          });
	for(var i = 0; i < parsed_emails.length ; i++){
		connection.query('INSERT INTO pp (email,title) values (\''+parsed_emails[i]+'\', \''+req.headers.title+'\');', function (error, results, fields) {
          	if(error){
            	console.log(error);
            	callback(0);
          	}
          	});
		}
	connection.end();
	res.send(JSON.stringify(1));
	return;
});

app.post('/post_regout', function (req, res){
	var callback = function(result) {
	    if(result == 1){
	      console.log('success');
	      res.redirect('/message.html?err='+ 'Registration complete');  
	      return; 
	    }else if(result == 0){
	      console.log('failed');  
	      res.redirect('/message.html?err='+ 'mysql_fail');  
	      return;  
	    }else if(result == -1){
	      console.log('failed');
	      res.redirect('/index.html?err='+ 'judge_Need_Permission_From_Your_Admin');	
	      return;
	    }
	}

	var parsed_emails = req.headers.email.split(", ");
	var title = req.query.title;
	var connection = lp.mysql_login(mysql);
	connection.query('DELETE FROM pp WHERE title =\''+req.query.title+'\';', function (error, results, fields) {
            if (error){
            	console.log(error);
            	callback(0);
            }
    });
    connection.query('DELETE FROM project WHERE title =\''+req.query.title+'\';', function (error, results, fields) {
            if (error){
            	console.log(error);
            	callback(0);
            }
    });
	connection.query('INSERT INTO project (title,description,video,repo,demo,creativity,impact,viability,status) values (\''+req.headers.title+'\', \''+req.headers.description+'\', \''+req.headers.video+'\', \''+req.headers.repo+'\', \''+req.headers.demo+'\', \'0\',\'0\',\'0\',\'O\');', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          });
	for(var i = 0; i < parsed_emails.length ; i++){
		connection.query('INSERT INTO pp (email,title) values (\''+parsed_emails[i]+'\', \''+req.headers.title+'\');', function (error, results, fields) {
          	if(error){
            	console.log(error);
            	callback(0);
          	}
          	});
		}
	connection.end();
	res.send(JSON.stringify(1));
	return;	
});

app.get('/get_register', function(req, res, next){
	var title= req.query.title;
	var datalist= [];
	var connection = lp.mysql_login(mysql);
	var callback = function(){
		res.send(JSON.stringify(datalist));
		res.end();
		return;		
	}	


	    	connection.query('SELECT * from project where title = \''+ title +'\';', function (error, rows, fields) {
			    if(error){
					err[0] = '/message.html?err='+ 'mysql_fail_on_taking_registration';
					res.send(JSON.stringify(err));
					res.end();
					return;
				}
				
	    		datalist[0] = rows[0].description;
	    		datalist[1] = rows[0].video;
	    		datalist[2] = rows[0].repo;
	    		datalist[3] = rows[0].demo;
	    		connection.query('SELECT email from pp where title = \''+title + '\';', function (error,rows,fields){
	    		if(error){
					err[0] = '/message.html?err='+ 'mysql_fail_on_taking_registration';
					res.send(JSON.stringify(err));
					res.end();
					return;
				}
				var email = "";
				for(var i=0 ; i<rows.length ; i++){
					var newString = rows[i].email+", ";
					email = email.concat(newString);
				}
				datalist[4] = email;
				callback();
	    	});
	    	});
	    	
	    	
	    

	}); 


app.post('/post_gradelist', function (req, res){
	if(gradelist = req.headers.gradelist.split(',')){
		var email = gradelist[0];
		var connection = lp.mysql_login(mysql);
		for(var i=1; i<gradelist.length; i+=4){
			connection.query('UPDATE grading SET creativity= \''+gradelist[i+1]+'\', impact= \''+gradelist[i+2]+'\', viability= \''+gradelist[i+3]+'\', status= \'d\' WHERE email=\''+email+'\' and title= \''+gradelist[i]+'\';', function (error, rows, fields) {
			    if(error){
		          console.log(error);
		          callback(0);
		        }
			});
		}
		res.send(JSON.stringify(1));
		return;
	}else{
		res.send(JSON.stringify(0));
		return;
	}
});

app.post('/post_projectlist', function (req, res){
	if(status = req.headers.statuslist.split(',')){
		if (title = req.headers.titlelist.split(',')) {
		var connection = lp.mysql_login(mysql);
		for(var i=0; i<status.length; i++){
			connection.query('UPDATE project SET status= \'' + status[i] + '\'WHERE title= \'' + title + '\';', function (error, rows, fields) {
			    if(error){
		          console.log(error);
		          callback(0);
		        }
			});
		}
		res.send(JSON.stringify(1));
		return;
		}
	}else{
		res.send(JSON.stringify(0));
		return;
	}
});

app.post('/post_gradetable', function (req, res){
	var email = req.headers.email ;
	var tovotelist = [];
	var myproject=[];
	var err = [];
	var count = 0;
	var connection = lp.mysql_login(mysql);
	var callback=function(){
	   	connection.query('SELECT title FROM project;', function (error, rows, fields) {
			if(error){
		        console.log(error);
			}
			for(var i = 0; i < rows.length ; i++){
				var addit = 0;
				for(var c = 0; c < myproject.length; c++){
					if(rows[i].title == myproject[c]){
						addit = 1;
					}
				}
				if(addit == 0){
					tovotelist[tovotelist.length] = rows[i].title;
				}
			}
			callback2();
		});
	}
	var callback2 = function(){
		for(var c = 0; c < tovotelist.length ; c++){
			connection.query('INSERT INTO grading (email,title,creativity,impact,viability,status) values (\''+email+'\', \''+tovotelist[c]+'\',\'0\',\'0\',\'0\',\'v\');', function (error, rows, fields) {
			    if(error){
		          console.log(error);
		        }
                count++;
				if(count == tovotelist.length){
					res.send(JSON.stringify(1));
					return;
				}
			});
		}
	};

   	connection.query('SELECT title FROM pp WHERE email=\''+email+'\';', function (error, rows, fields) {
		if(error){
		   console.log(error);
		}
		for(var i = 0; i < rows.length ; i++){
			myproject[i] = rows[i].title;
		}
		callback();
	});

});

app.post('/post_register', function (req, res){
	var callback = function(result) {
	    if(result == 1){
	      console.log('success');
	      res.redirect('/message.html?err='+ 'Registration complete');  
	      return; 
	    }else if(result == 0){
	      console.log('failed');  
	      res.redirect('/message.html?err='+ 'mysql_fail');  
	      return;  
	    }else if(result == -1){
	      console.log('failed');
	      res.redirect('/index.html?err='+ 'judge_Need_Permission_From_Your_Admin');
	      return;
	    }
	}
	var parsed_emails = req.headers.email.split(", ");
	var connection = lp.mysql_login(mysql);
	connection.query('DELETE FROM pp WHERE title =\''+req.headers.title+'\';', function (error, results, fields) {
            if (error){
            	console.log(error);
            	callback(0);
            }
    });
	connection.query('INSERT INTO project (title,description,video,repo,demo,creativity,impact,viability) values (\''+req.headers.title+'\', \''+req.headers.description+'\', \''+req.headers.video+'\', \''+req.headers.repo+'\', \''+req.headers.demo+'\', \'0\',\'0\',\'0\');', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          });
	for(var i = 0; i < parsed_emails.length ; i++){
		connection.query('INSERT INTO pp (email,title) values (\''+parsed_emails[i]+'\', \''+req.headers.title+'\');', function (error, results, fields) {
          	if(error){
            	console.log(error);
            	callback(0);
          	}
          	});
		}
	connection.end();
	res.send(JSON.stringify(1));
	return;	
});


app.get('/setcookie', function (req, res){
	res.cookie('email','hierifer@hotmail.com',{maxAge:800000000});
	res.redirect('/grade.html');
});

app.get('/getcookie', function (req, res){
	res.send(req.cookies.email);
	res.end();
});

app.get('/gethome', function (req, res){
	res.cookie('email','yxiao11@dons.usfca.edu',{maxAge:800000000});
	res.redirect('/home.html');
});

app.get('/gethackathon', function (req, res){
	res.cookie('email','yxiao12@hotmail.com',{maxAge:800000000});
	res.redirect('/hackathon.html');
});

app.get('/getwinner', function (req, res){
	res.cookie('email','yxiao@usfca.edu',{maxAge:800000000});
	res.redirect('/winner.html');
});

app.get('/getadmin', function (req, res){
	res.cookie('email','admin@gmail.com',{maxAge:800000000});
	res.redirect('/admin-hackathon.html');
});

app.get('/logprocess', function (req, res){
	var role = "p";

	if(req.query.role){
		role = req.query.role;
	}

	if(!req.query.email){
		res.redirect("/index.html?err=bad_login");
		return 0;
	}
	console.log("already in");
	var user = {
		email : req.query.email,
		magiclink : lp.auto_generator_magiclink(),
		role : role,
	};

	var callback = function(result) {
	    if(result == 1){
	      if(lp.email_generator(user) == 0){
	        console.log('failed');
	        res.redirect('/message.html?err='+ 'emailsender_fail');
	        return;
	      }else{
	        console.log('send');
	        res.redirect('/message.html?mes='+ 'Email_Already_Sent,_Please_Check_your_Mailbox');
	        return;
	      }
	    }else if(result == 0){
	      console.log('failed');  
	      res.redirect('/message.html?err='+ 'mysql_fail');  
	      return;  
	    }else if(result == -1){
	      console.log('failed');
	      res.redirect('/index.html?err='+ 'judge_Need_Permission_From_Your_Admin');
	      return;
	    }
	}

	//Login to DB
	var connection = lp.mysql_login(mysql);

	if(user.role == "p"){
      connection.query('SELECT * from participant where email = \''+user.email+'\';', function (error, rows, fields) {
        if(error){
          console.log(error);
          callback(0);
        }

        if (rows.length != 0){
          connection.query('UPDATE participant SET magiclink= \''+user.magiclink+'\' WHERE email=\''+user.email+'\';', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          console.log(user.email + ' Login');
          connection.end();
          callback(1);
          });
        } 
        else {
          connection.query('INSERT INTO participant (email,magiclink) values (\''+user.email+'\', \''+user.magiclink+'\');', function (error, results, fields) {
          if(error){
            console.log(error);
            callback(0);
          }
          console.log(user.email + ' signin');
          connection.end();
          callback(1);
          });
        }
      });
    }
    else {
        connection.query('SELECT * from judge where email = \''+user.email+'\';', function (error, rows, fields) {
        if (error){
          console.log(error);
          callback(0);
        }

        if (rows.length != 0){
          connection.query('UPDATE participant SET magiclink= \''+user.magiclink+'\' WHERE email=\''+user.email+'\';', function (error, results, fields) {
            if (error){
              console.log(error);
              callback(0);
            }
            console.log(user.email + ' Login');
            connection.end();
            callback(1);
          });
        }
        else{
          callback(-1);         
        }
      });
    }
});

app.post('/post_register', function (req, res){
	var emails = req.query.email;
	var parsed_emails = emails.split(", ")
	//TODO CONDITIONAL IF THE DATA IS ALREADY EXIST (UPDATE)
	for(var i = 0; i < parsed_emails.length ; i++){
		connection.query('INSERT INTO pp (email,title) values (\''+parsed_emails[i]+'\', \''+req.query.title+'\');', function (error, results, fields) {
          	if(error){
            	console.log(error);
          	}
          	connection.end();
          //callback(1);
          	});
	}
	connection.query('INSERT INTO project (title,description,video,repo,demo,creativity,impact,viability) values (\''+req.query.title+'\', \''+req.query.description+'\', \''+req.query.video+'\', \''+req.query.repo+'\', \''+req.query.demo+'\', \'0\',\'0\',\'0\');', function (error, results, fields) {
          if(error){
            console.log(error);
          }
          connection.end();
          //callback(1);
          });
});

// app.get('/get_register', function(req, res, next){
// 	var title_get = req.query.title;

// 	//fetch from mysql
// 	var datalist = [];
// 	var connection = lp.mysql_login(mysql);
// 	var callback = function(){
// 		res.send(JSON.stringify(datalist));
// 		res.end();
// 		return;		
// 	}
// 	//TODO PUTTING EMAILS INTO THE FORM BY GRABBING FROM PP TABLE
// 	//should be for HOME
// 	// connection.query('SELECT * from pp where email = \''+ email_get +'\' AND title = \''+ title_get +'\';', function (error, rows, fields) {
// 	// 	if(error){
// 	// 		err[0] = '/message.html?err='+ 'mysql_fail_on_grading';
// 	// 		res.send(JSON.stringify(err));
// 	// 		res.end();
// 	// 		return;
// 	// 	}	

// 	for(var i = 0; i < rows.length ; i++){

// 	    	connection.query('SELECT * from project where title = \''+ title_get +'\';', function (error, rows, fields) {
// 			    if(error){
// 					err[0] = '/message.html?err='+ 'mysql_fail_on_taking_registration';
// 					res.send(JSON.stringify(err));
// 					res.end();
// 					return;
// 				}
				
// 	    		datalist[datalist.length] = rows[0].title;
// 	    		datalist[datalist.length] = rows[0].description;
// 	    		datalist[datalist.length] = rows[0].video;
// 	    		datalist[datalist.length] = rows[0].repo;
// 	    		datalist[datalist.length] = rows[0].demo;

// 	    		if(datalist.length == rows.length  * 5){
// 	    			callback();
// 	    		}
// 	    		});
// 	    }

// 	}); 


app.get('/get_gradelist', function(req, res, next){
	var email_get = req.query.email;
	if(email_get == ""){
		err[0] = '/index.html?err=not_login';
		res.send(JSON.stringify(err));
		res.end();
		return;
	}
	/*var email_cookie = "hierifer@hotmail.com";
    var err = [];
	// check cookie is correct set
	if(email_cookie == ""){
		err[0] = '/index.html?err=not_login';
		res.send(JSON.stringify(err));
		res.end();
		return;
	}
	// check the consistent of get and cookie
	if(email_cookie != email_get){
		err[0] = '/message.html?err=bad_url --'+email_get+' req.cookies.email '+email_cookie;
		res.send(JSON.stringify(err));
		res.end();
		return;
	}*/

	//fetch from mysql
	var datalist = [];
	var connection = lp.mysql_login(mysql);
	var callback = function(){
		res.send(JSON.stringify(datalist));
		res.end();
		return;		
	}

	connection.query('SELECT title from grading where email = \''+ email_get +'\' AND status = \'v\';', function (error, rows, fields) {
		if(error){
			err[0] = 'mysql_fail_on_grading';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}	

		if(rows.length == 0){
			err[0] = 'grading_table_is_currently_unavailble_or_already_did_grade';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}

	    for(var i = 0; i < rows.length ; i++){

	    	connection.query('SELECT * from project where title = \''+ rows[i].title +'\';', function (error, rows2, fields) {
			    if(error){
					err[0] = 'mysql_fail_on_grading';
					res.send(JSON.stringify(err));
					res.end();
					return;
				}
				
	    		datalist[datalist.length] = rows2[0].title;
	    		datalist[datalist.length] = rows2[0].description;
	    		datalist[datalist.length] = rows2[0].video;
	    		datalist[datalist.length] = rows2[0].repo;
	    		datalist[datalist.length] = rows2[0].demo;

	    		if(datalist.length == rows.length  * 5){
	    			callback();
	    		}	
	    	});
	    }

	}); 
});

app.get('/get_pp', function(req, res, next){
	var email_get = req.query.email;
	var err = [];
	if(email_get == ""){
		err[0] = '/index.html?err=not_login';
		res.send(JSON.stringify(err));
		res.end();
		return;
	}

	//fetch from mysql
	var datalist = [];
	var connection = lp.mysql_login(mysql);
	var callback = function(){
		res.send(JSON.stringify(datalist));
		res.end();
		return;		
	}

	connection.query('SELECT title from pp where email = \''+ email_get +'\';', function (error, rows, fields) {
		if(error){
			err[0] = 'mysql_fail_on_pp';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}	

		if(rows.length == 0){
			err[0] = 'No_Project_In_Your_Team';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}

		for(var i = 0; i < rows.length ; i++){
			datalist[i] = rows[i].title;
		}

		if(datalist.length == rows.length){
	    	callback();
	   	}
	});
});

app.get('/get_winner', function(req, res, next){
	var email_get = req.query.email;
	var err = [];
	if(email_get == ""){
		err[0] = '/index.html?err=not_login';
		res.send(JSON.stringify(err));
		res.end();
		return;
	}

	//fetch from mysql
	var datalist = [];
	var connection = lp.mysql_login(mysql);
	var callback = function(){
		res.send(JSON.stringify(datalist));
		res.end();
		return;		
	}

	connection.query('SELECT title from project where status = \'1\';', function (error, rows, fields) {
		if(error){
			err[0] = 'mysql_fail_on_project';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}	

		if(rows.length == 0){
			err[0] = 'No_winner';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}
		// #-1
		datalist[0] = rows[0].title;

	    connection.query('SELECT title from project where status = \'2\';', function (error, rows1, fields) {
		    if(error){
				err[0] = 'mysql_fail_on_project';
				res.send(JSON.stringify(err));
				res.end();
				return;
			}
			if(rows.length == 0){
				err[0] = 'No_winner';
				res.send(JSON.stringify(err));
				res.end();
				return;
			}
			// #-2
			datalist[1] = rows1[0].title;

	    	connection.query('SELECT title from project where status = \'3\';', function (error, rows2, fields) {
		    	if(error){
					err[0] = 'mysql_fail_on_project';
					res.send(JSON.stringify(err));
					res.end();
					return;
				}
				if(rows.length == 0){
					err[0] = 'No_winner';
					res.send(JSON.stringify(err));
					res.end();
					return;
				}	
				// #-3
				datalist[2] = rows2[0].title;

				if(datalist.length == 3){
	    			callback();
	   			}

	    	});

	   	});

	});
});

app.get('/get_titleLen', function(req, res, next){
	var email_get = req.query.email;
	var err = [];
	if(email_get == ""){
		err[0] = '/index.html?err=not_login';
		res.send(JSON.stringify(err));
		res.end();
		return;
	}

	//fetch from mysql
	var datalist = [];
	var connection = lp.mysql_login(mysql);

	connection.query('SELECT title from grading where email = \''+ email_get +'\' AND status = \'v\';', function (error, rows, fields) {
		if(error){
			err[0] = 'mysql_fail_on_grading';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}	
        datalist[0] = rows.length;
		res.send(JSON.stringify(datalist));
	    	
	});
});


app.get('/get_projectList', function(req, res, next){
	var email_get = req.query.email;
	var err = [];
	if(email_get == ""){
		err[0] = '/index.html?err=not_login';
		res.send(JSON.stringify(err));
		res.end();
		return;
	}

	//fetch from mysql
	var datalist = [];
	var connection = lp.mysql_login(mysql);
	var callback = function(){
		res.write(JSON.stringify(datalist));
		res.end();
		return;		
	}

   	connection.query('SELECT title, description, status from project where status != \'p\';', function (error, rows, fields) {
	    if(error){
			err[0] = 'mysql_fail_on_project';
			res.send(JSON.stringify(err));
			res.end();
			return;
		}

	    for(var i = 0; i < rows.length; i++){
	    	connection.query('SELECT creativity, impact, viability from grading where title = \''+ rows[i].title +'\';', function (error, rows2, fields) {
				if(error){
					err[0] = 'mysql_fail_on_grading';
					res.send(JSON.stringify(err));
					res.end();
					return;
				}	
				var creativity = 0;
		    	var impact = 0;
		    	var viability = 0;
		        
		    	for(var c = 0; c < rows2.length; c++){
		    		creativity+=rows2[c].creativity;
		    		impact+=rows2[c].impact;
		    		viability+=rows2[c].viability;
		    	}
		    	datalist[datalist.length] = {'title':rows[datalist.length].title,'description':rows[datalist.length].description,'status':rows[datalist.length].status,'creativity':creativity, 'impact':impact, 'viability': viability};
		    	if(datalist.length == rows.length-1){
		    		callback();
		    	} 	
			});
	    }
   	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.write("404: NOT FOUND");
  res.end();
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});
