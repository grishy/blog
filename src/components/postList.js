import React from "react"
// import classNames from "classnames/bind"
import { Link } from "gatsby"

import style from "./postList.module.scss"

class PostList extends React.Component {
  render() {
    const posts = this.props.posts
    // const node = this.props.node
    // const title = node.frontmatter.title || node.fields.slug

    // <div>
    //   <h3 style={{}}>
    //     <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
    //       {title}
    //     </Link>
    //   </h3>
    //   <small>{node.frontmatter.date}</small>
    //   <p
    //     dangerouslySetInnerHTML={{
    //       __html: node.frontmatter.description || node.excerpt,
    //     }}
    //   />
    // </div>

    return (
      <main className={style.list}>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          const thumbnail =
            node.frontmatter.thumbnail &&
            node.frontmatter.thumbnail.childImageSharp.fluid.src

          const thumbnailStyle = {
            backgroundImage: `url(${thumbnail})`,
          }
          return (
            <article key={node.fields.slug} className={style.article}>
              <Link
                to={node.fields.slug}
                className={style.thumbnail}
                style={thumbnailStyle}
              ></Link>

              <div className={style.content}>
                <h3>{title}</h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </div>
            </article>
          )
        })}
      </main>
    )
  }
}

export default PostList
