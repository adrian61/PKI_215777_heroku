const { google } = require('googleapis');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const OAuth2Data = require('./google_key.json')

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
var path = require('path');
app.get('/bootstrap.min.css', function(req, res) {
    res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});
app.get('/bootstrap-social.css', function(req, res) {
    res.sendFile(__dirname + '/node_modules/bootstrap-social/bootstrap-social.css');
});
app.get('/font-awesome.css', function(req, res) {
    res.sendFile(__dirname + '/node_modules/font-awesome/css/font-awesome.min.css');
});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/static/style.css');
});
app.get('/logo.png', function(req, res) {
    res.sendFile(__dirname + '/static/logo.png');
});
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/static/index.html'));
    //__dirname : It will resolve to your project folder.
  });

app.get('/google_login', (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile'
        });
        console.log(url)
        res.redirect(url);
    } else {
        var oauth2 = google.oauth2({auth:oAuth2Client, version:'v2'});
        oauth2.userinfo.v2.me.get(function(err,result) {
            if(err){
                console.log('caught error');
                console.log(err);
            } else{
                loggedUser= result.data.name;
                console.log(loggedUser);
            }
            res.send('Logged in:'. concat(loggedUser, ' <img src="',result.data.picture, '"height="23" width="23">'))
        });
    }
})

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
