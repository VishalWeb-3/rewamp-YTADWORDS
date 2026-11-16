import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

// Foil strip across the top that fills as the article is read
function ReadingBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="pg-readbar" style={{ '--p': p }} aria-hidden="true" />;
}
import { client } from '../../tina/__generated__/client';
import { resolveImageSrc } from '../lib/tinaMedia';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setPost(null);
    setNotFound(false);

    if (!slug) {
      setLoading(false);
      return;
    }

    const blogQuery = client.queries?.blog;
    if (typeof blogQuery !== 'function') {
      if (mounted) setNotFound(true);
      setLoading(false);
      return;
    }

    blogQuery({ relativePath: `${slug}.mdx` })
      .then((res) => {
        if (mounted) setPost(res?.data?.blog ?? null);
      })
      .catch((err) => {
        console.error('Error fetching blog post:', err);
        if (mounted) setPost(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [slug]);

  const cover = post ? resolveImageSrc(post?.coverImage) : '';
  const tags = Array.isArray(post?.tags) ? post.tags.filter(Boolean) : [];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <span className="text-gray-500 font-medium">Loading…</span>
        </div>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist or was removed.</p>
          <Link to="/blog" className="text-brand-red font-bold hover:underline">Back to blog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={post.title ? `${post.title} | YoutubeADwords` : 'Blog | YoutubeADwords'}
        description={post.excerpt || 'Read the latest tips and guides on YoutubeADwords blog about YouTube and Google Ads growth.'}
      />
      <ReadingBar />
      <div className="pg-article">
        <article className="pg-wrap">
          <Link
            to="/blog"
            className="pg-back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to blog
          </Link>

          <header className="pg-article-head">
            <div className="pg-post-meta pg-in" style={{ '--d': '0s' }}>
              {formatDate(post.date)}
              {post.author && ` · ${post.author}`}
            </div>
            <h1 className="lp-display pg-in" style={{ '--d': '0.08s' }}>
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="pg-lede">{post.excerpt}</p>
            )}
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          {cover && (
            <div className="pg-article-cover pg-in" style={{ '--d': '0.4s' }}>
              <div>
                <img src={cover} alt={post.title} className="w-full h-auto object-cover" />
              </div>
            </div>
          )}

          <div className="pg-article-body pg-in" style={{ '--d': '0.5s' }}>
            <div
              className="prose prose-slate max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:font-medium prose-p:leading-relaxed prose-p:mb-6
                prose-ul:my-6 prose-li:font-medium prose-li:text-gray-600
                prose-a:text-brand-red prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
            >
              {post.body ? (
                <TinaMarkdown
                  content={post.body}
                  components={{
                    h2: (props) => <h2 {...props} className="text-2xl font-bold text-gray-900 mt-10 mb-4" />,
                    h3: (props) => <h3 {...props} className="text-xl font-bold text-gray-900 mt-8 mb-3" />,
                    p: (props) => <p {...props} className="text-gray-600 font-medium leading-relaxed mb-6" />,
                    ul: (props) => <ul {...props} className="list-disc pl-6 space-y-2 mb-8 text-gray-600 font-medium" />,
                    ol: (props) => <ol {...props} className="list-decimal pl-6 space-y-2 mb-8 text-gray-600 font-medium" />,
                    li: (props) => <li {...props} className="pl-2" />,
                    a: (props) => (
                      <a
                        {...props}
                        href={props?.url}
                        className="text-brand-red font-bold hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    img: (props) => {
                      const src = resolveImageSrc(props?.url ?? props?.src);
                      if (!src) return null;
                      return (
                        <img
                          src={src}
                          alt={props?.alt ?? ''}
                          loading="lazy"
                          className="rounded-xl border border-gray-200 shadow-sm my-8 w-full h-auto"
                        />
                      );
                    },
                  }}
                />
              ) : (
                <p className="text-gray-500">No content for this post.</p>
              )}
            </div>
          </div>

          <div className="pg-article-foot">
            <Link to="/blog" className="inline-flex items-center gap-2 text-brand-red font-bold hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              All posts
            </Link>
          </div>
        </article>
      </div>
    </Layout>
  );
}
