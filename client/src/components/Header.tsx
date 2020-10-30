import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ServerError } from '../store/errors/types';
import { RootState } from '../store/reducers';
import Auth from './Auth';

const Header = ({ serverError }: { serverError: ServerError }): JSX.Element => {
  const renderErrors = (): JSX.Element | undefined => {
    if (serverError.failed) {
      return (
        <div className="ui error message">
          <div className="header">
            <div>{serverError.message}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="ui secondary menu header">
        <Link className="active item" to="/">
          Short Links
        </Link>
        <Auth />
      </div>
      {renderErrors()}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return { serverError: state.errors.server };
};

export default connect(mapStateToProps)(Header);
