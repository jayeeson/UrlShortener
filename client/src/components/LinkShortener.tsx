import React from 'react';
import axios from 'axios';

import { CreatedLink } from '../types';
import CreateLink from './CreateLink';
import LinkList from './LinkList';

class LinkShortener extends React.Component {
  state: { links: CreatedLink[] } = { links: [] };
  componentDidMount = async (): Promise<void> => {
    const { data } = await axios.get('/userlinks');
    console.log(data);

    this.setState({ links: data });
  };

  setLinks = (links: CreatedLink[]): void => {
    this.setState({ links });
  };

  render(): JSX.Element {
    const { links } = this.state;
    return (
      <div className="ui raised segments">
        <CreateLink links={links} setLinks={this.setLinks} />
        <LinkList links={links} setLinks={this.setLinks} />
      </div>
    );
  }
}

export default LinkShortener;
