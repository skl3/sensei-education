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
import { Row, Col } from 'antd';

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
      // marginRight: 'auto',
      // marginLeft: 'auto',
      width: '100%',
    };
    const youtubeStyle = {
      background: 'black',
      textAlign: 'center',
    }

    const footerContainerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: '30px',
      paddingBottom: '30px',
      textAlign: 'center',
    }

    return (
      <div>
        <Helmet
          title="WebcamPage"
          meta={[
            { name: 'description', content: 'Description of WebcamPage' },
          ]}
        />
        <div style={containerStyle}>
          <div style={{width: '100%', marginLeft: 'auto',
                       marginRight: 'auto', paddingLeft: '30px',
                       paddingRight: '30px', paddingTop: '20px'}}>
            <div>
              <p style={{fontSize: '15px'}}>
                <b>Disclaimer:</b> SentiSchool will use data from your webcam to estimate
                engagement. This data will only be shared with the content creater in an effort
                to make content more personalized and more relevant to you. Your data will not be
                used in any other way. To <b>opt-out</b>, block camera access via the browser.
              </p>
              <Row>
                <Col span={5} offset={0}>
                  <Webcam
                    style={{ display: 'block' }}
                    audio={false}
                    width={200}
                    height={200}
                    ref={this.setRef}
                    screenshotFormat="image/png"
                  />
                </Col>
                <Col span={8} offset={0} style={{paddingTop: '30px'}}>
                </Col>
              </Row>
            </div>
          </div>
          <div style={youtubeStyle}>
            <YouTube
              videoId={'F9z_3obVjFs'}
              onReady={this.onReady}
              onStateChange={this.onStateChange}
              opts={{width: '800', height: '500'}}
              width={800}
            />
          </div>
          <div>
            <div style={{textAlign: 'left', background: 'white',
                         marginTop: '50px', marginBottom: '50px',
                         width: '800', marginLeft: 'auto',
                         marginRight: 'auto', paddingLeft: '30px',
                         paddingRight: '30px', paddingTop: '20px',
                         paddingBottom: '20px', border: '2px solid #DCDCDC'}}>
              <h2>How Hedge Funds Make Money</h2>
              <br />
              <p style={{fontSize: '15px'}}>Foobar description</p>
            </div>
          </div>
        </div>
        <hr color="#DCDCDC" />
        <div style={footerContainerStyle}>
          <h2 style={{color: "grey", fontSize: "15px"}}>SentiSchool. Copyright © 2017. All Rights Reserved.</h2>
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
        encodedImage: image.replace("data:image/png;base64,", ""),
        sessionId: sessionId,
        secondsPlayed: secondsPlayed,
      };
      dispatch(recordVideoImage(code, data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebcamPage);
