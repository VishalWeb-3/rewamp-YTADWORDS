import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PageHead from '../components/site/PageHead';
import Pass from '../components/site/Pass';
import { Arrow } from '../components/landing/icons';

export default function PaymentFailurePage() {
  return (
    <Layout>
      <SEO title="Payment Failed | YoutubeADwords" description="Your payment could not be completed." />
      <div className="pg-status pg-wrap">
        <div>
          <PageHead
            title="Payment didn't go through."
            lede="You have not been charged. Your cart is still saved, so you can try again, or contact support if it keeps happening."
          >
            <div className="pg-actions">
              <Link to="/checkout" className="lp-btn lp-btn-red">Back to checkout<Arrow /></Link>
              <Link to="/contact" className="lp-btn lp-btn-line">Contact support</Link>
            </div>
          </PageHead>
        </div>
        <div className="pg-status-pass" aria-hidden="true">
          <Pass
            kind="Order pass"
            serial="NOT ISSUED"
            tone="void"
            title="Payment failed"
            rows={[
              { label: 'Charged', value: 'Nothing', mono: true },
              { label: 'Your cart', value: 'Saved' },
            ]}
            stamp="VOID"
          />
        </div>
      </div>
    </Layout>
  );
}
