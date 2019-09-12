var crypto = require('crypto');
var nodemailer = require('nodemailer');

const router = require('express').Router();
let Token = require('../models/token.model');
let User = require('../models/user.model');
/**
* POST /resend
*/
router.route('/').post((req, res) => {
    const { body } = req;
    let { email } = body;

    email = email.toLowerCase();
    email = email.trim();


    User.findOne({ email: email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
          if (err) { return res.status(500).send({ success: false, message: err.message }); }

          // Send the email
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

module.exports = router;
