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
          title="Home"
          meta={[
            { name: 'description', content: 'Description of Home' },
          ]}
        />
        <div style={containerStyle}>
          <Row>
            <Col span={8} offset={8} style={{ textAlign: 'center' }}>
              <h3>Join a Classroom!</h3>
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
          </Row>
          <br />
          <Row style={{ textAlign: 'center' }}>
            <h2>OR</h2>
            <br />
            <Button
              type="primary"
              size="large"
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              onClick={() => this.props.onGenerateClassroom()}
            >
              Generate a Classroom!
            </Button>
          </Row>
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
