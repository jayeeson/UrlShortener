import React from 'react';
import { Link } from 'react-router-dom';
import { LoggedInStatus } from '../store/auth/types';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { logout } from '../store/auth/actions';

interface IProps {
  loginState: LoggedInStatus;
  logout: () => Promise<void>;
}

class Auth extends React.Component<IProps> {
  renderButton = (): JSX.Element => {
    if (LoggedInStatus[this.props.loginState] === LoggedInStatus[LoggedInStatus.LoggedIn]) {
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
            onClick={() => this.props.logout()}
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

const mapStateToProps = (state: RootState) => {
  return { loginState: state.auth.loginState };
};

export default connect(mapStateToProps, { logout })(Auth);
