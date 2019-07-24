import React, {Component} from 'react';
import './App.css';
import { HashRouter } from 'react-router-dom'
// import Player from './components/player'
// import Dashboard from './components/dashboard'
import routes from './routes'

class App extends Component {
  
  render() {
    return (
      <HashRouter>
        <div>
          <div>
            {routes}
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
