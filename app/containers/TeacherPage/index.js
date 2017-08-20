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

    const modelData = {
     "sad": [{ time: 1, "percent level": 10}, { time: 2, "percent level": 15}],
     "happy": [{ time: 1, "percent level": 10}, { time: 2, "percent level": 15}],
     "confused": [{ time: 1, "percent level": 10}, { time: 2, "percent level": 15}],
     "angry": [{ time: 1, "percent level": 10}, { time: 2, "percent level": 15}],
     "disgusted": [{ time: 1, "percent level": 10}, { time: 2, "percent level": 15}]
   }

   const data = [
     [
       { time: 1, "percent level": 10.35 },
       { time: 2, "percent level": 13.71 },
       { time: 3, "percent level": 25.7 },
       { time: 4, "percent level": 67.45 },
       { time: 5, "percent level": 96.96 }
     ],
     [
       { time: 1, "percent level": 13.35 },
       { time: 2, "percent level": 17.71 },
       { time: 3, "percent level": 35.7 },
       { time: 4, "percent level": 57.45 },
       { time: 5, "percent level": 78.96 }
     ]
   ];

   const lineCharts = data.map((item, i) => {
     return (
       <div className='line-chart-wrapper' key={`${i}-item`}>
         <LineChart width={700} height={400} data={item} syncId="test">
           <CartesianGrid stroke='#f5f5f5' fill="#e6e6e6" />
           <XAxis type="number" dataKey="time" height={40} label='Time'>
           </XAxis>
           <YAxis type="number" domain={[0, 100]}>
             <Label value="Percent Level" angle={270} />
           </YAxis>
           <Tooltip />
           <Line
             key="Percent Level"
             type="monotone"
             dataKey="percent level"
             stroke="#ff7300"
             strokeOpacity={"0.9"}
             strokeDasharray="3 3"
           >
           </Line>
         </LineChart>
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
