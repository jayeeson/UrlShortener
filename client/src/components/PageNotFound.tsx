import React from 'react';
import Display from './Display';

const PageNotFound = (): JSX.Element => {
  return (
    <div>
      <div className="ui error message">
        <div className="header">
          <div>Page Not Found</div>
        </div>
      </div>
      <Display />
    </div>
  );
};
export default PageNotFound;
