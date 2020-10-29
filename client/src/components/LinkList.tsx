import React from 'react';
import { connect } from 'react-redux';
import LinkItem from './LinkItem';
import { deleteLink } from '../store/link/actions';
import { RootState } from '../store/reducers';
import { CreatedLink } from '../types';

interface IProps {
  links: CreatedLink[];
  deleteLink: (shortLink: string) => Promise<void>;
}

class LinkList extends React.Component<IProps> {
  state: { lastCopied: string | null } = { lastCopied: null };

  setLastCopied = (key: string): void => {
    this.setState({ lastCopied: key });
  };

  renderList = (): JSX.Element | JSX.Element[] => {
    //map over links... create JSX LinkListItem for each.
    if (!this.props.links.length) {
      return <></>;
    }

    return this.props.links
      .map(link => {
        return (
          <LinkItem
            link={link}
            key={link.short_link}
            lastCopied={this.state.lastCopied}
            setLastCopied={this.setLastCopied}
            onDeleteLink={() => this.props.deleteLink(link.short_link)}
          />
        );
      })
      .reverse();
  };

  render(): JSX.Element {
    return <>{this.renderList()}</>;
  }
}

const mapStateToProps = (state: RootState) => {
  return { links: Object.values(state.links) };
};

export default connect(mapStateToProps, { deleteLink })(LinkList);
