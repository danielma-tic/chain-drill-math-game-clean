import React, { useState, useEffect, useRef } from 'react';

const ChainDrillMathGame = () => {
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState(['', '', '']);
  const [feedback, setFeedback] = useState(['', '', '']);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLeft, setTimeLeft] = useState(60);
  
  // References for input fields
  const inputRefs = [useRef(null), useRef(null), useRef(null)];
  
  // Game data
  const gameSteps = [
    { firstNum: 1, operator: '+', secondNum: 1, expectedResult: 2 },
    { firstNum: 2, operator: '+', secondNum: 4, expectedResult: 6 },
    { firstNum: 6, operator: '+', secondNum: 4, expectedResult: 10 }
  ];
  
  // Handle user input
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
    
    // Clear feedback when user types
    const newFeedback = [...feedback];
    newFeedback[index] = '';
    setFeedback(newFeedback);
  };
  
  // Check user answer
  const checkAnswer = (index) => {
    const userAnswer = parseInt(userAnswers[index]);
    const expectedAnswer = gameSteps[index].expectedResult;
    
    const newFeedback = [...feedback];
    
    if (userAnswer === expectedAnswer) {
      newFeedback[index] = 'correct';
      if (index < gameSteps.length - 1) {
        setCurrentStep(index + 1);
        // Focus next input after a correct answer
        setTimeout(() => {
          if (inputRefs[index + 1]?.current) {
            inputRefs[index + 1].current.focus();
          }
        }, 300);
      } else {
        setGameComplete(true);
      }
    } else {
      newFeedback[index] = 'incorrect';
    }
    
    setFeedback(newFeedback);
  };
  
  // Start new game
  const startGame = () => {
    setGameActive(true);
    setCurrentStep(0);
    setUserAnswers(['', '', '']);
    setFeedback(['', '', '']);
    setGameComplete(false);
    setTimeLeft(60);
    
    // Focus first input
    setTimeout(() => {
      if (inputRefs[0]?.current) {
        inputRefs[0].current.focus();
      }
    }, 100);
  };
  
  // Handle key press
  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      checkAnswer(index);
    }
  };
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && !gameComplete && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, gameComplete]);
  
  return (
    <div className="container">
      {/* Game header */}
      <div className="header">
        <h1 className="title">Chain Drill Math Game</h1>
        <p className="subtitle">
          Solve each equation. The answer becomes the first number in the next equation!
        </p>
      </div>
      
      {/* Game controls */}
      <div className="controls">
        <div className="difficulty-selector">
          <label htmlFor="difficulty">Difficulty:</label>
          <select 
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={gameActive}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={startGame}
        >
          {gameActive ? 'Restart Game' : 'Start Game'}
        </button>
        
        <div className="timer">
          <span className="timer-label">Time:</span>
          <span className={`timer-value ${timeLeft < 10 ? 'timer-low' : ''}`}>
            {timeLeft}s
          </span>
        </div>
      </div>
      
      {/* Game board */}
      <div className="game-board">
        {!gameActive && !gameComplete && (
          <div className="overlay">
            <div className="overlay-content">
              <h2 className="overlay-title">Ready to Play?</h2>
              <button 
                className="btn btn-success"
                onClick={startGame}
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        
        {gameComplete && (
          <div className="overlay completion-overlay">
            <div className="overlay-content">
              <h2 className="completion-title">Great Job!</h2>
              <p className="completion-message">You've completed the chain!</p>
              <button 
                className="btn btn-primary"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      
        {/* Game chain visualization */}
        <div className="chain">
          {/* First equation row */}
          <div className="equation-row">
            <div className="equation">
              <div className="number-box">
                1
              </div>
              <div className="operator-box">
                +
              </div>
              <div className="number-box">
                1
              </div>
              <div className="operator-box">
                =
              </div>
              <div className={`result-box ${feedback[0] === 'correct' ? 'correct-box' : feedback[0] === 'incorrect' ? 'incorrect-box' : ''}`}>
                <input
                  ref={inputRefs[0]}
                  type="text"
                  value={userAnswers[0]}
                  onChange={(e) => handleAnswerChange(0, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 0)}
                  onBlur={() => userAnswers[0] && checkAnswer(0)}
                  className={`answer-input ${currentStep >= 0 ? '' : 'disabled'}`}
                  disabled={currentStep !== 0 || !gameActive || feedback[0] === 'correct'}
                  maxLength={2}
                />
                {feedback[0] === 'correct' && (
                  <div className="check-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arrow to next equation */}
            <div className="arrow"></div>
            <div className="arrow-tip"></div>
          </div>
          
          {/* Second equation row */}
          <div className="equation-row">
            <div className="equation">
              <div className={`number-box ${feedback[0] === 'correct' ? 'correct-box' : ''}`}>
                {feedback[0] === 'correct' ? '2' : '?'}
              </div>
              <div className="operator-box">
                +
              </div>
              <div className="number-box">
                4
              </div>
              <div className="operator-box">
                =
              </div>
              <div className={`result-box ${feedback[1] === 'correct' ? 'correct-box' : feedback[1] === 'incorrect' ? 'incorrect-box' : ''}`}>
                <input
                  ref={inputRefs[1]}
                  type="text"
                  value={userAnswers[1]}
                  onChange={(e) => handleAnswerChange(1, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 1)}
                  onBlur={() => userAnswers[1] && checkAnswer(1)}
                  className={`answer-input ${currentStep >= 1 ? '' : 'disabled'}`}
                  disabled={currentStep !== 1 || !gameActive || feedback[1] === 'correct'}
                  maxLength={2}
                />
                {feedback[1] === 'correct' && (
                  <div className="check-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arrow to next equation */}
            <div className="arrow"></div>
            <div className="arrow-tip"></div>
          </div>
          
          {/* Third equation row */}
          <div className="equation-row">
            <div className="equation">
              <div className={`number-box ${feedback[1] === 'correct' ? 'correct-box' : ''}`}>
                {feedback[1] === 'correct' ? '6' : '?'}
              </div>
              <div className="operator-box">
                +
              </div>
              <div className="number-box">
                4
              </div>
              <div className="operator-box">
                =
              </div>
              <div className={`result-box ${feedback[2] === 'correct' ? 'correct-box' : feedback[2] === 'incorrect' ? 'incorrect-box' : ''}`}>
                <input
                  ref={inputRefs[2]}
                  type="text"
                  value={userAnswers[2]}
                  onChange={(e) => handleAnswerChange(2, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 2)}
                  onBlur={() => userAnswers[2] && checkAnswer(2)}
                  className={`answer-input ${currentStep >= 2 ? '' : 'disabled'}`}
                  disabled={currentStep !== 2 || !gameActive || feedback[2] === 'correct'}
                  maxLength={2}
                />
                {feedback[2] === 'correct' && (
                  <div className="check-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Target indicator */}
        <div className="target-container">
          <div className="target-box">
            <span className="target-label">Target:</span>
            <span className="target-value">10</span>
          </div>
        </div>
      </div>
      
      {/* Game instructions */}
      <div className="instructions">
        <h3 className="instructions-title">How to Play:</h3>
        <ol className="instructions-list">
          <li>Solve each equation and enter the answer</li>
          <li>After a correct answer, it will automatically move to the next equation</li>
          <li>The answer to each step becomes the first number of the next equation</li>
          <li>Complete the chain to reach the target number</li>
        </ol>
      </div>
    </div>
  );
};

export default ChainDrillMathGame;