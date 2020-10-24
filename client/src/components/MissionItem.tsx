import React from 'react';

const MissionItem = ({ label, content }: { label: string; content: string }): JSX.Element => {
  return (
    <div className="item">
      <i className="check circle icon green centered" />
      <div className="content">
        <div className="header">{label}</div>
        <div className="description">{content}</div>
      </div>
    </div>
  );
};

export default MissionItem;
