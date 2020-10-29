import React from 'react';
import { connect } from 'react-redux';
import AuthForm from './AuthForm';
import { register } from '../store/auth/actions';

const Register = ({
  register,
}: {
  register: (username: string, password: string) => Promise<void>;
}): JSX.Element => {
  const onFormSubmit = (username: string, password: string) => {
    register(username, password);
  };

  return (
    <div>
      <AuthForm onSubmit={onFormSubmit} />
    </div>
  );
};

export default connect(null, { register })(Register);
