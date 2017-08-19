/**
*
* Header
*
*/

import React from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
// import styled from 'styled-components';
const { SubMenu, ItemGroup, Item } = Menu;

export class Header extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    const linkStyle = { width: '110px', textAlign: 'center', float: 'right' };
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        theme="dark"
        style={{ padding: '0 15px' }}
      >
        <span style={{ float: 'left', fontSize: '20px', marginRight: '20px' }}>
          <span style={{ color: '#3F93EB' }}>senti</span>
          <span>school</span>
        </span>

        <Item key="teacher" style={linkStyle}>
          <Link to="/teacher">Teacher</Link>
        </Item>

        <Item key="camera" style={linkStyle}>
          <Link to="/webcam">Class</Link>
        </Item>

        <Item key="home" style={linkStyle}>
          <Link to="/" style={{ display: 'inline !important' }}>Home</Link>
        </Item>
      </Menu>
    );
  }
}

Header.propTypes = {

};

export default Header;
