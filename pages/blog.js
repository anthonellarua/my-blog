// pages/blog.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

const postsDirectory = path.join(process.cwd(), 'posts');

export default function Blog({ posts }) {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <h2>{post.frontMatter.title}</h2>
            <MDXRemote {...post.mdxSource} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(postsDirectory);

  const posts = await Promise.all(files.map(async (filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join(postsDirectory, filename),
      'utf-8'
    );

    const { data: frontMatter, content } = matter(markdownWithMeta);

    const mdxSource = await serialize(content, { scope: frontMatter });

    return {
      frontMatter,
      slug: filename.replace('.md', ''),
      mdxSource,
    };
  }));

  return {
    props: {
      posts,
    },
  };
}
