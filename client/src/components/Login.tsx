import loadBalancer from '../apis/loadBalancer';
import history from '../history';
import React, { useState } from 'react';
import LoggedInContext from '../contexts/LoggedIn';
import { LoggedInStatus } from '../types';

interface LoginError {
  username?: string;
  password?: string;
}

const Login = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginError>({});

  const validateSubmission = (): LoginError => {
    let errors = {};
    if (username === '') {
      errors = { ...errors, username: 'You must enter a username' };
    } else {
      errors = { ...errors, username: undefined };
    }
    if (password === '') {
      errors = { ...errors, password: 'You must enter a password' };
    } else {
      errors = { ...errors, password: undefined };
    }
    return errors;
  };

  const onFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    setStatus: (status: LoggedInStatus) => void
  ) => {
    event.preventDefault();
    const localErrors = validateSubmission();
    setErrors(localErrors);

    if (!(localErrors.username || localErrors.password)) {
      try {
        const response = await loadBalancer.post('/login', {
          username,
          password,
        });

        if (response.data === `Now logged in as ${username}`) {
          setStatus(LoggedInStatus.LoggedIn);
          history.push('/');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const renderError = (field: keyof LoginError) => {
    if (errors[field]) {
      return (
        <div className="ui error message">
          <div className="header">
            <div>{errors[field]}</div>
          </div>
        </div>
      );
    }
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    stateChangeHandler: (value: React.SetStateAction<any>) => void
  ) => {
    stateChangeHandler(event.target.value);
  };

  return (
    <LoggedInContext.Consumer>
      {({ setStatus }) => (
        <form
          className="ui form error"
          onSubmit={e => {
            onFormSubmit(e, setStatus);
          }}
        >
          <div className="field">
            <label>Username</label>
            <input type="text" onChange={e => onChange(e, setUsername)} value={username} />
            {renderError('username')}
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" onChange={e => onChange(e, setPassword)} value={password} />
            {renderError('password')}
          </div>
          <button className="ui submit button">Submit</button>
        </form>
      )}
    </LoggedInContext.Consumer>
  );
};

export default Login;
