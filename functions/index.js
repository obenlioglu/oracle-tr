'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

const {Translate} = require('@google-cloud/translate');

const projectId = 'oracle-tr-48404';

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

const axios = require("axios");

const translate = new Translate({
    projectId: projectId,
  });

app.intent('star sign', (conv, {starSign}) => {
    return axios.get('http://horoscope-api.herokuapp.com/horoscope/today/' + starSign)
        .then(response => {
            return translate.translate(response.data.horoscope, 'tr')
                .then(results => {
                    const translation = results[0];
                    conv.close('İşte bugünkü burç yorumun: ' + translation);
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });
        })
        .catch(error => {
            console.log(error);
            conv.close('Şu anda sana cevap veremiyorum.');
        });
});



// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);