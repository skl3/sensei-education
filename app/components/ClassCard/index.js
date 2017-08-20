/**
*
* ClassCard
*
*/

import React from 'react';
import { Card } from 'antd';
// import styled from 'styled-components';


function ClassCard(props) {
  return (
    <a href={`/webcam/${props.classCode}`}>
    <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
      <div style={{display: 'block'}}>
        <iframe
          width="100%" src={props.url}
          frameborder="0" allowfullscreen>
        </iframe>
      </div>
      <div style={{padding: '10px 16px'}}>
        <h3>{props.title}</h3>
        <p style={{color: "#999"}}>{props.description}</p>
      </div>
    </Card>
    </a>
  );
}

ClassCard.propTypes = {
};

export default ClassCard;
