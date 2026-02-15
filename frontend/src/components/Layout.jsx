import React from 'react';
import Header from './Header';
import ServiceBar from './ServiceBar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <ServiceBar />
      {children}
      <Footer />
      <CartSidebar />
    </div>
  );
}
