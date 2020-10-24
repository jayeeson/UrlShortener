import axios from 'axios';
import React, { useEffect } from 'react';

const Redirect = (): JSX.Element => {
  useEffect(() => {
    // ask back end if this path exists. if yes => redirect to it
    // if not => redirect to homepage with an error message (ABOVE HEADER)?
    // const getResponse = async () => {
    //   const response = await axios.get(`/link${window.location.pathname}`);
    //   console.log(response);
    //   window.
    // };
    // getResponse();
    window.location.href = 'http://www.google.ca';
  }, []);

  return <></>;
};

export default Redirect;
