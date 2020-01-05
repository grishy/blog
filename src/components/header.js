import React from "react";
import classNames from "classnames/bind";
import { Link } from "gatsby";
import { Motion, spring, presets } from "react-motion";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import style from "./header.module.scss";

class HamburgerButton extends React.Component {
  render() {
    return (
      <svg
        viewBox="0 0 96 96"
        className={classNames({
          [style.navigationToggle]: true,
          [style.navigationToggle__open]: this.props.toggle
        })}
        onClick={this.props.onClick}
      >
        <Motion
          style={{
            x: spring(this.props.toggle ? 1 : 0, presets.wobbly),
            y: spring(this.props.toggle ? 0 : 1, presets.wobbly)
          }}
        >
          {({ x, y }) => (
            <g strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
              <line
                transform={`translate(${x * 12}, ${x * -7}) rotate(${x *
                  45}, 7, 26)`}
                x1="7"
                y1="26"
                x2="89"
                y2="26"
              />
              <line
                transform={`translate(${x * 12}, ${x * 7}) rotate(${x *
                  -45}, 7, 70)`}
                x1="7"
                y1="70"
                x2="89"
                y2="70"
              />
              <line
                transform={`translate(${x * -96})`}
                opacity={y}
                x1="7"
                y1="48"
                x2="89"
                y2="48"
              />
            </g>
          )}
        </Motion>
      </svg>
    );
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elems: [
        {
          to: "/",
          title: "Главная"
        },
        {
          to: "/treasures",
          title: "Сокровища"
        },
        {
          to: "/about",
          title: "Обо мне"
        },
        {
          to: "/archive",
          title: "Архив"
        }
      ],
      toggle: false
    };
  }

  handleClick() {
    this.setState({ toggle: !this.state.toggle });
  }

  render() {
    const listItems = this.state.elems.map(el => (
      <li key={el.to}>
        <Link title={el.title} to={el.to}>
          {el.title}
        </Link>
      </li>
    ));

    return (
      <header
        className={classNames({
          container: true,
          [style.header]: true,
          [style.while]: this.props.white
        })}
      >
        <Link to="/" className={style.title}>
          Grishy
        </Link>

        <ul
          className={classNames({
            [style.navigation]: true,
            [style.navigation__open]: this.state.toggle
          })}
        >
          {listItems}
        </ul>

        <HamburgerButton
          toggle={this.state.toggle}
          onClick={this.handleClick.bind(this)}
        />

        {this.state.toggle && <RemoveScrollBar />}
      </header>
    );
  }
}

export default Header;
