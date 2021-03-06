const router = require('express').Router();
let User = require('../models/user.model');
let UserSession = require('../models/userSession.model');


/* GET all users */
router.route('/').get((req, res) => {
  User.find()
  .then(users => res.json(users))
  .catch(err => res.status(400).json('Error: ' + err));
});

/* PUT (edit) user admin status */
router.route('/admin/:id').put((req, res) => {
  User.findById(req.params.id)
  .then(user => {
    user.admin = !user.admin;
    let msg = 'User is no longer an admin.'
    if (user.admin){
      msg = 'User is now an admin'
    }
    user.save()
    .then(() => res.json(msg))
    .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

/* POST login user; creates new user session*/
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
        message: 'Error: User does not exist.'
      });
    }
    const user = users[0];
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: 'Error: Invalid Password'
      });
    }

    // check if verified
    if (!user.isVerified) {
      return res.send({
        success: false,
        message: 'Error: You are unverified!'
      });
    }

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

/* DELETE logout user; deletes user session by id*/
router.route('/account/logout/:id').delete((req, res) => {
  // Get the token
  const token = req.params.id;

  // Verify the token is one of a kind and it's not deleted.
  UserSession.findByIdAndDelete(token)
  .then((session) => {
    if (!session){
      res.send({
        success: false,
        message: session
      })
    }
    res.send({
      success: true,
      message: "Session deleted"

    }
  )})
  .then(()=> console.log(token))
  .catch(err => res.status(400).json('Error: ' + err));

});

/* GET user session info by id; verifies if user is logged in and if user is admin */
router.route('/account/verify/:id').get((req, res) => {
  // Get the token
  const token = req.params.id;

  // Verify the token is one of a kind and it's not deleted.
  UserSession.findById(token)
  .then(session => {
    // Get User Admin Status
    User.findOne({ _id: session.userId}, function (err, user) {

      if (!user) return res.send({
        success: false,
        message: false
      });
      return res.send({
        success: true,
        message: user.admin
      });
    });
  })
  .catch(err =>   {
    return res.send({
      success: false,
      message: false //'Error: Invalid'
    });
  });
})

/* GET user sessions*/
router.route('/sessions').get((req, res) => {
  UserSession.find()
  .then(users => res.json(users))
  .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;
