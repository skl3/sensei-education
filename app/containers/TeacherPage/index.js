/*
 *
 * TeacherPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectTeacherPage from './selectors';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend, Label, LabelList, Brush } from 'recharts';
import { Input, Button, Checkbox, Tag, Row, Col } from 'antd';
import { updateClassroomValue, updateClassroom, queryClassroom, querySession } from './actions';
import {
  selectUpdatingClassroom, selectLoadingClassroom, selectLoadingSession,
  selectClassroom, selectSessions,
} from './selectors';
import YouTube from 'react-youtube';

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

  onClearTagInput() {
    this.setState({ tagInput: "" });
  }

  onUpdateTagInput(value) {
    this.setState({ tagInput: value });
  }

  genLineSettings() {
    return [
      <Line
        key="sad"
        type="monotone"
        dataKey="sad"
        stroke="#FF0000"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="happy"
        type="monotone"
        dataKey="happy"
        stroke="#FFA500"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="confused"
        type="monotone"
        dataKey="confused"
        stroke="#800080"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="angry"
        type="monotone"
        dataKey="angry"
        stroke="#008000"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
      <Line
        key="disgusted"
        type="monotone"
        dataKey="disgusted"
        stroke="#0000FF"
        strokeOpacity="0.9"
        strokeDasharray="3 3" />,
    ];
  }

  genAvgLineChart(data) {
    let _avg_data = {};
    let n_data = data.length;
    let _avg_keys = [];
    for (var i = 0; i < n_data; i++) {
      let curdata = data[i];
      let n_timesteps = curdata.length;
      for (var j = 0; j < n_timesteps; j++) {
        if (!(curdata[j]['time'] in _avg_data)) {
          _avg_data[curdata[j]['time']] = {
            "sad": curdata[j]["sad"],
            "happy": curdata[j]["happy"],
            "confused": curdata[j]["confused"],
            "angry": curdata[j]["angry"],
            "disgusted": curdata[j]["disgusted"],
            "num_instances": 1,
          };
        } else {
          let old_data = _avg_data[curdata[j]['time']];
          _avg_data[curdata[j]['time']] = {
            "sad": curdata[j]["sad"] + old_data["sad"],
            "happy": curdata[j]["happy"] + old_data["happy"],
            "confused": curdata[j]["confused"] + old_data["confused"],
            "angry": curdata[j]["angry"] + old_data["angry"],
            "disgusted": curdata[j]["disgusted"] + old_data["disgusted"],
            "num_instances": old_data["num_instances"] + 1,
          }
        }
        _avg_keys.push(curdata[j]['time']);
      }
    }
    console.log(_avg_keys);
    _avg_keys = [...new Set(_avg_keys)];
    _avg_keys = _avg_keys.sort();

    let avg_data = [];
    _avg_keys.forEach(function(i) {
      avg_data.push({
        "time": i,
        "sad": _avg_data[i]["sad"] / _avg_data[i]["num_instances"],
        "happy": _avg_data[i]["happy"] / _avg_data[i]["num_instances"],
        "confused": _avg_data[i]["confused"] / _avg_data[i]["num_instances"],
        "angry": _avg_data[i]["angry"] / _avg_data[i]["num_instances"],
        "disgusted": _avg_data[i]["disgusted"] / _avg_data[i]["num_instances"],
      });
    });

    return (
      <div className='avg-line-chart-wrapper'
        style={{paddingTop: '20px', paddingBottom: '20px'}}>
        <h2 style={{fontFamily: 'Montserrat'}}>Average Emotion Chart</h2>
        <LineChart width={970} height={500} data={avg_data} syncId="test"
          style={{marginLeft: 'auto', marginRight: 'auto'}}
        >
          <CartesianGrid stroke='#f5f5f5' fill="white" />
          <XAxis type="number" dataKey="time" height={40} label="Time" />
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

    const modelData = [
      [{
        "time": 1,
        "sad": .23,
        "happy": .53,
        "confused": .28,
        "angry": .19,
        "disgusted": .05
      },
      {
        "time": 4,
        "sad": .18,
        "happy": .89,
        "confused": .17,
        "angry": .11,
        "disgusted": .03
      }],
      [{
        "time": 1,
        "sad": .89,
        "happy": .47,
        "confused": .46,
        "angry": .07,
        "disgusted": .12
      },
      {
        "time": 4,
        "sad": .56,
        "happy": .23,
        "confused": .50,
        "angry": .09,
        "disgusted": .16
      }]
    ];

    const lineCharts = modelData.map((item, i) => {
      return (
        <div className='line-chart-wrapper' key={`${i}-item`}
          style={{paddingTop: '20px', paddingBottom: '20px'}}>
          <h2 style={{fontFamily: 'Montserrat'}}>Emotion Chart for Viewer Session {i}:</h2>
          <LineChart width={970} height={250} data={item} syncId="test"
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          >
            <CartesianGrid stroke='#f5f5f5' fill="white" />
            <XAxis type="number" dataKey="time" height={40} label="Time" />
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

    const avgLineChart = this.genAvgLineChart(modelData);

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
                    <Input value={classroom ? classroom.description : ""} onChange={(e) => this.props.onUpdateClassroomValue('description', e.target.value)}/>
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
                  <Button type="primary" onClick={() => this.props.onUpdateClassroom(classroom)}>Save</Button>
                </div>
              </Col>
              <Col span={4} offset={1}>
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
              </Col>
            </Row>
          </div>
        </div>
        <div style={{textAlign: 'left', background: 'white',
                         marginTop: '50px', marginBottom: '50px',
                         paddingTop: '20px', paddingBottom: '20px',
                         border: '2px solid #DCDCDC', width: '970px',
                         marginLeft: 'auto', marginRight: 'auto',
                         padding: '20px 20px'}}>
              <Row>
                <Col span={6}>
                  <YouTube
                    videoId={'F9z_3obVjFs'}
                    opts={{width: '200', height: '200'}}
                    width={200}
                  />
                </Col>
                <Col span={12}>
                  <div style={{paddingTop: '20px'}}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: '25'}}>
                      Your Video: <u>{classroom ? classroom.title : "Untitled No. 1"}</u>
                    </h2>
                    <br />
                    <p style={{fontFamily: 'Montserrat', fontSize: '15'}}>
                      {classroom ? classroom.title : "Update me! No description provided."}
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
          <h2 style={{color: "grey", fontSize: "15px"}}>SentiSchool. Copyright © 2017. All Rights Reserved.</h2>
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
