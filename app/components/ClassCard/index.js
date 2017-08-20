/**
*
* ClassCard
*
*/

import React from 'react';
// import styled from 'styled-components';


function ClassCard(props) {
  return (
    <div style={{width: "250px", minHeight: "350px",
                 backgroundColor: "white", paddingLeft: "10px",
                 paddingRight: "10px", paddingTop: "10px",
                 paddingBottom: "10px", textAlign: "center",
                 border: "1px solid black",}}>
      <div style={{paddingBottom: 15}}>
        <iframe width="225" height="200" src={props.url}
          frameborder="0" allowfullscreen></iframe>
      </div>
      <div style={{paddingBottom: 10}}>
        <h2>{props.title}</h2>
      </div>
      <p>{props.description}</p>
    </div>
  );
}

ClassCard.propTypes = {
  url: String,
  title: String,
  description: String,
};

export default ClassCard;
