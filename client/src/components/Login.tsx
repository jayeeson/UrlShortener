import React from 'react';
import { connect } from 'react-redux';
import { login } from '../store/auth/actions';

import AuthForm from './AuthForm';

const Login = ({
  login,
}: {
  login: (username: string, password: string) => Promise<void>;
}): JSX.Element => {
  const onFormSubmit = (username: string, password: string) => {
    login(username, password);
  };

  return <AuthForm onSubmit={onFormSubmit}></AuthForm>;
};

export default connect(null, { login })(Login);
