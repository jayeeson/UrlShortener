import axios from 'axios';
import React from 'react';
import LoggedInContext from '../contexts/LoggedIn';
import { LoggedInStatus } from '../types';

enum LoggedInResponses {
  LoggedIn = 'user token',
  GuestSession = 'guest token',
  NoToken = 'no token',
}

class LoggedInStatusCheck extends React.Component {
  static contextType = LoggedInContext;
  context!: React.ContextType<typeof LoggedInContext>;

  componentDidMount = async (): Promise<void> => {
    const { data } = await axios.get('/jwt/status');
    switch (data) {
      case LoggedInResponses.LoggedIn:
        this.context.setStatus(LoggedInStatus.LoggedIn);
        break;
      case LoggedInResponses.GuestSession:
        this.context.setStatus(LoggedInStatus.GuestSession);
        break;
      case LoggedInResponses.NoToken:
        try {
          console.log('requesting guest token');
          await axios.get('/jwt/guest');
          this.context.setStatus(LoggedInStatus.NoToken);
        } catch (err) {
          console.log(err);
        }
        break;
      default:
        console.log('default logged in called..... an error must have occurred');
        break;
    }
  };

  render(): JSX.Element {
    return <></>;
  }
}

export default LoggedInStatusCheck;
