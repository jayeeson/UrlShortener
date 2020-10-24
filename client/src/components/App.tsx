import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from '../history';
import Header from './Header';
import Display from './Display';
import Footer from './Footer';
import Login from './Login';
import LoggedInStatusCheck from './LoggedInStatusCheck';
import { LoggedInStore } from '../contexts/LoggedIn';
import Redirect from '../components/Redirect';
import { CreatedLink } from '../types';

class App extends React.Component {
  state: { links: CreatedLink[] } = { links: [] };

  render(): JSX.Element {
    return (
      <div className="ui container">
        <Router history={history}>
          <LoggedInStore>
            <LoggedInStatusCheck />
            <Header />
            <Switch>
              <Route path="/" exact component={Display}></Route>
              <Route path="/login" exact component={Login}></Route>
              <Route path="/:id" exact component={Redirect}></Route>
            </Switch>
            <Footer />
          </LoggedInStore>
        </Router>
      </div>
    );
  }
}

export default App;
