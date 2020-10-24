import axios from 'axios';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CreatedLink } from '../types';
import './css/LinkItem.css';

interface IProps {
  link: CreatedLink;
  onDeleteLink: (link: CreatedLink) => void;
  lastCopied: string | null;
  setLastCopied: (key: string) => void;
}

const LinkItem = ({ link, onDeleteLink, lastCopied, setLastCopied }: IProps): JSX.Element => {
  const onCopyClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLastCopied(link.short_link);
  };

  const onDeleteClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { data } = await axios.delete(`/link/${link.short_link}`);
    console.log(data);

    onDeleteLink(link);
  };

  const hostAndShortLink = `${window.location.protocol}//${window.location.host}/${link.short_link}`;
  return (
    <div className="ui purple segment">
      <form className="ui grid" style={{ alignItems: 'center' }}>
        <div className="eight wide column">
          <label>{link.long_link}</label>
        </div>
        <div
          className="four wide column right aligned shortlink"
          onClick={() => window.open(hostAndShortLink)}
        >
          <label className="shortlink">{hostAndShortLink}</label>
        </div>
        <div className="two wide column right aligned">
          <button className="ui floated right red button" onClick={onDeleteClick}>
            Delete
          </button>
        </div>
        <div className="two wide column right aligned">
          <CopyToClipboard text={hostAndShortLink}>
            <button className="ui floated right transparent button" onClick={onCopyClick}>
              {lastCopied === link.short_link ? 'Copied to clipboard!' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </form>
    </div>
  );
};

export default LinkItem;
