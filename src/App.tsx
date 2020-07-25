import React from 'react';
import logo from './logo.svg';
import { Counter } from './components/counter/Counter';
import { PromptEditor } from './components/promptEditor/PromptEditor';
import { TestInputCollection } from './components/testInputCollection/TestInputCollection';
import './App.css';

function App() {
  return (
    <div className="App">
      <PromptEditor/>
      <TestInputCollection/>
    </div>
  );
}

export default App;
