/*
 *
 * TeacherPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';

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
