import React from 'react';
import './App.css';
import Recorder from "./components/Recorder/Recorder";
import Calendar from "./components/Calendar/Calendar";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                header
            </header>
            <main>
                <Recorder />
                <Calendar />
            </main>
            <footer className="App-header">
                footer
            </footer>
        </div>
    );
}

export default App;
