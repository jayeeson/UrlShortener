import React from 'react';
import MissionItem from './MissionItem';
import * as config from '../config';
import './css/MissionStatement.css';

const renderList = () =>
  config.missionItemContent.map(missionItem => (
    <MissionItem label={missionItem.label} content={missionItem.content} key={missionItem.label} />
  ));

const MissionStatement = (): JSX.Element => {
  return (
    <div className="mission_statement ui divided list">
      <div className="ui header centered">
        3 reasons why Short Links should be your fave Link Shortener
      </div>
      {renderList()}
    </div>
  );
};

export default MissionStatement;
