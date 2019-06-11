import React from "react"
import { Link } from "gatsby"

import classNames from "classnames/bind"
import style from "./menu.module.css"


export default () => (
  <header className={classNames("container", style.header)}>
     <Link to="/" className={classNames(style.header_title)}>Grishy</Link>
  </header>
)

