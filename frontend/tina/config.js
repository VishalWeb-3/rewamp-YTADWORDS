import { defineConfig } from 'tinacms';

export default defineConfig({
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  branch: process.env.VITE_TINA_BRANCH || process.env.TINA_BRANCH || 'main',
  clientId: process.env.VITE_TINA_CLIENT_ID || process.env.TINA_CLIENT_ID || process.env.Tins_client || '',
  token: process.env.VITE_TINA_TOKEN || process.env.TINA_TOKEN || process.env.Tina_token || '',
  schema: {
    collections: [
      {
        name: 'global',
        label: 'Global',
        path: 'content/global',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'object',
            name: 'header',
            label: 'Header',
            fields: [
              { type: 'string', name: 'siteName', label: 'Site Name' },
              { type: 'string', name: 'logo', label: 'Logo URL', required: false },
              {
                type: 'object',
                name: 'navLinks',
                label: 'Nav Links',
                list: true,
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'link', label: 'Link' },
                ],
              },
              { type: 'string', name: 'loginLabel', label: 'Login Label' },
              { type: 'string', name: 'signupLabel', label: 'Sign Up Label' },
              { type: 'string', name: 'signedInAs', label: 'Signed In As' },
              { type: 'string', name: 'myOrders', label: 'My Orders' },
              { type: 'string', name: 'logout', label: 'Logout' },
              { type: 'string', name: 'shoppingCartAria', label: 'Shopping Cart Aria' },
            ],
          },
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              { type: 'string', name: 'tagline', label: 'Tagline' },
              { type: 'string', name: 'ourServicesTitle', label: 'Our Services Title' },
              { type: 'string', name: 'resourcesTitle', label: 'Resources Title' },
              { type: 'string', name: 'companyTitle', label: 'Company Title' },
              { type: 'string', name: 'legalDisclaimer', label: 'Legal Disclaimer' },
              { type: 'string', name: 'copyright', label: 'Copyright' },
              { type: 'string', name: 'privacyPolicy', label: 'Privacy Policy' },
              { type: 'string', name: 'termsOfService', label: 'Terms of Service' },
              { type: 'string', name: 'refundPolicy', label: 'Refund Policy' },
              { type: 'string', name: 'cookiesSettings', label: 'Cookies Settings' },
            ],
          },
          {
            type: 'object',
            name: 'serviceBar',
            label: 'Service Bar',
            fields: [
              {
                type: 'object',
                name: 'services',
                label: 'Services',
                list: true,
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  {
                    type: 'object',
                    name: 'items',
                    label: 'Items',
                    list: true,
                    fields: [
                      { type: 'string', name: 'label', label: 'Label' },
                      { type: 'string', name: 'link', label: 'Link' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'cart',
            label: 'Cart',
            fields: [
              { type: 'string', name: 'title', label: 'Cart Title' },
              { type: 'string', name: 'emptyTitle', label: 'Empty Cart Title' },
              { type: 'string', name: 'emptySubtext', label: 'Empty Cart Subtext' },
              { type: 'string', name: 'browseServices', label: 'Browse Services' },
            ],
          },
          {
            type: 'object',
            name: 'auth',
            label: 'Auth',
            fields: [
              { type: 'string', name: 'loginTitle', label: 'Login Title' },
              { type: 'string', name: 'loginSubtitle', label: 'Login Subtitle' },
              { type: 'string', name: 'emailOrUsernameLabel', label: 'Email or Username Label' },
              { type: 'string', name: 'emailPlaceholder', label: 'Email Placeholder' },
              { type: 'string', name: 'passwordLabel', label: 'Password Label' },
              { type: 'string', name: 'passwordPlaceholder', label: 'Password Placeholder' },
              { type: 'string', name: 'logInButton', label: 'Log In Button' },
              { type: 'string', name: 'loggingInButton', label: 'Logging In Button' },
              { type: 'string', name: 'rememberMe', label: 'Remember Me' },
              { type: 'string', name: 'forgotPassword', label: 'Forgot Password' },
              { type: 'string', name: 'noAccount', label: 'No Account Text' },
              { type: 'string', name: 'signUpLinkText', label: 'Sign Up Link Text' },
              { type: 'string', name: 'signupTitle', label: 'Signup Title' },
              { type: 'string', name: 'signupSubtitle', label: 'Signup Subtitle' },
              { type: 'string', name: 'hasAccount', label: 'Has Account Text' },
              { type: 'string', name: 'logInLinkText', label: 'Log In Link Text' },
            ],
          },
        ],
      },
      {
        name: 'home',
        label: 'Home',
        path: 'content/home',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: 'object', name: 'hero', label: 'Hero', fields: [
            { type: 'string', name: 'badge', label: 'Badge Text' },
            { type: 'string', name: 'title', label: 'Title' },
            { type: 'string', name: 'subtitle', label: 'Subtitle' },
            { type: 'string', name: 'ctaPrimary', label: 'CTA Primary' },
            { type: 'string', name: 'ctaSecondary', label: 'CTA Secondary' },
            { type: 'string', name: 'lastOrder', label: 'Last Order Text' },
            { type: 'string', name: 'activeCampaigns', label: 'Active Campaigns Text' },
          ]},
          { type: 'object', name: 'servicesSection', label: 'Services Section', fields: [
            { type: 'string', name: 'googleServices', label: 'Google Services', list: true },
            { type: 'string', name: 'tiktokServices', label: 'TikTok Services', list: true },
          ]},
          { type: 'object', name: 'whyChooseUs', label: 'Why Choose Us', fields: [
            { type: 'string', name: 'title', label: 'Title' },
            { type: 'object', name: 'features', label: 'Features', list: true, fields: [
              { type: 'string', name: 'title', label: 'Title' },
            ]},
          ]},
          { type: 'object', name: 'faq', label: 'FAQ', fields: [
            { type: 'string', name: 'heading', label: 'Heading' },
            { type: 'object', name: 'items', label: 'Items', list: true, fields: [
              { type: 'string', name: 'question', label: 'Question' },
              { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
            ]},
          ]},
          { type: 'object', name: 'comparison', label: 'Comparison', fields: [
            { type: 'string', name: 'heading', label: 'Heading' },
            { type: 'string', name: 'better', label: 'Better' },
            { type: 'string', name: 'otherTitle', label: 'Other Providers Title' },
            { type: 'string', name: 'ourTitle', label: 'Our Title' },
            { type: 'string', name: 'bestChoice', label: 'Best Choice Badge' },
            { type: 'string', name: 'otherPoints', label: 'Other Points', list: true },
            { type: 'string', name: 'ourPoints', label: 'Our Points', list: true },
          ]},
          { type: 'object', name: 'globalAudienceCta', label: 'Global Audience CTA', fields: [
            { type: 'string', name: 'title', label: 'Title' },
            { type: 'string', name: 'titleHighlight', label: 'Title Highlight' },
            { type: 'string', name: 'paragraph1', label: 'Paragraph 1' },
            { type: 'string', name: 'paragraph2', label: 'Paragraph 2' },
          ]},
        ],
      },
    ],
  },
});
