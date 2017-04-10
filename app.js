//https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1f85c73e-d39f-4719-bda5-889f4e4afd5f?subscription-key=a755d82f005e4d54bf63a14565213823&timezoneOffset=0.0&verbose=true&q=我要聽周杰倫的安靜
const { API_KEY } = require('./config');
const API_URL = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1f85c73e-d39f-4719-bda5-889f4e4afd5f?subscription-key=${API_KEY}&timezoneOffset=0.0&verbose=true&q='`;
https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1f85c73e-d39f-4719-bda5-889f4e4afd5f?subscription-key=a755d82f005e4d54bf63a14565213823&timezoneOffset=0.0&verbose=true&q=qwer
var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/',
  [function(session)
  {
      session.send("Hi,I am bot ~");
      builder.Prompts.text(session,'What\'s your name ?');
  },
  function(session,result)
  {
    const queryUrl = `${API_URL}${encodeURIComponent(result.response)}`;
    console.warn('queryUrl', queryUrl);
    /*request.get(queryUrl).on('response', (response) => {
      console.warn('response', response.toJSON());
      if (response) {
        session.send('is you? Clay');
      }
    });*/
    request({ uri: queryUrl, encoding: null,}, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      if ( response.statusCode === 200) {
        body = JSON.parse(body);
        console.log('body:', body); // Print the HTML for the Google homepage.*/
        const { intent } = body.topScoringIntent;
        if (intent === 'None') {
          session.send('I don\'t understand');
        } else {
          session.send(intent)
        }
      } else {
        session.send('oops');
      }
     
    });
  }]
);