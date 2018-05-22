var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let appUri = "http://localhost:3000"
let authProviders = [
  {
    req_uri: `https://api.instagram.com/oauth/authorize/`,
    name: "Instagram",
    client_id: "CLINET_ID",
    client_secret: "CLIENT_SECRET",
    id: "insta_int",
    token_uri: 'https://api.instagram.com/oauth/access_token'
  },
  {
    req_uri: `https://www.dropbox.com/oauth2/authorize`,
    name: "Dropbox",
    client_id: "CLINET_ID",
    client_secret: "CLIENT_SECRET",
    id: "dropbox_int",
    token_uri: 'https://api.dropboxapi.com/oauth2/token'
  }
]
function get_provider (id) {
  let data = Object();
  authProviders.forEach(e=>{
    if(e.id == id) {
      data.authProvider = e;
      data.authProvider.redirect_uri = `${appUri}/auth-module/oauth2/callback/${id}`;
      return 0;
    }
  })
  data.authProvider.req_uri2 = `${data.authProvider.req_uri}?client_id=${data.authProvider.client_id}&redirect_uri=${data.authProvider.redirect_uri}&response_type=code`;
  return data.authProvider;
}
router.get('/auth-module/oauth2', function(req, res, next) {
  let data = {
    title: "oAuth Dialog",
  }
  data.authProvider = get_provider(req.query.provider_id);
  res.render('oauth-dialog', data)
});

router.get('/auth-module/oauth2/callback/:provider_id', function(req, res, next) {
  // Example : http://localhost:3000/auth-module/oauth2/callback/dropbox_int
  let $http = require('request-promise');
  let data = {
    title: "oAuth Dialog",
  }
  data.authProvider = get_provider(req.params.provider_id)
  let code = req.query.code;
  $http({
    uri : data.authProvider.token_uri,
    method: "POST",
    formData: {
      client_id: data.authProvider.client_id,
      client_secret: data.authProvider.client_secret,
      grant_type: "authorization_code",
      redirect_uri: data.authProvider.redirect_uri,
      code: code
    }
  }).then(r => {
    let data = {
      title: "oauth",
      auth: r
    }
    res.render('oauth-dialog-complete', data);
  })
  .catch(err=> {
    res.json(err);    
  })
});


module.exports = router;
