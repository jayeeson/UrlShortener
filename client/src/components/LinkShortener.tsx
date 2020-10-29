import React from 'react';
import axios from 'axios';

import { CreatedLink } from '../types';
import CreateLink from './CreateLink';
import LinkList from './LinkList';

class LinkShortener extends React.Component {
  componentDidMount = async (): Promise<void> => {
    const { data } = await axios.get('/userlinks');
    console.log(data);

    this.setState({ links: data });
  };

  setLinks = (links: CreatedLink[]): void => {
    this.setState({ links });
  };

  render(): JSX.Element {
    return (
      <div className="ui raised segments">
        <CreateLink />
        <LinkList />
      </div>
    );
  }
}

export default LinkShortener;
