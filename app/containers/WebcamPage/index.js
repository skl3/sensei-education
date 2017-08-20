/*
 *
 * WebcamPage
 *
 */

import React, { PropTypes } from 'react';
import Webcam from 'react-webcam';
import YouTube from 'react-youtube';
import Helmet from 'react-helmet';
import { Row, Col, Button, Tag } from 'antd'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid,
         Line, Legend, Label, LabelList, Brush } from 'recharts';

import { createSession, queryClassroom, recordVideoImage } from './actions';
import makeSelectWebcamPage, { selectEmotions, selectSession, selectLoadingClassroom, selectClassroom } from './selectors';
import { Menu, Dropdown, Icon } from 'antd';

const generateUUID = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
};

const getVideoIdFromUrl = (url) => {
  if (!url) return;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
};

export class WebcamPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      videoLength: 100,
      sessionId: '',
      webcamBottom: 0,
    };
  }

  componentDidMount() {
    const classCode = this.props.params.id;
    const sessionId = generateUUID();
    this.setState({ code: classCode, sessionId });
    // TODO: query for classroom information
    this.props.onCreateSession(classCode, sessionId);
    this.props.onFetchClassroomInformation(classCode);
    console.log(this.refs.youtube)
    let webcamBottom = this.refs.youtubeObject.offsetTop;
    this.setState({webcamBottom: webcamBottom});
  }

  setRef = (webcam) => this.webcam = webcam;

  capture() {
    const { sessionId, player, code } = this.state;
    this.setState({videoLength: player.getCurrentTime() + 10})
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
    }.bind(this), 4000);
  }

  onStateChange = (event) => {
    this.setState({ isPlaying: event.data == 1 });
  }

  openNotification(emotion) {
    notification.open({
      message: 'Recorded your Emotion!',
      description: 'We\'ve recorded that you are ' + emotion + ' and will use that information to better tune our algorithm.',
    });
  };

  render() {
    const youtubeStyle = {
      background: 'black',
      textAlign: 'center',
    };

    const footerContainerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: '30px',
      paddingBottom: '30px',
      textAlign: 'center',
    };

    const dropMenu = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Angry</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Disgust</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Fear</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Happy</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Sad</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Surprise</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#">Neutral</a>
        </Menu.Item>
      </Menu>
    );

    const { emotions, session, classroom, loadingClassroom } = this.props;

    return (
      <div>
        <Helmet
          title="Classroom | AI for Education"
          meta={[
            { name: 'description', content: 'Description of WebcamPage' },
          ]}
        />
        <div>
          <div style={{
            width: '100%', marginLeft: 'auto',
            marginRight: 'auto', paddingLeft: '30px',
            paddingRight: '30px', paddingTop: '20px',
            paddingBottom: '20px'
          }}>
            <div>
              <p style={{fontSize: '15px'}}>
                <b>Disclaimer:</b> Sensei will use data from your webcam to estimate
                engagement. This data will only be shared with the content creater in an effort
                to make content more personalized and more relevant to you. Your data will not be
                used in any other way. To <b>opt-out</b>, block camera access via the browser.
              </p>
            </div>
          </div>
          <div style={youtubeStyle} ref="youtubeObject">
            <YouTube
              videoId={classroom ? getVideoIdFromUrl(classroom.videoUrl) : ""}
              onReady={this.onReady}
              onStateChange={this.onStateChange}
              opts={{width: '800', height: '550'}}
              width={800}
            />
            <Dropdown overlay={dropMenu}>
                <span className="ant-dropdown-link"
                  style={{color: "black", padding: "10px 10px", background: "#e6e6e6",
                          fontSize: "15px", position: 'fixed', bottom: 240, right: 35}}>
                  <p style={{fontFamily: 'Montserrat'}}>
                    Tell Sensei I'm feeling... <Icon type="down" />
                  </p>
                </span>
            </Dropdown>
            <Webcam
              style={{ position: 'fixed', bottom: 0, right: 0 }}
              audio={false}
              width={240}
              height={180}
              ref={this.setRef}
              screenshotFormat="image/png"
            />
          </div>
          <div>
            <div style={{textAlign: 'left', background: 'white',
                         marginTop: '50px', marginBottom: '50px',
                         width: '800', marginLeft: 'auto',
                         marginRight: 'auto', paddingLeft: '30px',
                         paddingRight: '30px', paddingTop: '20px',
                         paddingBottom: '20px', border: '2px solid #DCDCDC'}}>
              <h2>{classroom ? classroom.title : 'Untitled No.1'}</h2>
              <br />
              <div>{
                (classroom && classroom.tags) ? classroom.tags.map((tag, i) => (<Tag key={`${i}-tag`}>{tag}</Tag>)) : null}</div>
              <br />
              <p style={{fontSize: '15px'}}>{classroom ? classroom.description : 'Lorem Ipsum...'}</p>
            </div>
          </div>
          <div>
            <div style={{textAlign: 'left', background: 'white',
                         marginTop: '50px', marginBottom: '50px',
                         width: '800', marginLeft: 'auto',
                         marginRight: 'auto', paddingLeft: '30px',
                         paddingRight: '30px', paddingTop: '20px',
                         paddingBottom: '20px', border: '2px solid #DCDCDC'}}>
              <h2>Live Emotions Summary</h2>
              <br />
              <p style={{fontSize: '15px'}}>
                Discover your own emotions throughout watching the video. The line
                chart below shows the probability of seven distinct emotions. Each
                emotion will be a number between 0 and 1 where 1 indicates that we are
                very confident that you are expressing that emotion. Your content creator
                would receive a similar graph.
              </p>
              <div className='line-chart-wrapper' key='item' style={{marginTop: '30px'}}>
                <LineChart width={700} height={200} data={emotions} syncId="test">
                  <CartesianGrid stroke='#f5f5f5' fill="white" />
                  <XAxis type="number" domain={[0, this.state.videoLength]} dataKey="videoTs" height={40}>
                    <Label value="Time (Seconds)" />
                  </XAxis>
                  <YAxis type="number" domain={[0, 1]}>
                    <Label value="Emotion Level" angle={270} />
                  </YAxis>
                  <Legend verticalAlign="top" height={36}/>
                  <Tooltip />
                  <Line
                    key="sad"
                    type="monotone"
                    dataKey="sad"
                    stroke="#FF0000"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />
                  <Line
                    key="happy"
                    type="monotone"
                    dataKey="happy"
                    stroke="#FFA500"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />
                  <Line
                    key="neutral"
                    type="monotone"
                    dataKey="neutral"
                    stroke="#800080"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />
                  <Line
                    key="angry"
                    type="monotone"
                    dataKey="angry"
                    stroke="#008000"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />
                  <Line
                    key="disgust"
                    type="monotone"
                    dataKey="disgust"
                    stroke="#0000FF"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />,
                  <Line
                    key="surprise"
                    type="monotone"
                    dataKey="surprise"
                    stroke="#0000FF"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />,
                  <Line
                    key="fear"
                    type="monotone"
                    dataKey="fear"
                    stroke="#0000FF"
                    strokeOpacity="0.9"
                    strokeDasharray="3 3" />,
                </LineChart>
             </div>
            </div>
          </div>
        </div>
        <hr color="#DCDCDC" />
        <div style={footerContainerStyle}>
          <h2 style={{color: "grey", fontSize: "15px"}}>Sensei. Copyright © 2017. All Rights Reserved.</h2>
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
  loadingClassroom: selectLoadingClassroom(),
  classroom: selectClassroom(),
  session: selectSession(),
  emotions: selectEmotions(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateSession: (classCode, sessionId) => {
      dispatch(createSession(classCode, sessionId));
    },
    onFetchClassroomInformation: (classCode) => {
      dispatch(queryClassroom(classCode));
    },
    onSendImage: (code, image, videoTs, sessionId) => {
      const data = {
        encodedImage: image.replace("data:image/png;base64,", ""),
        sessionId,
        videoTs,
      };
      dispatch(recordVideoImage(code, data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebcamPage);
