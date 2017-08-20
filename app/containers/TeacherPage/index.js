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

  render() {
    const InputGroup = Input.Group;
    const { classroom, sessions } = this.props;
    const containerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: '30px',
      width: '970px',
    };

    // const testData = [
    //   {
    //     sad: .9,
    //     happy: .05,
    //     neutral: 0,
    //     ...
    //     sessionId: 123,
    //     videoTs: 0,
    //   },
    //   {
    //     sad: .9,
    //     happy: .05,
    //     neutral: 0,
    //     ...
    //     sessionId: 123,
    //     videoTs: 5,
    //   },
    // ]

    // const modelData = [
    //   {
    //     "sad": [{ time: 1, "percent level": 10}, { time: 4, "percent level": 16}],
    //     "happy": [{ time: 1, "percent level": 1}, { time: 4, "percent level": 2}],
    //     "confused": [{ time: 1, "percent level": 20}, { time: 4, "percent level": 25}],
    //     "angry": [{ time: 1, "percent level": 25}, { time: 4, "percent level": 33}],
    //     "disgusted": [{ time: 1, "percent level": 30}, { time: 4, "percent level": 40}]
    //   },
    //   {
    //     "sad": [{ time: 1, "percent level": 23}, { time: 2, "percent level": 11}],
    //     "happy": [{ time: 1, "percent level": 43}, { time: 2, "percent level": 90}],
    //     "confused": [{ time: 1, "percent level": 64}, { time: 2, "percent level": 76}],
    //     "angry": [{ time: 1, "percent level": 11}, { time: 2, "percent level": 15}],
    //     "disgusted": [{ time: 1, "percent level": 20}, { time: 2, "percent level": 55}]
    //   }
    // ];


    const modelData = [
      [{
        "time": 1,
        "sad": 23,
        "happy": 53,
        "confused": 24,
        "angry": 19,
        "disgusted": 5
      },
      {
        "time": 4,
        "sad": 18,
        "happy": 89,
        "confused": 20,
        "angry": 11,
        "disgusted": 3
      }],
      [{
        "time": 1,
        "sad": 89,
        "happy": 47,
        "confused": 46,
        "angry": 7,
        "disgusted": 12
      },
      {
        "time": 4,
        "sad": 56,
        "happy": 23,
        "confused": 50,
        "angry": 9,
        "disgusted": 16
      }]
    ];

    const lineCharts = modelData.map((item, i) => {
      return (
        <div className='line-chart-wrapper' key={`${i}-item`}>
          <LineChart width={700} height={400} data={item} syncId="test">
            <CartesianGrid stroke='#f5f5f5' fill="#e6e6e6" />
            <XAxis type="number" dataKey="time" height={40} label="Time" />
            <YAxis type="number" domain={[0, 100]}>
              <Label value="Percent Level" angle={270} />
            </YAxis>
            <Tooltip />
            <Line
              key="sad"
              type="monotone"
              dataKey="sad"
              stroke="#ff7300"
              strokeOpacity="0.9"
              strokeDasharray="3 3" />
            <Line
              key="happy"
              type="monotone"
              dataKey="happy"
              stroke="#ff7300"
              strokeOpacity="0.9"
              strokeDasharray="3 3" />
            <Line
              key="confused"
              type="monotone"
              dataKey="confused"
              stroke="#ff7300"
              strokeOpacity="0.9"
              strokeDasharray="3 3" />
            <Line
              key="angry"
              type="monotone"
              dataKey="angry"
              stroke="#ff7300"
              strokeOpacity="0.9"
              strokeDasharray="3 3" />
            <Line
              key="disgusted"
              type="monotone"
              dataKey="disgusted"
              stroke="#ff7300"
              strokeOpacity="0.9"
              strokeDasharray="3 3" />
          </LineChart>
          <br/>
          <br/>
       </div>
     );
   });

    return (
      <div>
        <Helmet
          title="WebcamPage"
          meta={[
            { name: 'description', content: 'Description of WebcamPage' },
          ]}
        />
        <div style={containerStyle}>
          <h1>Classroom Analytics</h1>
          <div>State: {this.state.id}</div>
          <div>Params: {this.props.params.id}</div>
          <div>Object: {JSON.stringify(this.props.classroom)}</div>
          <br />
          <Row>
            <Col span={8}>
              <div>
                <div>Title</div>
                <Input value={classroom ? classroom.title : ""} onChange={(e) => this.props.onUpdateClassroomValue('title', e.target.value)} />
                <div>Description</div>
                <Input value={classroom ? classroom.description : ""} onChange={(e) => this.props.onUpdateClassroomValue('description', e.target.value)}/>
                <div>Video URL</div>
                <Input value={classroom ? classroom.videoUrl : ""} onChange={(e) => this.props.onUpdateClassroomValue('videoUrl', e.target.value)}/>
                <div>Is Public</div>
                <Checkbox checked={classroom ? classroom.isPublic : false} onChange={(e) => this.props.onUpdateClassroomValue('isPublic', classroom ? !classroom.isPublic : true)}>Checkbox</Checkbox>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Button type="primary" onClick={() => this.props.onUpdateClassroom(classroom)}>Save</Button>
              </div>
            </Col>
            <Col span={8} offset={1}>
              <div>Tags</div>
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
                </InputGroup>) : null }
            </Col>
          </Row>
          <div className='graphs-section'>{lineCharts}</div>
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
