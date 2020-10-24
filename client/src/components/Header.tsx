import React from 'react';
import { Link } from 'react-router-dom';
import Auth from './Auth';

const Header = (): JSX.Element => {
  return (
    <div className="ui secondary menu header">
      <Link className="active item" to="/">
        Short Links
      </Link>
      <Link className="item" to="/">
        About
      </Link>
      <Auth />
    </div>
  );
};

export default Header;
