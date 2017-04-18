var builder = require('botbuilder');
var restify = require('restify');

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

const DATA = {
  '自殺': 'http://aaa',
  '開心': 'http://ccc',
  '哭': 'http://cry',
};
// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1f85c73e-d39f-4719-bda5-889f4e4afd5f?subscription-key=a755d82f005e4d54bf63a14565213823&timezoneOffset=0.0&verbose=true&q=';


var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.matches('點歌', [
  function (session, args, next) {
    var task = builder.EntityRecognizer.findEntity(args.entities, 'TaskTitle');
    if (!task) {
      builder.Prompts.text(session, "What would you like to play the song?");
    } else {
      next({ response: task.entity });//代替user的回應
    }
  },
  function (session, results) {
    if (results.response) {
      // ... save task
      session.send("Ok... play the '%s' song.", results.response);
    } else {
      session.send("Ok");//error handling
    }
  }
]);
intents.matches('心情', [
  function (session, args, next) {
    console.log('111session: %j, args:%j', session,args);

    var task = builder.EntityRecognizer.findEntity(args.entities, 'TaskTitle');
    if (!task) {
      builder.Prompts.text(session, "我能理解你的心情，想聽什麼歌或者我推薦給你?");
    } else {
      next({ response: task.entity });
    }
  },
  function (session, results) {
    console.log('session: %j, result:%j',session,results);
    if (results.response) {
      // ... save task
      let isMatch = false;
      let matchProp = '';
      Object.keys(DATA).forEach((prop)=>{
        if (isMatch) {
          return;
        }
        isMatch = results.response.indexOf(prop) >= 0;
        if ( isMatch ) {
          matchProp = prop;
        }
      })
      
      session.send("Ok... play the '%s' song.", DATA[matchProp]);
    } else {
      session.send("Ok");
    }
  }
]);

intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));