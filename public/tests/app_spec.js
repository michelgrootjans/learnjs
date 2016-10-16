describe('LearnJS', function(){
  it('shows the landing page view when there is no hash', function(){
    learnjs.showView('');
    expect($('.view-container .landing-view').length).toEqual(1);
  });
  it('can show a problem view', function(){
    learnjs.showView('#problem-1');
    expect($('.view-container .problem-view').length).toEqual(1);
  });
  it('passes the hash view parameter to the view function', function(){
    spyOn(learnjs, 'problemView');
    learnjs.showView('#problem-42');
    expect(learnjs.problemView).toHaveBeenCalledWith('42');
  });
  it('invokes the router when loaded', function(){
    spyOn(learnjs, 'showView');
    learnjs.appOnReady();
    expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
  });
  it('subscribes to the hash change event', function(){
    learnjs.appOnReady();
    spyOn(learnjs, 'showView');
    $(window).trigger('hashchange')
    expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
  });

  describe('problem view', function(){
    var problem_1, view;
    beforeEach(function(){
      problem_1 = {description: 'What is thruth?', code: 'function problem() { return __; }'};
      learnjs.problems = [problem_1];
      view = learnjs.problemView('1');
    });
    function giveAnswer(answer){
      view.find('.answer').val(answer);
      view.find('.check-btn').click();
    }
    function element(selector){
      return view.find(selector).text();
    }
    it('has a title that includes the problem number', function(){
      expect(element('.title')).toEqual('Problem #1')
    });
    it('renders the problem description', function(){
      expect(element('.description')).toEqual(problem_1.description)
    });
    it('renders the problem code', function(){
      expect(element('.code')).toEqual(problem_1.code)
    });
    it('can check a correct answer by hitting a button', function(){
      giveAnswer('true');
      expect(element('.result')).toEqual('Correct!')
    });
    it('can check an incorrect answer', function(){
      giveAnswer('false');
      expect(element('.result')).toEqual('Incorrect!')
    });
  });
});
