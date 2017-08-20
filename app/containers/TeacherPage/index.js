/*
 *
 * TeacherPage
 *
 */

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectTeacherPage from './selectors';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend, Label, LabelList, Brush } from 'recharts';
import { Input, Button, Checkbox, Tag, Row, Col, message } from 'antd';
import { updateClassroomValue, updateClassroom, queryClassroom, querySession } from './actions';
import {
  selectUpdatingClassroom, selectLoadingClassroom, selectLoadingSession,
  selectClassroom, selectSessions,
} from './selectors';
import YouTube from 'react-youtube';

const getVideoIdFromUrl = (url) => {
  if (!url) return;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
};

// TODO: check for sessions update every 30 seconds
export class TeacherPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      tagInput: "",
    };
  }

  componentWillMount() {
    this.setState({ id: this.props.params.id });
    this.props.onFetchClassroomAnalytics(this.props.params.id);
  }

  handleCopy = (e, classCode) => {
    const textField = document.createElement('textarea');
    textField.innerText = `${window.location.origin}/webcam/${classCode}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  onClearTagInput() {
    this.setState({ tagInput: "" });
  }

  onUpdateTagInput(value) {
    this.setState({ tagInput: value });
  }

  onUpdateNotification() {
    setTimeout(() => {
      message.success('Classroom information updated!');
    }, 800);
  }

  genLineSettings() {
    return [
      <Line
        key="sad"
        type="monotone"
        dataKey="sad"
        stroke="#FF0000"
        strokeWidth="2"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="happy"
        type="monotone"
        dataKey="happy"
        stroke="#FFA500"
        strokeWidth="2"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="neutral"
        type="monotone"
        dataKey="neutral"
        stroke="#800080"
        strokeWidth="2"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="angry"
        type="monotone"
        dataKey="angry"
        stroke="#008000"
        strokeWidth="2"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
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
        strokeWidth="2"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
    ];
  }

  genAvgLineChart(data) {
    if (!data) return;
    let _avg_data = {};
    let n_data = data.length;
    let _avg_keys = [];
    for (var i = 0; i < n_data; i++) {
      let curdata = data[i];
      let n_timesteps = curdata.length;
      for (var j = 0; j < n_timesteps; j++) {
        if (!(curdata[j]['videoTs'] in _avg_data)) {
          _avg_data[curdata[j]['videoTs']] = {
            "sad": curdata[j]["sad"],
            "happy": curdata[j]["happy"],
            "neutral": curdata[j]["neutral"],
            "angry": curdata[j]["angry"],
            "disgust": curdata[j]["disgust"],
            "fear": curdata[j]["fear"],
            "surprise": curdata[j]["surprise"],
            "num_instances": 1,
          };
        } else {
          let old_data = _avg_data[curdata[j]['videoTs']];
          _avg_data[curdata[j]['videoTs']] = {
            "sad": curdata[j]["sad"] + old_data["sad"],
            "happy": curdata[j]["happy"] + old_data["happy"],
            "neutral": curdata[j]["neutral"] + old_data["neutral"],
            "angry": curdata[j]["angry"] + old_data["angry"],
            "disgust": curdata[j]["disgust"] + old_data["disgust"],
            "fear": curdata[j]["fear"] + old_data["fear"],
            "surprise": curdata[j]["surprise"] + old_data["surprise"],
            "num_instances": old_data["num_instances"] + 1,
          }
        }
        _avg_keys.push(curdata[j]['videoTs']);
      }
    }
    _avg_keys = [...new Set(_avg_keys)];
    _avg_keys = _avg_keys.sort();

    let avg_data = [];
    _avg_keys.forEach(function(i) {
      avg_data.push({
        "videoTs": i,
        "sad": _avg_data[i]["sad"] / _avg_data[i]["num_instances"],
        "happy": _avg_data[i]["happy"] / _avg_data[i]["num_instances"],
        "neutral": _avg_data[i]["neutral"] / _avg_data[i]["num_instances"],
        "angry": _avg_data[i]["angry"] / _avg_data[i]["num_instances"],
        "disgust": _avg_data[i]["disgust"] / _avg_data[i]["num_instances"],
        "fear": _avg_data[i]["fear"] / _avg_data[i]["num_instances"],
        "surprise": _avg_data[i]["surprise"] / _avg_data[i]["num_instances"],
      });
    });

    avg_data = avg_data.sort((a, b) => a.videoTs - b.videoTs);

    return (
      <div className='avg-line-chart-wrapper'
        style={{paddingTop: '20px', paddingBottom: '20px'}}>
        <h2 style={{fontFamily: 'Montserrat'}}>Average Emotion Chart</h2>
        <LineChart width={970} height={500} data={avg_data} syncId="test"
          style={{marginLeft: 'auto', marginRight: 'auto'}}
        >
          <CartesianGrid stroke='#f5f5f5' fill="white" />
          <XAxis type="number" dataKey="videoTs" height={40} label="Time" />
          <YAxis type="number" domain={[0, 1]}>
            <Label value="Emotion Probability" angle={270} />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {this.genLineSettings()}
        </LineChart>
      </div>
    );
  }

  render() {
    const InputGroup = Input.Group;
    const { classroom, sessions } = this.props;
    const filteredSessions = _.values(
      _.pickBy(sessions, (value, key) => value && value.emotions && (value.emotions.length > 2))
    ).map((session) => session.emotions);
    console.log(filteredSessions, 'filteredSessions');

    const containerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: '30px',
      marginBottom: '30px',
      width: '970px',
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

    const lineCharts = filteredSessions.map((item, i) => {
      return (
        <div className='line-chart-wrapper' key={`${i}-item`}
          style={{paddingTop: '20px', paddingBottom: '20px'}}>
          <h2 style={{fontFamily: 'Montserrat'}}>Emotion Chart for Viewer Session {i}:</h2>
          <LineChart width={970} height={250} data={item} syncId="test"
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          >
            <CartesianGrid stroke='#f5f5f5' fill="white" />
            <XAxis type="number" dataKey="videoTs" height={40} label="Time" />
            <YAxis type="number" domain={[0, 1]}>
              <Label value="Emotion Probability" angle={270} />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {this.genLineSettings()}
          </LineChart>
        </div>
      );
    });

    const avgLineChart = this.genAvgLineChart(filteredSessions);

    return (
      <div>
        <Helmet
          title="Analytics | AI for Education"
          meta={[
            { name: 'description', content: 'Description of Analytics Page' },
          ]}
        />
        <div style={containerStyle}>
          <h1 style={{fontFamily: 'Montserrat', fontSize: '30'}}>Classroom Analytics</h1>
          <br />
          <p style={{fontFamily: 'Montserrat', fontSize: '20'}}>
            As the content creator and/or instructor, here you can find a diverse set of
            analytics for your audience as a whole and for each individual student.
          </p>
          <br />
        </div>
        <hr color="#DCDCDC" />
        <div style={containerStyle}>
          <h2 style={{fontFamily: 'Montserrat', fontSize: '25'}}>
            Video Settings
          </h2>
          <br />
          <p style={{fontFamily: 'Montserrat', fontSize: '18'}}>
            Edit video settings i.e. rename, update link, or add tags/description. When saving,
            the changes will immediately be sent to students.
          </p>
          <br />
          <div className="videoSettings" style={{paddingTop: '20px', paddingBottom: '20px'}}>
            <Row>
              <Col span={16}>
                <div>
                  <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: '15'}}>Title</h2>
                    <Input value={classroom ? classroom.title : ""} onChange={(e) => this.props.onUpdateClassroomValue('title', e.target.value)} />
                  </div>
                  <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: '15'}}>Description</h2>
                    <Input
                      type="textarea"
                      value={classroom ? classroom.description : ""}
                      autosize={{ minRows: 2, maxRows: 6 }}
                      onChange={(e) => this.props.onUpdateClassroomValue('description', e.target.value)}
                    />
                  </div>
                  <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: '15'}}>Video URL</h2>
                    <Input value={classroom ? classroom.videoUrl : ""} onChange={(e) => this.props.onUpdateClassroomValue('videoUrl', e.target.value)}/>
                  </div>
                  <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: '15'}}>Is Public</h2>
                    <Checkbox checked={classroom ? classroom.isPublic : false} onChange={(e) => this.props.onUpdateClassroomValue('isPublic', classroom ? !classroom.isPublic : true)}>
                    </Checkbox>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <Button type="primary" onClick={() => {
                    this.props.onUpdateClassroom(classroom);
                    this.onUpdateNotification();
                  }}>Save</Button>
                </div>
              </Col>
              <Col span={7} offset={1}>
                <h2 style={{fontFamily: 'Montserrat', fontSize: '15'}}>Tags</h2>
                { classroom ? classroom.tags.map((tag, i) => (<Tag key={`${i}-tag`}>{tag}</Tag>)) : null }
                { classroom ? (
                  <InputGroup style={{ marginTop: '10px' }}>
                    <Input
                      placeholder="tech, computers, history, finance, etc."
                      value={this.state.tagInput}
                      onChange={(e) => this.onUpdateTagInput(e.target.value)}
                    />
                    <div className="ant-input-group-wrap">
                      <Button
                        icon="plus"
                        onClick={() => {
                          this.props.onUpdateClassroomValue('tags', [...classroom.tags, this.state.tagInput]);
                          this.onClearTagInput();
                        }}
                      />
                    </div>
                  </InputGroup>) : <p style={{ fontFamily: 'Montserrat', fontSize: '12px'}}>No tags found.</p> }
                  <br />
                  <h2 style={{fontFamily: 'Montserrat', fontSize: '15'}}>Share Link</h2>
                  <InputGroup style={{ marginTop: '10px' }}>
                    <Input value={classroom ? `${window.location.origin}/webcam/${classroom.classCode}` : ""} />
                    <div className="ant-input-group-wrap">
                      <Button icon="copy" onClick={(e) => this.handleCopy(e, classroom.classCode)} />
                    </div>
                  </InputGroup>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{
           textAlign: 'left', background: 'white',
           marginTop: '50px', marginBottom: '50px',
           paddingTop: '20px', paddingBottom: '20px',
           border: '2px solid #DCDCDC', width: '970px',
           marginLeft: 'auto', marginRight: 'auto',
           padding: '20px 20px'}}>
              <Row>
                <Col span={6}>
                  { classroom ? (
                    <YouTube
                      videoId={getVideoIdFromUrl(classroom.videoUrl)}
                      opts={{width: '200', height: '200'}}
                      width={200}
                    />
                  ): null }
                </Col>
                <Col span={12}>
                  <div style={{paddingTop: '20px'}}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: '25'}}>
                      Your Video: <u>{ classroom && classroom.title ? classroom.title : "Untitled No. 1" }</u>
                    </h2>
                    <br />
                    <p style={{fontFamily: 'Montserrat', fontSize: '15'}}>
                      { classroom && classroom.description ? classroom.description : "Update me! No description provided." }
                    </p>
                  </div>
                </Col>
              </Row>
        </div>
        <hr color="#DCDCDC" />
        <div className='graphs-section' style={containerStyle}>
          <h2 style={{fontFamily: 'Montserrat', fontSize: '25'}}>
            Video Analytics
          </h2>
          <br />
          <p style={{fontFamily: 'Montserrat', fontSize: '18'}}>
            See how individual and populations of students react to your course over time.
            We provide you probabilities for 7 emotions like happy, digust, neutral etc. as
            the video plays.
          </p>
          <br />
          <p style={{fontFamily: 'Montserrat', fontSize: '18'}}>
            Many of these emotions like anger may be correlated with
            student frustration or disengagement in certain material. We hope that as educators,
            you will find these patterns useful when trying to improve a student's educational
            experience.
          </p>
          <br />
          {avgLineChart}
          {lineCharts}
        </div>
        <hr color="#DCDCDC" />
        <div style={footerContainerStyle}>
          <h2 style={{color: "grey", fontSize: "15px"}}>Sensei. Copyright © 2017. All Rights Reserved.</h2>
        </div>
      </div>
    );
  }
}

TeacherPage.propTypes = {
  classroom: PropTypes.object,
  onUpdateClassroom: PropTypes.func.isRequired,
  onFetchClassroomAnalytics: PropTypes.func.isRequired,
  onFetchSessionAnalytics: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  updatingClassroom: selectUpdatingClassroom(),
  loadingClassroom: selectLoadingClassroom(),
  loadingSession: selectLoadingSession(),
  classroom: selectClassroom(),
  sessions: selectSessions(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateClassroomValue: (field, value) => {
      dispatch(updateClassroomValue(field, value));
    },
    onUpdateClassroom: (classroom) => {
      dispatch(updateClassroom(classroom._id, classroom));
    },
    onFetchClassroomAnalytics: (id) => {
      dispatch(queryClassroom(id));
    },
    onFetchSessionAnalytics: (id) => {
      dispatch(querySession(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPage);
