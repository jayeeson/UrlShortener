import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoggedInContext from '../contexts/LoggedIn';
import { LoggedInStatus } from '../types';

class Auth extends React.Component {
  static contextType = LoggedInContext;
  context!: React.ContextType<typeof LoggedInContext>;

  onLogoutClick = async (): Promise<void> => {
    // logout on AUTH service (to blacklist) OK
    // request deletion of LOGGED IN cookie OK
    try {
      await axios.get('/logout');
      this.context.setStatus(LoggedInStatus.NoToken);
      const { data } = await axios.get('/userlinks');
      ///\todo: update userlinks. need links piece of state.
    } catch (err) {
      console.log('error logging out: OnLogoutClick', err);
    }
  };

  renderButton = (): JSX.Element => {
    if (LoggedInStatus[this.context.status] === LoggedInStatus[LoggedInStatus.LoggedIn]) {
      return (
        <div className="right menu">
          {/*///\todo: fix the link*/}
          <Link className="ui item" style={{ marginLeft: '10px' }} to="/">
            Go to Analytics
          </Link>

          <div
            className="ui button center aligned red"
            style={{
              marginLeft: '10px',
            }}
            onClick={this.onLogoutClick}
          >
            Logout
          </div>
        </div>
      );
    } else {
      return (
        <div className="right menu">
          <label>Please sign in for best experience</label>

          <Link className="ui button" style={{ marginLeft: '10px' }} to="/login">
            Login
          </Link>
        </div>
      );
    }
  };

  render(): JSX.Element {
    return <React.Fragment>{this.renderButton()}</React.Fragment>;
  }
}

export default Auth;
