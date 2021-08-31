/**
 * QuickBooksController
 *
 * @description :: Server-side logic for managing quickbooks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


const OAuthClient = require('intuit-oauth');
let oauth2_token_json = null;
let redirectUri = '';

let oauthClient = null;
module.exports = {

  callback: async function (req, res) {

    try {

      oauthClient
        .createToken(req.url)
        .then(function (authResponse) {
          oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
        })
        .catch(function (e) {
          console.error(e);
        });

      res.send('');


    } catch (error) {

      return console.log(error);;

    }





  },


  authUri: async function (req, res) {
    try {

      oauthClient = new OAuthClient({
        clientId: req.query.json.clientId,
        clientSecret: req.query.json.clientSecret,
        environment: req.query.json.environment,
        redirectUri: req.query.json.redirectUri,

      });





      const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: 'intuit-test',
      });
      res.send(authUri);
    } catch (error) {
      return console.log(error);

    }
  },

  retrieveToken: async function (req, res) {
    try {
      res.send(oauth2_token_json);
    } catch (error) {
      return console.log(error);
    }

  },



  refreshAccessToken: async function (req, res) {

    try {
      oauthClient
        .refresh()
        .then(function (authResponse) {
          console.log(`The Refresh Token is  ${JSON.stringify(authResponse.getJson())}`);
          oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
          res.send(oauth2_token_json);
        })
        .catch(function (e) {
          console.error(e);
        });
    } catch (error) {
      return console.log(error);
    }
  },


  getCompanyInfo: async function (req, res) {
    try {
      const companyID = oauthClient.getToken().realmId;

      const url =
        oauthClient.environment == 'sandbox'
          ? OAuthClient.environment.sandbox
          : OAuthClient.environment.production;

      oauthClient
        .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
        .then(function (authResponse) {
          console.log(`The response for API call is :${JSON.stringify(authResponse)}`);
          res.send(JSON.parse(authResponse.text()));
        })
        .catch(function (e) {
          console.error(e);
        });

    } catch (error) {
      return console.log(error);
    }
  },

  getInvoice: async function (req, res) {
    try {
      const companyID = oauthClient.getToken().realmId;
      const invoiceID = oauthClient.getToken().invoiceId;
      console.log(companyID ,invoiceID);


      const url =
        oauthClient.environment == 'sandbox'
          ? OAuthClient.environment.sandbox
          : OAuthClient.environment.production;

      oauthClient
      // .makeApiCall({ url: `${url}/v3/company/${companyID}/invoice` })
      .makeApiCall({ url: `${url}v3/company/${companyID}/invoice/1` })
        .then(function (authResponse) {
          console.log(`The response invoice for API call is :${JSON.stringify(authResponse)}`);
          res.send(JSON.parse(authResponse.text()));
        })
        .catch(function (e) {
          console.error(e);
        });

      // oauthClient
      //   .makeApiCall({
      //     url: `${url}/v3/company/${companyID}/invoice`,
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
         
      //   })
      //   .then(function (response) {
      //     console.log('The API response is  : ' + response);
      //   })
      //   .catch(function (e) {
      //     console.log('The error is ' + JSON.stringify(e));
      //   });

    } catch (error) {
      return console.log(error);
    }
  },
  getCustomer: async function (req, res) {
    try {
      const companyID = oauthClient.getToken().realmId;
      const invoiceID = oauthClient.getToken().invoiceId;
      console.log(companyID ,invoiceID);


      const url =
        oauthClient.environment == 'sandbox'
          ? OAuthClient.environment.sandbox
          : OAuthClient.environment.production;

      oauthClient
      // .makeApiCall({ url: `${url}/v3/company/${companyID}/invoice` })
      .makeApiCall({ url: `${url}v3/company/${companyID}/customer/1` })
        .then(function (authResponse) {
          console.log(`The response invoice for API call is :${JSON.stringify(authResponse)}`);
          res.send(JSON.parse(authResponse.text()));
        })
        .catch(function (e) {
          console.error(e);
        });

      // oauthClient
      //   .makeApiCall({
      //     url: `${url}/v3/company/${companyID}/invoice`,
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
         
      //   })
      //   .then(function (response) {
      //     console.log('The API response is  : ' + response);
      //   })
      //   .catch(function (e) {
      //     console.log('The error is ' + JSON.stringify(e));
      //   });

    } catch (error) {
      return console.log(error);
    }
  },


  disconnect: async function (req, res) {
    try {
      console.log('The disconnect called ');
      const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
        state: 'intuit-test',
      });
      res.redirect(authUri);

    } catch (error) {
      return console.log(error);
    }
  }



};

