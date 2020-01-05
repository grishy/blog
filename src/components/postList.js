import React from "react";
import classNames from "classnames/bind";
import { Link } from "gatsby";

import style from "./postList.module.scss";

class PostList extends React.Component {
  render() {
    const posts = this.props.posts;
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
      <main
        className={classNames({
          container: true,
          [style.list]: true
        })}
      >
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          const thumbnail =
            node.frontmatter.thumbnail &&
            node.frontmatter.thumbnail.childImageSharp.fluid.src;

          const thumbnailStyle = {
            backgroundImage: `url(${thumbnail})`
          };
          return (
            <article key={node.fields.slug} className={style.article}>
              <Link
                to={node.fields.slug}
                className={style.thumbnail}
                style={thumbnailStyle}
              ></Link>

              <div className={style.content}>
                <Link to={node.fields.slug}>{title}</Link>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt
                  }}
                />
              </div>
            </article>
          );
        })}
      </main>
    );
  }
}

export default PostList;
