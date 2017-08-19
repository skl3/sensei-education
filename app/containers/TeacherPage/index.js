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

export class TeacherPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
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
        </div>
      </div>
    );
  }
}

TeacherPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // TeacherPage: makeSelectTeacherPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPage);
