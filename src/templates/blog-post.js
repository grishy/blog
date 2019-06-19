import React from "react"
import { Link, graphql } from "gatsby"
import classNames from "classnames/bind"

import Header from "../components/header"
import Footer from "../components/footer"
import SEO from "../components/seo"
import style from "./blog-post.module.scss"
import "../global.scss"

class Cover extends React.Component {
  render() {
    const tags = ["NODE.JS", "NODE.JS", "NODE.JS"]
    const title = this.props.title

    return (
      <section className={style.cover}>
        <div
          style={{
            backgroundImage: `url(${this.props.coverSrc})`,
          }}
          className={style.coverBackground}
        ></div>
        <div className={style.coverGradient}></div>

        <div
          className={classNames({
            container: true,
            [style.coverContent]: true,
          })}
        >
          <div>
            <a className={style.coverCategory}>Node.js</a>
          </div>
          <h1 className={style.coverTitle}>{title}</h1>
        </div>
      </section>
    )
  }
}

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const coverSrc =
      post.frontmatter.cover && post.frontmatter.cover.childImageSharp.fluid.src

    //  <Layout location={this.props.location} title={siteTitle} whiteHeader={true}>
    //       <SEO
    //         title={post.frontmatter.title}
    //         description={post.frontmatter.description || post.excerpt}
    //       />
    //       <h1>{post.frontmatter.title}</h1>
    //       <p
    //         style={{
    //           display: `block`,
    //         }}
    //       >
    //         {post.frontmatter.date}
    //       </p>
    //       <div dangerouslySetInnerHTML={{ __html: post.html }} />
    //       <hr style={{}} />

    //       <ul
    //         style={{
    //           display: `flex`,
    //           flexWrap: `wrap`,
    //           justifyContent: `space-between`,
    //           listStyle: `none`,
    //           padding: 0,
    //         }}
    //       >
    //         <li>
    //           {previous && (
    //             <Link to={previous.fields.slug} rel="prev">
    //               ← {previous.frontmatter.title}
    //             </Link>
    //           )}
    //         </li>
    //         <li>
    //           {next && (
    //             <Link to={next.fields.slug} rel="next">
    //               {next.frontmatter.title} →
    //             </Link>
    //           )}
    //         </li>
    //       </ul>
    //     </Layout>

    const cover = {
      coverSrc,
      title: post.frontmatter.title,
    }
    return (
      <React.Fragment>
        <SEO
          title={cover.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <Header white={true} />
        <Cover {...cover} />
        <h2>test</h2>
        <Footer />
      </React.Fragment>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        draft
        cover {
          childImageSharp {
            fluid(cropFocus: CENTER, maxWidth: 1920, quality: 90) {
              src
            }
          }
        }
      }
    }
  }
`
