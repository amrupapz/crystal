const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const db = require('../db');
const {mongo} = require('../controllers/mongo.controller');

// TODO REPLACE WITH STORAGE IN FIRESTORE
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/auth/google/callback',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    issuer,
    profile.id
  ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) {
      db.run('INSERT INTO users (name) VALUES (?)', [
        profile.displayName
      ], function(err) {
        if (err) { return cb(err); }

        var id = this.lastID;
        // Insert into Mongo
        mongo().db('whatsgood').collection('people').updateOne({id: id}, {$set: { name: profile.displayName }}, {upsert: true}).finally();
        db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
          id,
          issuer,
          profile.id
        ], function(err) {
          if (err) { return cb(err); }
          var user = {
            id: id,
            name: profile.displayName
          };
          return cb(null, user);
        });
      });
    } else {
      db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false); }
        return cb(null, row);
      });
    }
  });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// Google Oauth2
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google Oauth2 callback url
router.get('/google/callback', passport.authenticate('google'), (req, res, next) => {
  res.redirect("http://localhost:3000/users?id=" + req.user.id);
});
module.exports = router;