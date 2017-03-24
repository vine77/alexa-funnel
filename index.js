'use strict';
var Alexa = require('alexa-sdk');
var appId = 'amzn1.ask.skill.e56f434b-a8e1-4a55-8a74-a598c5521a31';

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers, guessAttemptHandlers);
  alexa.execute();
};

var newSessionHandlers = {
  'NewSession': function() {
    this.emit(':ask',
      'Welcome to Funnel. Would you like to proceed?',
      'Say yes to start or no to quit.'
    );
  },
  'AMAZON.StopIntent': function() {
    this.emit(':tell', 'Goodbye!');
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', 'Goodbye!');
  },
  'SessionEndedRequest': function () {
    console.log('session ended');
    this.emit(':tell', 'Goodbye!');
  }
};

var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        var message = 'I will think of a number between zero and one hundred, try to guess and I will tell you if it' +
            ' is higher or lower. Do you want to start the game?';
        this.emit(':ask', message, message);
    },
    'AMAZON.YesIntent': function() {
        this.attributes['guessNumber'] = Math.floor(Math.random() * 100);
        this.handler.state = states.GUESSMODE;
        this.emit(':ask', 'Great! ' + 'Try saying a number to start the game.', 'Try saying a number.');
    },
    'AMAZON.NoIntent': function() {
        console.log('NOINTENT');
        this.emit(':tell', 'Ok, see you next time!');
    },
    'AMAZON.StopIntent': function() {
      console.log('STOPINTENT');
      this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.CancelIntent': function() {
      console.log('CANCELINTENT');
      this.emit(':tell', 'Goodbye!');
    },
    'SessionEndedRequest': function () {
        console.log('SESSIONENDEDREQUEST');
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        console.log('UNHANDLED');
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});

var guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },
    'PhraseIntent': function() {
        var guessNum = parseInt(this.event.request.intent.slots.number.value);
        var targetNum = this.attributes['guessNumber'];
        console.log('user guessed: ' + guessNum);
        // ...
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', 'I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
            ' if it is higher or lower.', 'Try saying a number.');
    },
    'AMAZON.StopIntent': function() {
        console.log('STOPINTENT');
      this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.CancelIntent': function() {
        console.log('CANCELINTENT');
    },
    'SessionEndedRequest': function () {
        console.log('SESSIONENDEDREQUEST');
        this.attributes['endedSessionCount'] += 1;
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        console.log('UNHANDLED');
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
    }
});
