import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
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
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1100px] mx-auto px-4 py-10 sm:py-14">
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Blog
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Tips, guides, and updates to help you grow your presence on YouTube, Google, and TikTok.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <span className="text-gray-500 font-medium">Loading…</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-medium">{error}</p>
              <Link to="/" className="inline-block mt-4 text-brand-red font-bold hover:underline">
                Back to home
              </Link>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-medium">No posts yet. Check back soon or add posts in Tina CMS.</p>
              <Link to="/" className="inline-block mt-4 text-brand-red font-bold hover:underline">
                Back to home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => {
                const slug = post?._sys?.filename;
                const cover = resolveImageSrc(post?.coverImage);
                const href = slug ? `/blog/${slug}` : '/blog';
                return (
                  <Link
                    key={post?.id || slug}
                    to={href}
                    className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col"
                  >
                    {cover ? (
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                        <img
                          src={cover}
                          alt={post?.title || 'Blog cover'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-red-500/10 to-red-600/20 flex items-center justify-center">
                        <span className="text-4xl text-brand-red/40">📝</span>
                      </div>
                    )}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {formatDate(post?.date)}
                        {post?.author && ` · ${post.author}`}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-brand-red transition-colors line-clamp-2">
                        {post?.title}
                      </h2>
                      {post?.excerpt && (
                        <p className="text-gray-500 text-sm font-medium line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-red group-hover:gap-2 transition-all">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="M13 18l6-6" />
                          <path d="M13 6l6 6" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
