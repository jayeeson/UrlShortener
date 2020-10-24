import React from 'react';
import MissionStatement from './MissionStatement';
import './css/Display.css';
import LinkShortener from './LinkShortener';

const Display = (): JSX.Element => {
  return (
    <div>
      <div className="ui grid">
        <div className="background twelve wide column">
          <div className="backlayer">
            <img
              className="ui centered image"
              src="file-overload-1557051-639x479.jpg"
              alt="file cabinets"
            />
          </div>
        </div>
        <div className="four wide column">
          <MissionStatement />
        </div>
      </div>
      <LinkShortener />
    </div>
  );
};

export default Display;
