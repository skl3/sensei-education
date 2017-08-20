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



function Hello() {
  return <div>Hello</div>;
}

import { Input, Button, Row, Col } from 'antd';
import {
  updateClassroomValue, updateClassroom,
  queryClassroom, querySession
} from './actions';
import {
  selectUpdatingClassroom, selectLoadingClassroom, selectLoadingSessions,
  selectClassroom, selectSessions,
} from './selectors';

// TODO: check for sessions update every 30 seconds
export class TeacherPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setState({ id: this.props.params.id });
    this.props.onFetchClassroomAnalytics(this.props.params.id);
  }

  render() {
    const { classroom, sessions } = this.props;
    console.log(classroom, 'classroom');
    if (classroom) {
      const { title, description } = classroom;
    } else {
      const title = "";
      const description = "";
    }
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

    const lineCharts = data.map((item) => {
      return (
        <div className='line-chart-wrapper'>
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
          <h1>Check Analytics</h1>
          <div>State: {this.state.id}</div>
          <div>Params: {this.props.params.id}</div>
          <Row>
            <Col span={8}>
              <div>
                { classroom ? classroom.tags.map(tag => (<div>{tag}</div>)) : null }
                { classroom ? (<Button>Add Tag</Button>) : null }
              </div>
              <div>
                <Button onClick={() => this.props.onUpdateClassroom(classroom)}></Button>
              </div>
            </Col>
          </Row>
          <div className='graphs-section'>
            { lineCharts }
          </div>
        </div>
      </div>
    );
  }
}

TeacherPage.propTypes = {
  classroom: PropTypes.object,
  sessions: PropTypes.array,
  onUpdateClassroom: PropTypes.func.isRequired,
  onFetchClassroomAnalytics: PropTypes.func.isRequired,
  onFetchSessionAnalytics: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  classroom: selectClassroom(),
  sessions: selectSessions(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateClassroomValue: (field, value) => {
      dispatch(updateClassroomValue(field, value));
    },
    onUpdateClassroom: (classroom) => {
      dispatch(updateClassroom(classroom.id, classroom));
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
