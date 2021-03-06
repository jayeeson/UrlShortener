import React from 'react';

const Footer = (): JSX.Element => {
  if (window.location.pathname === '/' || window.location.pathname === '/pagenotfound') {
    return (
      <div>
        <br />
        <br />
        Photo by <a href="https://freeimages.com/photographer/brainloc-32259">
          Bob Smith
        </a> from <a href="https://freeimages.com/">FreeImages.com</a>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Footer;
