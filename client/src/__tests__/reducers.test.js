import {
  UPDATE_CURRENT_CATEGORY,
  TOGGLE_GAME
  } from '../utils/actions';
  
    import { reducer } from '../utils/reducers'
    
    // create a sample of what our global state will look like
    const initialState = {
        gameOpen: true,
        currentQuestion: 'What is your favorite animal?',
        currentCategory: 'Basic Questions',
        currentQuestionsAndAnswers: [
            {'Question': 'What is your favorite animal?', 'YourAnswer': 'Zebra', 'YourGuess': 'Lion', 'OpponentAnswer': 'Lion', 'OpponentGuess': 'Alpaca', 'YouCorrect': true, 'OpponentCorrect': false},
            {'Question': 'What color are my eyes?', 'YourAnswer': 'Hazel', 'YourGuess': 'Blue', 'OpponentAnswer': '', 'OpponentGuess': 'Alpaca', 'YouCorrect': true, 'OpponentCorrect': false},
            {'Question': 'What is your favorite animal?', 'YourAnswer': 'Zebra', 'YourGuess': 'Lion', 'OpponentAnswer': 'Lion', 'OpponentGuess': 'Alpaca', 'YouCorrect': true, 'OpponentCorrect': false}
        ],
        currentOpponent: {name: 'jimmy', id: 'fhdsjk44hhreo47'},
        yourCurrentScore: 0,
        opponentCurrentScore: 0,
        currentQuestionNumber: 1,
        gameHistory: []
    };
  
    test('UPDATE_CURRENT_CATEGORY', () => {
      let newState = reducer(initialState, {
        type: UPDATE_CURRENT_CATEGORY,
        category: 'Food'
      });
    
      expect(initialState.currentCategory).toBe('Basic Questions');
      expect(newState.currentCategory).toBe('Food');
    });

    test('TOGGLE_GAME', () => {
      let newState = reducer(initialState, {
        type: TOGGLE_GAME
      });
    
      expect(newState.gameOpen).toBe(false);
      expect(initialState.gameOpen).toBe(true);
    
      let newState2 = reducer(newState, {
        type: TOGGLE_GAME
      });
    
      expect(newState2.gameOpen).toBe(true);
    });
  

  

  

  

  
