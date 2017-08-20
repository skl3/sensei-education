/*
 *
 * WebcamPage
 *
 */

import React, { PropTypes } from 'react';
import Webcam from 'react-webcam';
import YouTube from 'react-youtube';
import Helmet from 'react-helmet';
import { Button } from 'antd'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { recordVideoImage } from './actions';
import makeSelectWebcamPage from './selectors';

export class WebcamPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      sessionId: '',
    };
  }

  componentDidMount() {
    this.setState({
      code: this.props.params.id,
      sessionId: this.generateUUID(),
    });
  }

  setRef = (webcam) => this.webcam = webcam;

  capture() {
    const { sessionId, player, code } = this.state;
    const imageSrc = this.webcam.getScreenshot();
    const secondsPlayed = player.getCurrentTime();
    this.props.onSendImage(code, imageSrc, secondsPlayed, sessionId);
  }

  onReady = (event) => {
    this.setState({ player: event.target });
    setInterval(function() {
      if (this.state.isPlaying == true) {
        this.capture();
      }
    }.bind(this), 3000);
  }

  onStateChange = (event) => {
    this.setState({ isPlaying: event.data == 1 });
  }

  generateUUID = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
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
          <YouTube
            videoId={'F9z_3obVjFs'}
            onReady={this.onReady}
            onStateChange={this.onStateChange}
          />
          <Webcam
            style={{ display: 'block' }}
            audio={false}
            width={350}
            height={350}
            ref={this.setRef}
            screenshotFormat="image/png"
          />
        </div>
      </div>
    );
  }
}

WebcamPage.propTypes = {
  onSendImage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // WebcamPage: makeSelectWebcamPage(),

});

function mapDispatchToProps(dispatch) {
  return {
    onSendImage: (code, image, secondsPlayed, sessionId) => {
      const data = {
        image: image,
        sessionId: sessionId,
        secondsPlayed: secondsPlayed,
      };
      dispatch(recordVideoImage(code, data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebcamPage);
