import React from "react"
import { Link } from "gatsby"
import style from "./menu.module.scss"

const Bars = () => {
  return (
    <svg viewBox="0 0 24 28">
      <path d="M24 21v2c0 .5-.5 1-1 1H1c-.5 0-1-.5-1-1v-2c0-.5.5-1 1-1h22c.5 0 1 .5 1 1zm0-8v2c0 .5-.5 1-1 1H1c-.5 0-1-.5-1-1v-2c0-.5.5-1 1-1h22c.5 0 1 .5 1 1zm0-8v2c0 .5-.5 1-1 1H1c-.5 0-1-.5-1-1V5c0-.5.5-1 1-1h22c.5 0 1 .5 1 1z"></path>
    </svg>
  )
}
const Close = () => {
  return (
    <svg viewBox="0 0 24 28">
      <path d="M20.3 20.7c0 0.4-0.2 0.8-0.4 1.1l-2.1 2.1c-0.3 0.3-0.7 0.4-1.1 0.4s-0.8-0.2-1.1-0.4l-4.6-4.6-4.6 4.6c-0.3 0.3-0.7 0.4-1.1 0.4s-0.8-0.2-1.1-0.4l-2.1-2.1c-0.3-0.3-0.4-0.7-0.4-1.1s0.2-0.8 0.4-1.1l4.6-4.6-4.6-4.6c-0.3-0.3-0.4-0.7-0.4-1.1s0.2-0.8 0.4-1.1l2.1-2.1c0.3-0.3 0.7-0.4 1.1-0.4s0.8 0.2 1.1 0.4l4.6 4.6 4.6-4.6c0.3-0.3 0.7-0.4 1.1-0.4s0.8 0.2 1.1 0.4l2.1 2.1c0.3 0.3 0.4 0.7 0.4 1.1s-0.2 0.8-0.4 1.1l-4.6 4.6 4.6 4.6c0.3 0.3 0.4 0.7 0.4 1.1z"></path>
    </svg>
  )
}

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: false,
    }
  }

  handlePlayerClick = () => {
    if (!this.state.playing) {
      this.setState({ playing: true })
    } else {
      this.setState({ playing: false })
    }
  }

  render() {
    return (
      <div className="player" onClick={this.handlePlayerClick}>
        {this.state.playing ? <Bars /> : <Close />}
      </div>
    )
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      elems: [
        {
          to: "/",
          title: "Главная",
        },
        {
          to: "/treasures",
          title: "Сокровища",
        },
        {
          to: "/about",
          title: "Обо мне",
        },
        {
          to: "/archive",
          title: "Архив",
        },
      ],
    }
  }

  render() {
    const listItems = this.state.elems.map(el => (
      <li>
        <Link title={el.title} to={el.to}>
          {el.title}
        </Link>
      </li>
    ))

    return (
      <header className={style.header}>
        <Link to="/" className={style.header_title}>
          Grishy
        </Link>

        <ul className={style.header_navigation}>{listItems}</ul>

        <Player />
      </header>
    )
  }
}

export default Menu
