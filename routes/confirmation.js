var crypto = require('crypto');
var nodemailer = require('nodemailer');

const router = require('express').Router();
let Token = require('../models/token.model');
let User = require('../models/user.model');

/* GET all tokens */
router.route('/tokens').get((req, res) => {
  Token.find()
  .then(tokens=> res.json(tokens))
  .catch(err => res.status(400).json('Error: ' + err));
});

/* POST user and verification token; used to create new account */
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
        // Create a verification token for this user
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
          if (err) { return res.status(500).send({ success: false, message: err.message }); }

          // Send the email with verification info
          var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.ADMIN_USERNAME, pass: process.env.ADMIN_PASSWORD } });
          var mailOptions = { from: 'stephanie.castaneda@girlswhocode.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ success:false, msg: err.message }); }
            const mes = 'A verification email has been sent to ' + user.email + '.'
            res.send({success: true, message: mes});
          });
        });
      });
    });
  });
}); // end of sign up endpoint

// TODO: test this
/* PUT verify user account with email */
router.route('/:tokenID').put((req, res) => {
    // Find a matching token
    let email = req.body.email;
    email = email.toLowerCase();
    email = email.trim();
    Token.findOne({ token: req.params.tokenID }, function (err, token) {
        if (!token) return res.send({
          success: false,
          message: 'Error: We were unable to find a valid token. Your token my have expired.'
        });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: email}, function (err, user) {
        // User.findOne({ _id: token._userId}, function (err, user) {
            if (!user) return res.send({
              success: false,
              message: 'Error: We were unable to find a user for this token.'
            });
            if (user.isVerified) return res.send({
              success: false,
              message: 'Error: This user has already been verified.'
            });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                return res.send({
                  success: true,
                  message: 'The account has been verified. Please log in.'
                });
            });
        });
    });

});

module.exports = router;
