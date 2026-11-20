// The blog stays on TinaCMS (content/blog, edited at /admin); these render it in the revamp's layout.
//   /blog         the revamp's blog page; Tina posts are added as cards cloned from the page's own card
//   /blog/:slug   a Tina post in the revamp's article template (title, meta, cover, rich-text body)
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { client } from '../../tina/__generated__/client';
import { resolveImageSrc } from '../lib/tinaMedia';
import RevampPage from './RevampPage';

const ARTICLE_TEMPLATE = 'blog__choosing-youtube-views';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Cloned nodes keep the entrance-animation start state (opacity 0); show them as they are
function settle(node) {
  [node, ...node.querySelectorAll('[style]')].forEach((el) => {
    if (el.style.opacity === '0') el.style.opacity = '';
    if (el.dataset.motionFrom) el.style.transform = '';
  });
}

function setImage(scope, src, alt) {
  if (!src) return;
  scope.querySelectorAll('img').forEach((img) => {
    img.src = src;
    img.removeAttribute('srcset');
    img.alt = alt || '';
  });
}

function setText(nodes, text) {
  nodes.forEach((el) => { el.textContent = text; });
}

function useTinaPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let mounted = true;
    const blogConnection = client.queries?.blogConnection;
    if (typeof blogConnection !== 'function') return undefined;
    blogConnection({ first: 50 })
      .then((res) => {
        const nodes = (res?.data?.blogConnection?.edges ?? []).map((e) => e?.node).filter(Boolean);
        nodes.sort((a, b) => (b?.date ? new Date(b.date).getTime() : 0) - (a?.date ? new Date(a.date).getTime() : 0));
        if (mounted) setPosts(nodes);
      })
      .catch((err) => console.error('Error fetching blog posts:', err));
    return () => { mounted = false; };
  }, []);
  return posts;
}

const slugOf = (post) => post?._sys?.filename || post?._sys?.relativePath?.replace(/\.mdx?$/, '') || '';

export function RevampBlogList() {
  const posts = useTinaPosts();
  const [root, setRoot] = useState(null);

  useEffect(() => {
    if (!root || !posts.length) return undefined;
    const grid = root.querySelector('[data-framer-name="Content"]:has([data-framer-name="Featured Blog"]) > div:not([data-framer-name="Featured Blog"])');
    const template = grid?.firstElementChild;
    if (!template) return undefined;
    const added = posts.map((post) => {
      const card = template.cloneNode(true);
      settle(card);
      const href = `/blog/${slugOf(post)}`;
      card.querySelectorAll('a').forEach((a) => a.setAttribute('href', href));
      setText(card.querySelectorAll('h3'), post.title || 'Untitled');
      setText(card.querySelectorAll('[data-framer-name="Category"] p'), (Array.isArray(post.tags) && post.tags.find(Boolean)) || 'Blog');
      card.querySelectorAll('p').forEach((p) => { if (/min read/i.test(p.textContent)) p.textContent = formatDate(post.date).toUpperCase(); });
      setImage(card, resolveImageSrc(post.coverImage), post.title);
      card.dataset.tinaPost = '';
      return card;
    });
    // Newest Tina posts first, then the revamp's own guides
    grid.prepend(...added);
    return () => added.forEach((card) => card.remove());
  }, [root, posts]);

  return <RevampPage pageKey="blog" metaSlug="blog" onReady={(el) => { setRoot(el); return () => setRoot(null); }} />;
}

export function RevampBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined);
  const [root, setRoot] = useState(null);
  const [body, setBody] = useState(null);

  useEffect(() => {
    let mounted = true;
    setPost(undefined);
    const blogQuery = client.queries?.blog;
    if (!slug || typeof blogQuery !== 'function') { setPost(null); return undefined; }
    blogQuery({ relativePath: `${slug}.mdx` })
      .then((res) => mounted && setPost(res?.data?.blog ?? null))
      .catch((err) => { console.error('Error fetching blog post:', err); if (mounted) setPost(null); });
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    if (!root || post === undefined) return undefined;
    const title = post ? post.title || 'Untitled' : 'Post not found';
    const lede = post ? post.excerpt || '' : "The blog post you're looking for doesn't exist or was removed.";
    const tag = post ? (Array.isArray(post.tags) && post.tags.find(Boolean)) || 'Blog' : 'Blog';
    const byline = post ? [post.author || 'YoutubeADwords', formatDate(post.date)].filter(Boolean).join(' · ') : '';
    root.querySelectorAll('h1').forEach((h1) => {
      h1.textContent = title;
      const top = h1.closest('[data-framer-name="Content"]') || h1.parentElement?.parentElement;
      if (!top) return;
      setText(top.querySelectorAll('[data-framer-name="Category"] p'), tag);
      const paras = Array.from(top.querySelectorAll('p')).filter((p) => !p.closest('[data-framer-name="Category"]'));
      paras.forEach((p) => {
        if (/min read/i.test(p.textContent)) p.textContent = formatDate(post?.date).toUpperCase();
        else if (p.textContent.includes('·')) p.textContent = byline;
      });
      const ledeP = paras.find((p) => p.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_PRECEDING && !/min read|·/i.test(p.textContent));
      if (ledeP) ledeP.textContent = lede;
    });
    setImage(root.querySelector('[data-framer-name="Top"]') || root, post && resolveImageSrc(post.coverImage), post?.title);
    // The article body: the rich-text block with the most paragraphs and headings
    const blocks = Array.from(root.querySelectorAll('[data-framer-component-type="RichTextContainer"]')).filter((el) => el.querySelector('h2'));
    const target = blocks.sort((a, b) => b.children.length - a.children.length)[0];
    if (!target) return undefined;
    const classes = {
      p: target.querySelector('p')?.className || '',
      h2: target.querySelector('h2')?.className || '',
      h3: target.querySelector('h3')?.className || target.querySelector('h2')?.className || '',
    };
    const original = Array.from(target.childNodes);
    target.replaceChildren();
    setBody({ target, classes });
    return () => { target.replaceChildren(...original); setBody(null); };
  }, [root, post]);

  const components = body && {
    p: (props) => <p className={body.classes.p}>{props.children}</p>,
    h1: (props) => <h2 className={body.classes.h2}>{props.children}</h2>,
    h2: (props) => <h2 className={body.classes.h2}>{props.children}</h2>,
    h3: (props) => <h3 className={body.classes.h3}>{props.children}</h3>,
    ul: (props) => <ul className={body.classes.p}>{props.children}</ul>,
    ol: (props) => <ol className={body.classes.p}>{props.children}</ol>,
  };

  return (
    <RevampPage
      key={slug}
      pageKey={ARTICLE_TEMPLATE}
      title={post ? `${post.title} | YoutubeADwords` : 'Blog | YoutubeADwords'}
      description={post?.excerpt || 'Read the latest tips and guides on YoutubeADwords blog about YouTube and Google Ads growth.'}
      onReady={(el) => { setRoot(el); return () => setRoot(null); }}
    >
      {body && createPortal(
        post ? <TinaMarkdown content={post.body} components={components} /> : <p className={body.classes.p}><a href="/blog">Back to blog</a></p>,
        body.target,
      )}
    </RevampPage>
  );
}
