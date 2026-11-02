import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PageHead from '../components/site/PageHead';
import { Arrow } from '../components/landing/icons';
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

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const blogConnection = client.queries?.blogConnection;
    if (typeof blogConnection !== 'function') {
      if (mounted) {
        setPosts([]);
        setError('Blog not configured. Run "npm run build:admin" to regenerate Tina and enable the blog.');
      }
      setLoading(false);
      return;
    }

    blogConnection({ first: 50 })
      .then((res) => {
        const edges = res?.data?.blogConnection?.edges ?? [];
        const nodes = edges.map((e) => e?.node).filter(Boolean);
        nodes.sort((a, b) => {
          const da = a?.date ? new Date(a.date).getTime() : 0;
          const db = b?.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });
        if (mounted) setPosts(nodes);
      })
      .catch((err) => {
        console.error('Error fetching blog posts:', err);
        if (mounted) {
          setPosts([]);
          setError('Could not load blog posts.');
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  return (
    <Layout>
      <SEO
        title="Blog | YoutubeADwords"
        description="Read the YoutubeADwords blog for tips, guides, and updates on growing your YouTube, TikTok, and Google Ads presence."
      />
      <div className="pg-wrap pg-section">
        <PageHead
          title="Blog"
          lede="Tips, guides and updates to help you grow on YouTube, Google and TikTok."
        />

        {loading ? (
          <p className="pg-blog-state" role="status">Loading posts…</p>
        ) : error || posts.length === 0 ? (
          <div className="pg-empty pg-in" style={{ marginTop: '3rem' }}>
            <span className="pg-empty-slot" aria-hidden="true" />
            <h2 className="lp-display">{error ? 'Posts could not load' : 'No posts yet'}</h2>
            <p>{error || 'New guides are on the way. In the meantime, browse the services.'}</p>
            <Link to="/" className="lp-btn lp-btn-red">Back to home<Arrow /></Link>
          </div>
        ) : (
          <div className="pg-blog">
            {posts.map((post, idx) => {
              const slug = post?._sys?.filename;
              const cover = resolveImageSrc(post?.coverImage);
              const href = slug ? `/blog/${slug}` : '/blog';
              const meta = [formatDate(post?.date), post?.author].filter(Boolean).join(', by ');
              return (
                <Link
                  key={post?.id || slug}
                  to={href}
                  className={`pg-post lp-reveal${idx === 0 ? ' is-lead' : ''}`}
                  style={{ '--i': Math.min(idx, 4) }}
                >
                  {idx === 0 && (
                    <div className="pg-post-cover">
                      {cover ? <img src={cover} alt="" /> : <span className="lp-holo" aria-hidden="true" />}
                    </div>
                  )}
                  <div className="pg-post-text">
                    {meta && <p className="pg-post-meta">{meta}</p>}
                    <h2 className="lp-display">{post?.title}</h2>
                    {post?.excerpt && <p className="pg-post-ex">{post.excerpt}</p>}
                  </div>
                  <span className="pg-post-go" aria-hidden="true"><Arrow /></span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
