import React from 'react';
import './App.css';
import Nav from './Nav';
import About from './About';
import Dashboard from './Dashboard';
import Survey from './Survey';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/survey" component={Survey}/>
        </Switch>
      </div>
    </Router>
  );
}

const Home = () => (
  <div>
    <h1>Home Page</h1>
  </div>
);

export default App;
