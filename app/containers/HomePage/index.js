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

export class Home extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      codeInput: '',
      focus: false,
    };
  }

  handleInputChange(e) {
    this.setState({
      codeInput: e.target.value,
    });
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  }

  handleSearch() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.value);
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
      paddingBottom: '50px',
    }
    const titleContainerStyle = {
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: '100px',
      paddingBottom: '100px',
      backgroundColor: '#2BA8C6',
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
          <Row>
            <div style={rowDescriptionStyle}>
              <h1 style={{fontFamily: 'Montserrat', fontSize: 40, color: 'white'}}>Welcome to SentiSchool</h1>
              <div style={{paddingTop: '15px'}}>
                <p style={{fontFamily: 'Montserrat', fontSize: 25, color: 'white'}}>
                  Using Artificial Intelligence to Improve Student Engagement in Online Courses
                </p>
              </div>
            </div>
          </Row>
        </div>
        <hr />
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
              <Button type="primary" size="large" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
                Create a Classroom!
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  Home: makeSelectHome(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
