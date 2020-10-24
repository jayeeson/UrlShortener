import React from 'react';
import { CreatedLink } from '../types';
import LinkItem from './LinkItem';

interface IProps {
  links: CreatedLink[];
  setLinks: (links: CreatedLink[]) => void;
}

class LinkList extends React.Component<IProps> {
  state: { lastCopied: string | null } = { lastCopied: null };

  setLastCopied = (key: string): void => {
    this.setState({ lastCopied: key });
  };

  onDeleteLink = (linkToDelete: CreatedLink): void => {
    const filteredLinks = this.props.links.filter(
      link => link.short_link !== linkToDelete.short_link
    );
    this.props.setLinks(filteredLinks);
  };

  renderList = (): JSX.Element | JSX.Element[] => {
    //map over links... create JSX LinkListItem for each.
    const { links } = this.props;

    if (!links.length) {
      return <></>;
    }

    return links
      .map(link => {
        return (
          <LinkItem
            link={link}
            key={link.short_link}
            lastCopied={this.state.lastCopied}
            setLastCopied={this.setLastCopied}
            onDeleteLink={this.onDeleteLink}
          />
        );
      })
      .reverse();
  };

  render(): JSX.Element {
    return <>{this.renderList()}</>;
  }
}

export default LinkList;
