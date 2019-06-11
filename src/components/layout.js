import React from "react"
import Menu from "./menu"

import "normalize.css/normalize.css"
import "../global.scss"

class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div>
        <Menu />
        <main>{children}</main>
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
