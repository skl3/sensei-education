/*
 *
 * WebcamPage
 *
 */

import React, { PropTypes } from 'react';
import { Button } from 'antd'
import Webcam from 'react-webcam';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectWebcamPage from './selectors';
import YouTube from 'react-youtube';

export class WebcamPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      imageTaken: '',
    };

  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture() {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageTaken: imageSrc,
    });
    let secondsPlayed = this.state.player.getCurrentTime();
    console.log(secondsPlayed)
  }

  onReady = (event) => {
    this.setState({
      player: event.target
    })
  }

  render() {
    const containerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: '30px',
      width: '970px',
    };
    return (
      <div>
        <Helmet
          title="WebcamPage"
          meta={[
            { name: 'description', content: 'Description of WebcamPage' },
          ]}
        />
        <div style={containerStyle}>
          <h1>Webcam</h1>
          <YouTube videoId={'F9z_3obVjFs'} onReady={this.onReady} />
          <div>
            <Webcam
              audio={false}
              width={350}
              height={350}
              ref={this.setRef}
              screenshotFormat="image/png"
            />
          </div>
          <Button type="primary" size="large" onClick={this.capture.bind(this)}>Capture photo</Button>
          {
            this.state.imageTaken ?
            (<img src={this.state.imageTaken} />) :
            (<div>Nothing here</div>)
          }
        </div>
      </div>
    );
  }
}

WebcamPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // WebcamPage: makeSelectWebcamPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebcamPage);
