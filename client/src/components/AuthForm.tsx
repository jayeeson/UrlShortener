import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { clearFailedAuthError } from '../store/errors/actions';
import { ErrorsAction, ServerError } from '../store/errors/types';

interface ValidationError {
  username?: string;
  password?: string;
}

const AuthForm = ({
  onSubmit,
  authFailure,
  clearFailedAuthError,
}: {
  onSubmit: (username: string, password: string) => void;
  authFailure: ServerError;
  clearFailedAuthError: () => ErrorsAction;
}): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationError>({});

  useEffect(() => {
    clearFailedAuthError();
  }, [clearFailedAuthError]);

  const validateSubmission = (): ValidationError => {
    let errors: ValidationError = {};
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

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const localErrors = validateSubmission();
    setErrors(localErrors);

    if (!(localErrors.username || localErrors.password)) {
      onSubmit(username, password);
    }
  };

  const renderValidationError = (field: keyof ValidationError) => {
    if (errors[field]?.length) {
      return genericErrorMessage(errors[field] as string);
    }
  };

  const renderSubmissionError = () => {
    if (authFailure.failed) {
      return genericErrorMessage(authFailure.message);
    }
  };

  const genericErrorMessage = (message: string) => {
    return (
      <div className="ui error message">
        <div className="header">
          <div>{message}</div>
        </div>
      </div>
    );
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    stateChangeHandler: (value: React.SetStateAction<any>) => void
  ) => {
    stateChangeHandler(event.target.value);
  };

  return (
    <form className="ui form error" onSubmit={onFormSubmit}>
      {renderSubmissionError()}
      <div className="field">
        <label>Username</label>
        <input type="text" onChange={e => onChange(e, setUsername)} value={username} />
        {renderValidationError('username')}
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" onChange={e => onChange(e, setPassword)} value={password} />
        {renderValidationError('password')}
      </div>
      <button className="ui submit button">Submit</button>
    </form>
  );
};

const mapStateToProps = (state: RootState) => {
  return { authFailure: state.errors.auth };
};

export default connect(mapStateToProps, { clearFailedAuthError })(AuthForm);
