import React from "react"
import { Link } from "gatsby"
import style from "./menu.module.scss"

export default () => (
  <header className={style.header}>
     <Link to="/" className={style.header_title}>Grishy</Link>
  </header>
)

