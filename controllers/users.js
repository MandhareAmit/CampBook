const User = require('../models/user');


module.exports.register =  (req, res) => {
    res.render('users/register');
}

module.exports.registerUser =  async (req, res, next) => {
    
     try{
    const{email, username, password} = req.body;
    const user = new User({ email, username});
    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
        if(err) return next(err);
        req.flash('success','Welcome to CampBook!');
        res.redirect('/');
    })
    }catch (e) {
        req.flash('error', 'Username or Email already Exists!');
        //req.flash('error', e.message);
        res.redirect('register');
    }
     
}

module.exports.loginRender = (req, res) => {
    res.render('users/login');
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutRender = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}