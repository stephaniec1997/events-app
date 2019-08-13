const router = require('express').Router();
let User = require('../models/user.model');
let UserSession = require('../models/userSession.model');



router.route('/').get((req, res) => {
  User.find()
  .then(users => res.json(users))
  .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/account/signup').post((req, res) => {
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

router.route('/account/signin').post((req, res) => {
  const { body } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;

  email = email.toLowerCase();
  email = email.trim();
  User.find({
    email: email
  }, (err, users) => {
    if (err) {
      console.log('err 2:', err);
      return res.send({
        success: false,
        message: 'Error: server error'
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    }
    const user = users[0];
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    }

    //check if verified
    // if (!user.isVerified) {
    //   return res.send({
    //     success: false,
    //     message: 'Error: You are unverified!'
    //   });
    // }

    // Otherwise correct user
    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      return res.send({
        success: true,
        message: 'Valid sign in',
        token: doc._id
      });
    });
  });
});

router.route('/account/logout').get((req, res) => {
  // Get the token
    const token = req.body.token;

    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.findOneAndUpdate({
      id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted:true
      }
    }, null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Good'
      });
    });
});


router.route('/account/verify').get((req, res) => {
  // Get the token
    const token = req.body.token;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.find({
      id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: sessions//'Error: Invalid'
        });
      } else {
        // DO ACTION
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
})



module.exports = router;
