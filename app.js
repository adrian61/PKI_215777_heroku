const { google } = require('googleapis');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

var CLIENT_ID;
var CLIENT_SECRET;
var REDIRECT_URL;
try {
const OAuth2Data = require('./google_key.json')
CLIENT_ID = OAuth2Data.web.client_id;
CLIENT_SECRET = OAuth2Data.web.client_secret;
REDIRECT_URL = OAuth2Data.web.redirect_uris[0];
}
catch (e){
    console.log('production')
    CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL ;
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
var path = require('path');
var socialService = ""
app.set('view engine', 'ejs');
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
    res.render('index');
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
                imageProfile = result.data.picture;
                socialService = "google";
            }
            res.render('logged')
        });
    }
})
app.get('/logout', (req, res) => {
    if(socialService == "google"){console.log('1');}
    if(socialService == "facebook"){console.log('2');}
    console.log('3');
    res.render('index')    
})




app.get('/auth/google/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
                res.redirect('/')
            }
        });
    }
});

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
