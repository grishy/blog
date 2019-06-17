import React from "react"
import Header from "./header"

import "normalize.css/normalize.css"
import "../global.scss"
import style from "./layout.module.scss"

class Layout extends React.Component {
  render() {
    const { children, whiteHeader} = this.props

    return (
      <div className={style.container}>
        <Header white={whiteHeader} />

        {children}

        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )
  }
}

export default Layout
