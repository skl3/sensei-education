/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
        <div style={{width: "800", textAlign: "center", marginLeft: "auto", marginRight: "auto", padding: "60px 20px"}}>
          <h1 style={{ margin: '0 auto 20px auto', fontSize: '4em' }}>404</h1>
            <h1 style={{fontFamily: 'Montserrat'}}>
                <FormattedMessage {...messages.header} />
            </h1>
            <img src={require('images/teacher.png')} height="250" style={{ display: 'block', margin: '40px auto' }}/>
        </div>
    );
  }
}
