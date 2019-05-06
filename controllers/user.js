var express = require('express');
var router = express.Router();

var request = require('request');

var BC = require('../models/BC');

var User = require(__dirname + '/../models/User');

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
  BC.getBCData(request.params.id,function(objects){//send name as query parameter
    res.render('saved_data.ejs', {bc: objects});
  });
});

router.post('/movies', function(req, res){
  //get title
  var title=req.body.title;
  title=title.replace(/ /g, '+');
  console.log(title);
  //search for results
  request("http://www.omdbapi.com/?apikey="+apikey+"&t="+title+"&r=json", function(err, response, body) {
      if(!err){
        var movieResponse = JSON.parse(body);
            //if we get results, render update page
        res.render('movies/new_movie.ejs', {movie: movieResponse})
      }
      else{

        res.redirect('/movies');
      }

    });//look for the movie
});

router.post('/movies/:id', function(req, res){
  var movieID=req.params.id;
  console.log(movieID)
  request("http://www.omdbapi.com/?apikey="+apikey+"&i="+movieID+"&r=json", function(err, response, body) {
            var movieResponse = JSON.parse(body);
      console.log(movieResponse)

            if(!err){
              var movieData = Movies.getMovieData();
              var movieList = movieData.movies;
              var newId = parseInt(movieData.movies.length);
              var newMovie={
                "id": newId,
                "title": movieResponse.Title,
                "year": movieResponse.Year,
                "rating": movieResponse.Rated,
                "director": movieResponse.Director,
                "actors": movieResponse.Actors,
                "plot": movieResponse.Plot,
                "poster": movieResponse.Poster,
                "showtimes": ["3:00", "5:30", "8:45"]
              }
              movieData.movies.push(newMovie);
              movieData.counter = movieData.movies.length;
              Movies.saveMovieData(movieData);
              res.redirect('/movies');
      }
      else{

      }
      //if we don't get results, return to page

    });//look for the movie
});

router.get('/movies/:id', function(req,res){
  console.log("looking for movie", req.params.id);
  var thisMovie = Movies.getMovieData().movies[req.params.id];
  res.render("movies/show_movie_detail.ejs", {movie: thisMovie} );

});

router.get('/movies/:id/edit', function(req,res){
  var movieList=Movies.getMovieData();
  var thisMovie = movieList.movies[req.params.id];
  res.render("movies/edit_movie.ejs", {movie: thisMovie} );
});

router.delete('/movies/:id', function(req, res){
  var movieData = Movies.getMovieData();
  var movieToDelete = movieData.movies[req.params.id];

  movieData.movies.splice(req.params.id, 1);

  movieData.counter=movieData.movies.length;
  for(i=0; i< movieData.movies.length;i++){
    movieData.movies[i].id=i;
  }

  Movies.saveMovieData(movieData);

    console.log("deleted"+movieToDelete);
  res.redirect('/movies');
});

router.put('/movies/:id', function(req,res){
  var movieData=Movies.getMovieData();
  var movieList=movieData.movies;
  var thisMovie = movieList[req.params.id];
  console.log(thisMovie);
  thisMovie["id"]= req.body.id;
  thisMovie["title"] = req.body.title;
  thisMovie["year"]= req.body.year;
  thisMovie["rating"]= req.body.rating;
  thisMovie["director"]= req.body.director;
  thisMovie["actors"]= req.body.actors;
  thisMovie["plot"]= req.body.plot;
  thisMovie["poster"]= req.body.poster;
  thisMovie["showtimes"] = req.body.showtimes.split(",");
  console.log(thisMovie);
  Movies.saveMovieData(movieData);
  res.redirect('/movies');
});



module.exports = router;
