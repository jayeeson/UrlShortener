import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from '../history';
import Header from './Header';
import Display from './Display';
import Footer from './Footer';
import Login from './Login';
import Redirect from '../components/Redirect';
import { CreatedLink } from '../types';
import { connect } from 'react-redux';
import { checkState } from '../store/auth/actions';

interface IProps {
  checkState: () => Promise<void>;
}

class App extends React.Component<IProps> {
  state: { links: CreatedLink[] } = { links: [] };

  componentDidMount() {
    this.props.checkState();
  }

  render(): JSX.Element {
    return (
      <div className="ui container">
        <Router history={history}>
          <Header />
          <Switch>
            <Route path="/" exact component={Display}></Route>
            <Route path="/login" exact component={Login}></Route>
            <Route path="/:id" exact component={Redirect}></Route>
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default connect(null, { checkState })(App);
