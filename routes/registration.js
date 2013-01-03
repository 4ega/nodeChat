
/*
 * GET registration page.
 */

exports.registration = function(req, res){
  res.render('registration', { message: 'Express' });
};
