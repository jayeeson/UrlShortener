import React, { useState } from 'react';
import loadBalancer from '../apis/loadBalancer';
import { CreatedLink } from '../types';
import './css/CreateLink.css';

const CreateLink = ({
  links,
  setLinks,
}: {
  links: CreatedLink[];
  setLinks: (links: CreatedLink[]) => void;
}): JSX.Element => {
  const [linkTerm, setLinkTerm] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitting');
    if (linkTerm) {
      try {
        const { data } = await loadBalancer.post('/new', {
          url: linkTerm,
        });

        const newLink: CreatedLink = { short_link: data, long_link: linkTerm };
        const linksWithNewLink = [...links, newLink];
        setLinks(linksWithNewLink);
        setLinkTerm('');

        console.log(data);
      } catch (err) {
        console.log(err);
      }
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

export default CreateLink;
