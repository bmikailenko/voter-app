import React from 'react';
import './App.css';
import Landing from './Landing';
import Nav from './Nav';
import About from './About';
import Dashboard from './Dashboard';
import CandidateVerification from './CandidateVerification';
import Survey from './Survey';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Landing}/>
          <Route path="/about" component={About}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/candidate-verification" component={CandidateVerification}/>
          <Route path="/survey" component={Survey}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
