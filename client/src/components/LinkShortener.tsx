import React from 'react';

import { getLinks } from '../store/link/actions';
import CreateLink from './CreateLink';
import LinkList from './LinkList';
import { connect } from 'react-redux';

interface IProps {
  getLinks: () => Promise<void>;
}

class LinkShortener extends React.Component<IProps> {
  componentDidMount = async (): Promise<void> => {
    this.props.getLinks();
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

export default connect(null, { getLinks })(LinkShortener);
