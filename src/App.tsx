import React from 'react';
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
