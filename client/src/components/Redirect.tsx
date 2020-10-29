import React, { useEffect } from 'react';
import loadBalancer from '../apis/loadBalancer';
import history from '../history';

const Redirect = (): JSX.Element => {
  useEffect(() => {
    const getResponse = async () => {
      const path = `/link${window.location.pathname}`;
      const { data }: { data: string } = await loadBalancer.get(path);
      console.log(data);
      if (data === `error proxying request to ${path}`) {
        history.push('/pagenotfound');
      } else {
        window.location.href = data;
      }
    };
    getResponse();
  }, []);

  return <div className="ui header">Redirecting...</div>;
};

export default Redirect;
