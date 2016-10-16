'use strict';
var learnjs = {};

learnjs.appOnReady = function(){
  window.onhashchange = function(){
    learnjs.showView(window.location.hash);
  };
  learnjs.showView(window.location.hash);
};

learnjs.showView = function(hash){
  var routes = {
    '#problem': learnjs.problemView,
    '': learnjs.landingView
  };

  var hashParts = hash.split('-');
  var viewFn = routes[hashParts[0]];
  if (viewFn) {
    learnjs.triggerEvent('removingView', []);
    $('.view-container').empty().append(viewFn(hashParts[1]));
  }
};

learnjs.landingView = function(){
  return learnjs.template('landing-view');
};

learnjs.problemView = function(data){
  var problemNumber = parseInt(data, 10);
  var view = $('.templates .problem-view').clone();
  var problemData = learnjs.problems[problemNumber - 1];
  var resultFlash = view.find('.result');

  function checkAnswerClick() {
    if(checkAnswer()) {
      learnjs.flashElement(resultFlash, learnjs.buildCorrectFlash(problemNumber));
    } else {
      learnjs.flashElement(resultFlash, 'Incorrect!');
      var skipButton = learnjs.template('skip-btn');
      skipButton.find('a').attr('href', learnjs.nextProblemLink(problemNumber));
      $('.nav-list').append(skipButton);
      view.bind('removingView', function(){
        skipButton.remove();
      });
    }
    return false;
  }

  function checkAnswer() {
    var answer = view.find('.answer').val();
    var test = problemData.code.replace('__', answer) + '; problem();';
    return eval(test);
  }

  view.find('.check-btn').click(checkAnswerClick);
  view.find('.title').text('Problem #' + problemNumber);
  learnjs.applyObject(problemData, view)
  return view;
};

learnjs.buildCorrectFlash = function(problemNumber) {
  var correctFlash = learnjs.template('correct-flash');
  var link = correctFlash.find('a');
  link.attr('href', learnjs.nextProblemLink(problemNumber));
  if(!learnjs.nextProblemExists(problemNumber)) {
    link.text("You're Finished!")
  }
  return correctFlash;
}

learnjs.nextProblemLink = function(problemNumber) {
  if(learnjs.nextProblemExists(problemNumber)) {
    return '#problem-' + (problemNumber+1);
  } else {
    return '';
  }
}

learnjs.nextProblemExists = function(problemNumber){
  return learnjs.problems.length > problemNumber;
}

learnjs.flashElement = function(elem, content){
  elem.fadeOut('fast', function(){
    elem.html(content);
    elem.fadeIn();
  });
};

learnjs.template = function(name) {
  return $('.templates .' + name).clone();
}

learnjs.triggerEvent = function(name, args) {
  $('.view-container>*').trigger(name, args);
}

learnjs.applyObject = function(obj, elem){
  for(var key in obj){
    elem.find('[data-name="' + key + '"]').text(obj[key]);
  }
};

learnjs.problems = [
  {
    description: 'What is thruth?',
    code: 'function problem() { return __; }'
  },
  {
    description: 'Simple Math?',
    code: 'function problem() { return 42 === 6 * __; }'
  }
]
