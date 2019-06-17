import React from "react"
// import classNames from "classnames/bind"
import { Link } from "gatsby"

import style from "./footer.module.scss"

class Footer extends React.Component {
  render() {
    return (
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    )
  }
}

export default Footer
