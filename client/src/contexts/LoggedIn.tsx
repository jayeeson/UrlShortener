import React from 'react';
import { LoggedInStatus } from '../types';

interface IContext {
  status: LoggedInStatus;
  setStatus: (status: LoggedInStatus) => void;
}

const Context = React.createContext<IContext>({
  status: LoggedInStatus.NoToken,
  setStatus: () => {
    return;
  },
});

export class LoggedInStore extends React.Component {
  state = { status: LoggedInStatus.NoToken };

  setStatus = (status: LoggedInStatus): void => {
    this.setState({ status });
  };

  render(): JSX.Element {
    return (
      <Context.Provider value={{ ...this.state, setStatus: this.setStatus }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
