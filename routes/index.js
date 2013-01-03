
/*
 * GET home page.
 */

exports.index = function(req, res, app){
  res.render('index', { message: 'Express' });
};
exports.postLogin = function(req, res){
	if (req.body.userName && req.body.password){
		var a = exports.mydb.userModel.find({ userName : req.body.userName }, function(err, user){
			if (user.length && req.body.password === user[0].password) {
				res.render('chat', { user: user[0].userName });
			} else {
				res.render('index', { message: 'wrong name or password' });
			}
		});
	} else {
		res.render('index', { message: 'type login and password' });
	}
};
exports.registration = function(req, res){
  res.render('registration', { message: 'Express' });
};
exports.registrationPost = function(req, res){
	var login = req.body.regLogin,
		pass = req.body.regPass,
		passr = req.body.regPassRep;

	if (login && pass && passr) {
		if (pass === passr) {
			var user = new exports.mydb.userModel({ userName : login, password : pass});
			user.save(function(err){
				console.log(err);
			});
			res.render('chat', { user: login });
		} else {
			res.render('registration', { message: 'passwords do not match' });
		}
	} else {
		res.render('registration', { message: 'type login and password' });
	}

};
