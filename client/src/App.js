import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Confirm from './components/profile/Confirm';
import Main from './components/Main';

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/confirmation/">
            <Confirm />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
