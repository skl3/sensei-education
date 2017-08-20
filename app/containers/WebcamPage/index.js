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
      isPlaying: false,
      sessionId: '',
    };
    this.sendData = this.sendData.bind(this);

  }

  componentDidMount() {
    this.generateUUID.bind(this);
    let uuid = this.generateUUID();
    this.setState({
      sessionId: uuid
    });
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture() {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageTaken: imageSrc,
    });
    const secondsPlayed = this.state.player.getCurrentTime();
    this.sendData(imageSrc, secondsPlayed)
  }

  sendData(image, secondsPlayed) {
    let data = {
      'secondsPlayed': secondsPlayed,
      'image': image,
      'sessionId': this.state.sessionId
    }
    console.log(data);
  }

  onReady = (event) => {
    this.setState({
      player: event.target
    })
    setInterval(function() {
      if (this.state.isPlaying == true) {
        this.capture()
      }
    }.bind(this), 3000);
  }

  onStateChange = (event) => {
    let isPlaying;
    if (event.data == 1) {
      isPlaying = true
    } else {
      isPlaying = false
    }
    this.setState({
      isPlaying: isPlaying
    })
  }

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

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
          <YouTube videoId={'F9z_3obVjFs'} onReady={this.onReady} onStateChange={this.onStateChange}/>
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
