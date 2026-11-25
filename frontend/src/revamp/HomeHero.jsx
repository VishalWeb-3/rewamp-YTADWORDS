// Home page: the imported revamp page with its hero content swapped for a two-column hero
// (headline + live Tina price on the left, a "video in progress" card on the right).
// The section itself and its curved services ticker stay from the import.
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import RevampPage from './RevampPage';
import { usePricingPackages } from '../contexts/ContentContext';
import { isPriced, money } from './services';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useDeliveredCounter(target) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reducedMotion) { setCount(target); return undefined; }
    const id = setInterval(() => setCount((c) => (c >= target ? 0 : Math.min(target, c + 23))), 80);
    return () => clearInterval(id);
  }, [target]);
  return count;
}

function Hero() {
  const from = usePricingPackages('buy-youtube-views', null)?.regular?.find(isPriced);
  const delivered = useDeliveredCounter(1000);
  const progress = (delivered / 1000) * 100;

  return (
    <div className="yaw-hero">
      <div className="yaw-hero__copy">
        <p className="yaw-hero__eyebrow"><span className="yaw-hero__dot" aria-hidden="true" />Campaigns available now</p>
        <h1 className="yaw-hero__title">
          <span className="yaw-hero__line">Grow your</span>
          <span className="yaw-hero__line">YouTube <em className="yaw-hero__script">faster</em></span>
        </h1>
        {from && (
          <p className="yaw-hero__price">
            From <strong>{money(from.price)}</strong> per {from.views} views
          </p>
        )}
        <p className="yaw-hero__lead">
          Grow your YouTube channel and Google Ads with real engagement. Get views, subscribers and traffic, with packages for creators and brands.
        </p>
        <p className="yaw-hero__services">Views · Subscribers · Likes · Watch hours · Google Ads campaigns</p>
        <div className="yaw-hero__ctas">
          <a className="yaw-hero__btn yaw-hero__btn--primary" href="/buy-youtube-views">Buy YouTube views</a>
          <a className="yaw-hero__btn yaw-hero__btn--ghost" href="/about-us"><span className="yaw-hero__ad" aria-hidden="true">AD</span>About us</a>
        </div>
        <div className="yaw-hero__trust">
          <span className="yaw-hero__avatars" aria-hidden="true">
            {['049f4bd770eb42c4', 'd7da5d4d505f1b4c', 'b5cbd1857fa495eb', '13c7f40513dbb926'].map((id) => <img key={id} src={`/revamp/${id}.jpg`} alt="" />)}
          </span>
          Real people · Safe delivery · No passwords
        </div>
      </div>

      <div className="yaw-hero__stage" aria-hidden="true">
        <div className="yaw-hero__card">
          {/* Mixkit "Youtuber vlogging in his studio" (Mixkit Stock Video Free License); reduced motion keeps the still */}
          {reducedMotion
            ? <img className="yaw-hero__frame" src="/revamp/hero-camera.jpg" alt="" />
            : <video className="yaw-hero__frame" src="/revamp/hero-video.mp4" poster="/revamp/hero-camera.jpg" autoPlay muted loop playsInline preload="metadata" />}
          <div className="yaw-hero__overlay">
            <div className="yaw-hero__channel">
              <img src="/revamp/yaw-mark.svg" alt="" />
              <span><b>Your video</b><small>{delivered.toLocaleString('en-US')} views · live</small></span>
            </div>
            <div className="yaw-hero__player">
              <span className="yaw-hero__play" />
              <span className="yaw-hero__bar"><span style={{ width: `${progress}%` }} /></span>
            </div>
          </div>
        </div>
        <span className="yaw-hero__sticker yaw-hero__sticker--ads">Google Ads</span>
        <span className="yaw-hero__sticker yaw-hero__sticker--yt">YouTube</span>
        <span className="yaw-hero__sticker yaw-hero__sticker--love">❤️ Real engagement</span>
        <div className="yaw-hero__bubble"><small>New message · now</small>"Can you help me choose a package? 🙋‍♀️"</div>
      </div>
    </div>
  );
}

export default function RevampHome(props) {
  const [slot, setSlot] = useState(null);
  const swapHero = (root) => {
    const hero = root.querySelector('section[data-framer-name="Hero"]');
    if (!hero) return undefined;
    const hidden = Array.from(hero.querySelectorAll(':scope > [data-framer-name="Container"], :scope > [data-framer-name="BG Pattern"]'));
    hidden.forEach((el) => { el.style.display = 'none'; });
    const host = document.createElement('div');
    hero.prepend(host);
    setSlot(host);
    return () => { host.remove(); hidden.forEach((el) => { el.style.display = ''; }); setSlot(null); };
  };
  return (
    <RevampPage {...props} onReady={swapHero}>
      {slot && createPortal(<Hero />, slot)}
    </RevampPage>
  );
}
