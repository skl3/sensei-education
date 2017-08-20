/*
 *
 * Home
 *
 */

import React, { PropTypes } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectHome from './selectors';
import { generateClassroom, searchClassroom } from './actions';
import { Card } from 'antd';

export class Home extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      focus: false,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleFocusBlur = (e) => {
    this.setState({
      focus: e.target === document.activeElement,
    });
  }

  handleSearch = () => {
    if (this.props.onSearchClassroom) {
      this.props.onSearchClassroom(this.state.value);
    }
  }

  render() {
    const InputGroup = Input.Group;
    const classContainerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: '50px',
      paddingBottom: '60px',
    }
    const titleContainerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: '100px',
      paddingBottom: '100px',
      background: 'linear-gradient(160deg, #02CCBA 0%, #AA7ECD 100%)',
      // backgroundColor: '#2BA8C6',
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
    const rowDescriptionStyle = {
      paddingRight: '30px',
      paddingLeft: '30px',
    }

    return (
      <div>
        <Helmet
          title="Home"
          meta={[
            { name: 'description', content: 'Description of Home' },
          ]}
        />
        <div style={titleContainerStyle}>
          <div style={rowDescriptionStyle}>
            <h1 style={{fontFamily: 'Montserrat', fontSize: 40, color: 'white'}}>Welcome to SentiSchool</h1>
            <div style={{paddingTop: '15px'}}>
              <p style={{fontFamily: 'Montserrat', fontSize: 25, color: 'white'}}>
                Using Artificial Intelligence to Improve Student Engagement in Online Courses
              </p>
            </div>
          </div>
        </div>
        <div style={classContainerStyle}>
          <Row>
            <Col span={9} offset={2} style={{ textAlign: 'center', paddingTop: '30px' }}>
              <div style={{paddingBottom: '20px'}}>
                <img src={require('images/student.png')} height="150" />
              </div>
              <h2 style={{fontFamily: 'Montserrat', fontSize: 25}}>Are you a Student?</h2>
              <br />
              <p style={{fontFamily: 'Montserrat', fontSize: 15, textAlign: 'left'}}>
                <b>Get started now!</b> If you have a classroom code, enter it below. Otherwise,
                check out the open courses in the <b>Explore</b> section.
              </p>
              <br />
              <InputGroup>
                <Input
                  placeholder="DHFDA9J"
                  value={this.state.value}
                  onChange={this.handleInputChange}
                  onFocus={this.handleFocusBlur}
                  onBlur={this.handleFocusBlur}
                  onPressEnter={this.handleSearch}
                />
                <div className="ant-input-group-wrap">
                  <Button icon="search" onClick={this.handleSearch} />
                </div>
              </InputGroup>
            </Col>
            <Col span={10} offset={2} style={{ textAlign: 'center', paddingTop: '30px' }}>
              <div style={{paddingBottom: '20px'}}>
                <img src={require('images/teacher.png')} height="150" />
              </div>
              <h2 style={{fontFamily: 'Montserrat', fontSize: 25}}>Are you a Instructor?</h2>
              <br />
              <p style={{fontFamily: 'Montserrat', fontSize: 15, textAlign: 'left'}}>
                <b>Create a classroom</b> to start streaming content to your students. SentiSchool
                will collect data on each student's engagement and summarize it on the
                course home page.
              </p>
              <br />
              <Button type="primary" size="large"
                style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                onClick={() => this.props.onGenerateClassroom()}>
                Create a Classroom!
              </Button>
            </Col>
          </Row>
        </div>
        <hr color="#DCDCDC" />
        <div style={classContainerStyle}>
          <div style={rowDescriptionStyle}>
            <h1 style={{fontFamily: 'Montserrat', fontSize: 20, textAlign: 'center'}}>Deep Learning Courses</h1>
            <div style={{paddingTop: "40px"}}>
              <Row>
                <Col span={6} offset={0}>
                  <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
                    <div style={{display: 'block'}}>
                      <iframe
                        width="100%" src="https://www.youtube.com/embed/PlhFWT7vAEw?list=PLjK8ddCbDMphIMSXn-w1IjyYpHU3DaUYw"
                        frameborder="0" allowfullscreen>
                      </iframe>
                    </div>
                    <div style={{padding: '10px 16px'}}>
                      <h3>Deep Learning Lecture 1: Introduction</h3>
                      <p style={{color: "#999"}}>Introducion to Linear Regression</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <hr color="#DCDCDC" />
        <div style={classContainerStyle}>
          <div style={rowDescriptionStyle}>
            <h1 style={{fontFamily: 'Montserrat', fontSize: 30, textAlign: 'center'}}>How it Works</h1>
            <div style={{paddingTop: '50px'}}>
              <Row>
                <Col span={8} offset={2} style={{ textAlign: 'left', paddingTop: '30px' }}>
                  <div style={{ textAlign: 'left', paddingBottom: '30px' }}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: 20}}>Webcam Stream</h2>
                    <br />
                    <p style={{fontFamily: 'Montserrat', fontSize: 18}}>
                      Students share their webcam stream when viewing educational
                      content.
                    </p>
                  </div>
                  <div style={{ textAlign: 'left', paddingBottom: '30px' }}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: 20}}>Deep Learning Models</h2>
                    <br />
                    <p style={{fontFamily: 'Montserrat', fontSize: 18}}>
                      SentiSchool uses state-of-the-art deep learning models to predict 1 of 7 emotions
                      that are correlated to student engagement.
                    </p>
                  </div>
                  <div style={{ textAlign: 'left', paddingBottom: '30px' }}>
                    <h2 style={{fontFamily: 'Montserrat', fontSize: 20}}>Student Analytics</h2>
                    <br />
                    <p style={{fontFamily: 'Montserrat', fontSize: 18}}>
                      Tracking engagement over time lead to powerful analytics for
                      content creators that can be used for personalized curriculums
                      and better content.
                    </p>
                  </div>
                </Col>
                <Col span={11} offset={2}
                     style={{ textAlign: 'center', paddingTop: '30px', background: 'black', height: 500 }}>
                </Col>
              </Row>
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

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onGenerateClassroom: PropTypes.func,
  onSearchClassroom: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  Home: makeSelectHome(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGenerateClassroom: () => {
      dispatch(generateClassroom());
    },
    onSearchClassroom: (query) => {
      dispatch(searchClassroom(query));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
