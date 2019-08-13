var crypto = require('crypto');
var nodemailer = require('nodemailer');

const router = require('express').Router();
let Token = require('../models/token.model');
let User = require('../models/token.model');

/**
* POST /signup
*/

router.route('/').post((req, res) => {
  const { body } = req;
  const { password, username } = body;
  let { email } = body;

  email = email.toLowerCase();
  email = email.trim();
  // Steps:
  // 0. Verify username doesn't exist
  // 1. Verify email doesn't exist
  // 2. Save
  User.find({
    username: username
  }, (err, previousUsers) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error trying to find previous users with username'
      });
    } else if (previousUsers.length > 0) {
      return res.send({
        success: false,
        message: 'Error: Username already exist.'
      });
    }
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error trying to find previous users with email'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account already exist.'
        });
      }
      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.username = username;
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error trying to save'
          });
        }
        //  // Create a verification token for this user
        // var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        //
        // // Save the verification token
        // token.save(function (err) {
        //     if (err) { return res.status(500).send({ msg: err.message }); }
        //
        //     // Send the email
        //     var transporter = nodemailer.createTransport({ service: 'Events App', auth: { user: process.env.ADMIN_USERNAME, pass: process.env.ADMIN_PASSWORD } });
        //     var mailOptions = { from: 'stephaniec1997@yahoo.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
        //     transporter.sendMail(mailOptions, function (err) {
        //         if (err) { return res.status(500).send({ success:false, msg: err.message }); }
        //         res.status(200).send('A verification email has been sent to ' + user.email + '.');
        //     });

        return res.send({
          success: true,
          message: 'Signed up'
        });
      });
    });
  });

}); // end of sign up endpoint

module.exports = router;
