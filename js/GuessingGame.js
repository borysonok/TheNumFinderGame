var Game = function() {
  this.playersGuess = null;
  this.winningNumber = generateWinningNumber();
  this.pastGuesses = [];
};

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function newGame() {
  return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(guess) {
  if (typeof guess !== 'number' || guess < 1 || guess > 100) {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = guess;
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $('#hint, #submit').prop('disabled', true);
    $('#subtitle').text('Press the Reset button to play again!');
    return 'You Win!';
  } else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(
      this.playersGuess
    );
    if (this.pastGuesses.length === 5) {
      $('#hint, #submit').prop('disabled', true);
      $('#subtitle').text('Press the Reset button to play again!');
      return 'You Lose.';
    } else {
      var diff = this.difference();
      if (this.isLower()) {
        $('#subtitle').text('Guess Higher!');
      } else {
        $('#subtitle').text('Guess Lower!');
      }
      if (diff < 5) return 'Almost there!';
      else if (diff < 10) return "You're burning up!";
      else if (diff < 25) return "You're lukewarm.";
      else if (diff < 50) return "You're a bit chilly.";
      else return "You're ice cold!";
    }
  }
};

Game.prototype.provideHint = function() {
  var hintArray = [
    this.winningNumber,
    generateWinningNumber(),
    generateWinningNumber(),
  ];
  return shuffle(hintArray);
};

function shuffle(arr) {
  //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
  for (var i = arr.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
}

//jQuerry:

//=============================================================================

function makeAGuess(game) {
  let guess = +$('#player-input').val();
  $('#player-input').val('');
  let output = game.playersGuessSubmission(guess);
  $('#title').text(output);
}

$(document).ready(function(e) {
  let game = newGame();

  $('#submit').click(function(e) {
    makeAGuess(game);
  });

  $('#player-input').keypress(function(e) {
    if (e.which === 13) {
      makeAGuess(game);
    }
  });

  $('#reset').click(function(e) {
    game = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');
    $('#hint, #submit').prop('disabled', false);
  });

  $('#hint').click(function(e) {
    let hints = game.provideHint();
    $('#title').text(hints);
  });
});
