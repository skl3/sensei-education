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
    const linkStyle = { width: '110px', textAlign: 'center', float: 'right', fontSize: '14px' };
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        theme="light"
        style={{ padding: '0 15px' }}
      >
        <span style={{ float: 'left', fontSize: '20px', marginRight: '20px' }}>
          <span style={{ color: '#2BA8C6' }}>senti</span>
          <span>school</span>
        </span>

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
