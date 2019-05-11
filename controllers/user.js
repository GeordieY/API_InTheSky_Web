var express = require('express');
var router = express.Router();

var request = require('request');

var BC = require('../models/BC');

var User = require(__dirname + '/../models/User');

var BCapikey="IdPuT2Or";

router.get('/user/new', function (req, res) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/user/new"
    }
    console.log(log);

    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details');
});

router.get('/users/:id/edit', function (req, res) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': req.params.id,
        'route': "/user/:id/edit"
    }
    console.log(log);


    User.getUserByName(req.params.id, function (u) {
        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        res.render('user_details', {
            user: u
        });
    });
});



router.put('/users/:id', function (req, res) {

	var log = {
		'timestamp': Date(),
		'httpverb': "PUT",
		'username': req.body.id,
		'route': "/users/:id"
	}
	console.log(log);

	User.getUserByName(req.params.id, function (u) {
		User.getUsers(function (users) {
			var found = false;
			users.forEach(function (a) {
				if (a["name"] == req.body.id && req.body.id != req.params.id) {
					found = true;
				}
			});
			if (found) {
				u['response'] = "<p class='red'>Username taken.</p>";
				res.status(200);
				res.setHeader('Content-Type', 'text/html')
				res.render('user_details', {
					user: u
				});
			} else if (req.body.password == req.body.password2) {
				var updatedUser = "";
				if (req.body.id != req.params.id) {
					updatedUser = req.body.id;
				}
				u['name'] = req.body.id;

				u['firstname'] = req.body.fname;
				u['lastname'] = req.body.lname;
				u['password'] = req.body.password;
				User.setUser(req.params.id, u, function () {
					console.log("read");
					User.getUserByName(req.body.id, function (us) {
						us['response'] = "<p class='green'>User details updated.</p>";
						res.status(200);
						res.setHeader('Content-Type', 'text/html')
						res.render('user_details', {
							updatedUser: updatedUser,
							user: us
						});
					});
				});
			} else {
				u['response'] = "<p class='red'>Entered passwords did not match.</p>";
				res.status(200);
				res.setHeader('Content-Type', 'text/html')
				res.render('user_details', {
					user: u
				});
			}
		})
	});
});

router.delete('/users/:id', function (req, res) {

    var log = {
		'timestamp': Date(),
		'httpverb': "DELETE",
		'username': req.params.id,
		'route': "/users/:id"
	}
	console.log(log);

	User.deleteUser(req.params.id); //need to make a deleteUser function

	User.getUsers(function (u) {
		res.status(200);
		res.setHeader('Content-Type', 'text/html')
		res.render('index', {
			newuser: req.params.id,
			users: u
		});
	});
});

router.post('/users', function (req, res) {

	var log = {
		'timestamp': Date(),
		'httpverb': "POST",
		'username': req.body.id,
		'route': "/users"
	}
	console.log(log);

	User.checkNewUser(req.body.id, req.body.password, req.body.password2, function (response) {

		if ((response == "User already taken") || (response == "Passwords do not match")) { //if new user isn't valid
			res.status(200);
			res.setHeader('Content-Type', 'text/html')
			res.render('user_details', {
				response2: response
			}); //lets login page show error message by sendinb back user information with result information
		} else { //if new user is valid
			User.createUser(req.body.id, req.body.password, req.body.fname, req.body.lname, function () {
				User.getUsernames(function (users) {
					res.status(200);
					res.setHeader('Content-Type', 'text/html')
					res.render('index', {
						newuser: req.body.id,
						users: users
					}); //sends you to index
				}); //creates new user
			}); //creates object of new user
		}
	}); //gives response on whether this is a proper new user
});

router.get('/login', function (request, response) {

	var log = {
		'timestamp': Date(),
		'httpverb': "GET",
		'username': request.query.player_name,
		'route': "/login"
	}

	console.log(log);

	User.checkUsername(request.query.player_name, request.query.player_password, function (res) {
		var user_data = {
			username: request.query.player_name,
			password: request.query.player_password,
			result: res
		};
		if (res != "Wrong user/password") {
			response.status(200);
			response.setHeader('Content-Type', 'text/html')
			response.render('search', {
				user: user_data
			});
		} else {
			User.getUsers(function (users) {
				response.status(200);
				response.setHeader('Content-Type', 'text/html')
				response.render('index', {
					user: user_data,
					users: users
				}); //lets login page show error message
			});
		}
	});
});















router.get('/user/:id/data', function(req, res){
  var log = {
      'timestamp': Date(),
      'httpverb': "GET",
      'username': req.params.id,
      'route': "/user/:id/data"
  }
  console.log(log);

  BC.getBCData(req.params.id,function(objects){//send name as query parameter
    console.log(objects);
    res.render('saved_data.ejs', {savedViews: objects});
  });
});




router.get('/getdata', function(req, res){
  /*request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/
var log = {
  'timestamp': Date(),
  'httpverb': "GET",
  'route': "/getdata"
}
console.log(log);

    request("http://ciy-bumpsandcrashes-api.herokuapp.com/bumps?apikey="+BCapikey+"&keywordtype="+req.query.keywordtype+"&keyword="+req.query.keyword, function(err, response, body) {
console.log("firstdone");
      request("http://ciy-bumpsandcrashes-api.herokuapp.com/crashes?apikey="+BCapikey+"&keywordtype="+req.query.keywordtype+"&keyword="+req.query.keyword, function(err2, response2, body2) {
        if(!err&&!err2){
          //var dataResponse = JSON.parse(body);
              //if we get results, render update createPage
              console.log("processing");

          res.send(JSON.stringify({bumps:JSON.parse(body),crashes:JSON.parse(body2)}));
        }
        else{

          res.send(JSON.stringify({errmessage: 'BC API returned no data'}));
        }

      });

      });//look for the movie
});

router.post('/savedata', function(req, res){
  var log = {
    'timestamp': Date(),
    'httpverb': "POST",
    'username': req.body.id,
    'route': "/savedata"
  }
  console.log(log);

BC.addBCData(req.body.id,req.body.savename,{"keyword":req.body.keyword,"keywordtype":req.body.keywordtype},function(){
    res.send('{"status":"success"}');
})

});



module.exports = router;
