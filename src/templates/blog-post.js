import React from "react"
import { Link, graphql } from "gatsby"

import SEO from "../components/seo"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const cover =
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

    return (
      // <Layout
      //   location={this.props.location}
      //   title={siteTitle}
      //   whiteHeader={true}
      // >
      //   <img src={cover} />
      //   <section>
      //     <div>
      //       <div>
      //         <a href="https://grishy.ru/categories/node.js/">Node.js</a>
      //       </div>
      //       <h1>{post.frontmatter.title}</h1>
      //     </div>
      //   </section>
      // </Layout>
      <div></div>
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
