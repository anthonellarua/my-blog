// pages/posts/[slug].js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

const postsDirectory = path.join(process.cwd(), 'posts');

export default function Post({ frontMatter, mdxSource }) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...mdxSource} />
    </div>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(postsDirectory);

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const markdownWithMeta = fs.readFileSync(
    path.join(postsDirectory, `${params.slug}.md`),
    'utf-8'
  );

  const { data: frontMatter, content } = matter(markdownWithMeta);

  const mdxSource = await serialize(content);

  return {
    props: {
      frontMatter,
      mdxSource,
    },
  };
}
