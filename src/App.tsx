import { useState } from 'react';
import './styles/App.css';
import Navbar from './components/Navbar';
import TaskApp from './components/TaskApp';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="TaskApp">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Tehtävä-äppi</h2>
        <TaskApp />
      </main>
    </div>
  );
}

export default App;