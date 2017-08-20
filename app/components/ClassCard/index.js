/**
*
* ClassCard
*
*/

import React from 'react';
import { Card } from 'antd';
// import styled from 'styled-components';

const getVideoIdFromUrl = (url) => {
  if (!url) return;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
};

function ClassCard(props) {
  const embedLink = `https://www.youtube.com/embed/${getVideoIdFromUrl(props.url)}?enablejsapi=1`;
  return (
    <a href={`/webcam/${props.classCode}`}>
    <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
      <div style={{display: 'block'}}>
        <iframe
          width="100%" src={embedLink}
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
