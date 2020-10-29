import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addLink } from '../store/link/actions';
import './css/CreateLink.css';

const CreateLink = ({ addLink }: { addLink: (longLink: string) => Promise<void> }): JSX.Element => {
  const [linkTerm, setLinkTerm] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitting');
    if (linkTerm) {
      addLink(linkTerm);
      setLinkTerm('');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkTerm(e.target.value);
  };

  return (
    <div className="ui green segment">
      <form className="ui grid" onSubmit={onSubmit}>
        <div className="twelve wide column">
          <div className="ui transparent input">
            <label>Enter Link</label>
            <input
              type="text"
              placeholder="Long link"
              id="input"
              onChange={onChange}
              value={linkTerm ? linkTerm : ''}
            />
          </div>
        </div>
        <div className="four wide column right aligned">
          <button className="ui floated right primary button"> Submit</button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { addLink })(CreateLink);
