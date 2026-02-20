export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const GlobalPartsFragmentDoc = gql`
    fragment GlobalParts on Global {
  __typename
  header {
    __typename
    siteName
    logo
    navLinks {
      __typename
      label
      link
    }
    loginLabel
    signupLabel
    signedInAs
    myOrders
    logout
    shoppingCartAria
  }
  footer {
    __typename
    tagline
    ourServicesTitle
    resourcesTitle
    companyTitle
    legalDisclaimer
    copyright
    privacyPolicy
    termsOfService
    refundPolicy
    cookiesSettings
  }
  serviceBar {
    __typename
    services {
      __typename
      label
      items {
        __typename
        label
        link
      }
    }
  }
  cart {
    __typename
    title
    emptyTitle
    emptySubtext
    browseServices
  }
  auth {
    __typename
    loginTitle
    loginSubtitle
    emailOrUsernameLabel
    emailPlaceholder
    passwordLabel
    passwordPlaceholder
    logInButton
    loggingInButton
    rememberMe
    forgotPassword
    noAccount
    signUpLinkText
    signupTitle
    signupSubtitle
    hasAccount
    logInLinkText
  }
}
    `;
export const HomePartsFragmentDoc = gql`
    fragment HomeParts on Home {
  __typename
  hero {
    __typename
    badge
    title
    subtitle
    ctaPrimary
    ctaPrimaryLink
    ctaSecondary
    ctaSecondaryLink
    lastOrder
    activeCampaigns
    heroImage
    heroImageAlt
  }
  servicesSection {
    __typename
    googleServices
    tiktokServices
  }
  whyChooseUs {
    __typename
    title
    features {
      __typename
      title
    }
  }
  faq {
    __typename
    heading
    items {
      __typename
      question
      answer
    }
  }
  comparison {
    __typename
    heading
    better
    otherTitle
    ourTitle
    bestChoice
    otherPoints
    ourPoints
  }
  globalAudienceCta {
    __typename
    title
    titleHighlight
    paragraph1
    paragraph2
  }
}
    `;
export const ContactPartsFragmentDoc = gql`
    fragment ContactParts on Contact {
  __typename
  title
  introParagraph1
  introParagraph2
  trackOrderLinkText
  trackOrderLinkHref
  formHeading
  successMessage
  labelEmail
  labelReason
  labelOrderNumber
  labelMessage
  placeholderEmail
  placeholderReason
  placeholderOrderNumber
  placeholderMessage
  reasonOptions {
    __typename
    value
    label
  }
  submitButton
  submittingButton
}
    `;
export const PricingPartsFragmentDoc = gql`
    fragment PricingParts on Pricing {
  __typename
  pages {
    __typename
    slug
    quantityKey
    regularPackages {
      __typename
      quantity
      price
      originalPrice
      discount
    }
    fastPackages {
      __typename
      quantity
      price
      originalPrice
      discount
    }
    adsPackages {
      __typename
      quantity
      price
      originalPrice
      discount
    }
  }
}
    `;
export const PricingPageContentPartsFragmentDoc = gql`
    fragment PricingPageContentParts on PricingPageContent {
  __typename
  pages {
    __typename
    slug
    hero {
      __typename
      image
      title
      badge
      intro
    }
    tabs {
      __typename
      regular
      fast
      ads
    }
    infoBanner
    features {
      __typename
      label
    }
    allInOne {
      __typename
      heading
      description
      stats {
        __typename
        value
        label
      }
    }
    guarantee {
      __typename
      heading
      intro1
      intro2
      cards {
        __typename
        title
        body
      }
    }
    whySection {
      __typename
      heading
      image
      paragraph1
      paragraph2
      paragraph3
    }
    numbersSection {
      __typename
      heading
      image
      paragraph1
      paragraph2
      paragraph3
    }
    strategySection {
      __typename
      heading
      image
      paragraph1
      paragraph2
    }
    faq {
      __typename
      heading
      items {
        __typename
        question
        answer
      }
    }
  }
}
    `;
export const BlogPartsFragmentDoc = gql`
    fragment BlogParts on Blog {
  __typename
  title
  excerpt
  author
  date
  coverImage
  tags
  body
}
    `;
export const PageMetadataPartsFragmentDoc = gql`
    fragment PageMetadataParts on PageMetadata {
  __typename
  slug
  title
  description
  keywords
  ogImage
}
    `;
export const LegalPartsFragmentDoc = gql`
    fragment LegalParts on Legal {
  __typename
  privacy {
    __typename
    title
    lastUpdated
    sections {
      __typename
      heading
      body
      listItems
    }
  }
  terms {
    __typename
    title
    lastUpdated
    sections {
      __typename
      heading
      body
      listItems
      subsections {
        __typename
        subheading
        body
        listItems
      }
    }
  }
  refund {
    __typename
    title
    lastUpdated
    sections {
      __typename
      heading
      body
      listItems
      subsections {
        __typename
        subheading
        body
      }
    }
  }
  cookies {
    __typename
    title
    lastUpdated
    sections {
      __typename
      heading
      body
    }
    cookieTypes {
      __typename
      name
      description
      alwaysOn
    }
    saveButtonText
    savedButtonText
  }
}
    `;
export const GlobalDocument = gql`
    query global($relativePath: String!) {
  global(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...GlobalParts
  }
}
    ${GlobalPartsFragmentDoc}`;
export const GlobalConnectionDocument = gql`
    query globalConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: GlobalFilter) {
  globalConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...GlobalParts
      }
    }
  }
}
    ${GlobalPartsFragmentDoc}`;
export const HomeDocument = gql`
    query home($relativePath: String!) {
  home(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HomeParts
  }
}
    ${HomePartsFragmentDoc}`;
export const HomeConnectionDocument = gql`
    query homeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomeFilter) {
  homeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HomeParts
      }
    }
  }
}
    ${HomePartsFragmentDoc}`;
export const ContactDocument = gql`
    query contact($relativePath: String!) {
  contact(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ContactParts
  }
}
    ${ContactPartsFragmentDoc}`;
export const ContactConnectionDocument = gql`
    query contactConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ContactFilter) {
  contactConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ContactParts
      }
    }
  }
}
    ${ContactPartsFragmentDoc}`;
export const PricingDocument = gql`
    query pricing($relativePath: String!) {
  pricing(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PricingParts
  }
}
    ${PricingPartsFragmentDoc}`;
export const PricingConnectionDocument = gql`
    query pricingConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PricingFilter) {
  pricingConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PricingParts
      }
    }
  }
}
    ${PricingPartsFragmentDoc}`;
export const PricingPageContentDocument = gql`
    query pricingPageContent($relativePath: String!) {
  pricingPageContent(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PricingPageContentParts
  }
}
    ${PricingPageContentPartsFragmentDoc}`;
export const PricingPageContentConnectionDocument = gql`
    query pricingPageContentConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PricingPageContentFilter) {
  pricingPageContentConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PricingPageContentParts
      }
    }
  }
}
    ${PricingPageContentPartsFragmentDoc}`;
export const BlogDocument = gql`
    query blog($relativePath: String!) {
  blog(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BlogParts
  }
}
    ${BlogPartsFragmentDoc}`;
export const BlogConnectionDocument = gql`
    query blogConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BlogFilter) {
  blogConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BlogParts
      }
    }
  }
}
    ${BlogPartsFragmentDoc}`;
export const PageMetadataDocument = gql`
    query pageMetadata($relativePath: String!) {
  pageMetadata(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageMetadataParts
  }
}
    ${PageMetadataPartsFragmentDoc}`;
export const PageMetadataConnectionDocument = gql`
    query pageMetadataConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageMetadataFilter) {
  pageMetadataConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageMetadataParts
      }
    }
  }
}
    ${PageMetadataPartsFragmentDoc}`;
export const LegalDocument = gql`
    query legal($relativePath: String!) {
  legal(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...LegalParts
  }
}
    ${LegalPartsFragmentDoc}`;
export const LegalConnectionDocument = gql`
    query legalConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: LegalFilter) {
  legalConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...LegalParts
      }
    }
  }
}
    ${LegalPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    global(variables, options) {
      return requester(GlobalDocument, variables, options);
    },
    globalConnection(variables, options) {
      return requester(GlobalConnectionDocument, variables, options);
    },
    home(variables, options) {
      return requester(HomeDocument, variables, options);
    },
    homeConnection(variables, options) {
      return requester(HomeConnectionDocument, variables, options);
    },
    contact(variables, options) {
      return requester(ContactDocument, variables, options);
    },
    contactConnection(variables, options) {
      return requester(ContactConnectionDocument, variables, options);
    },
    pricing(variables, options) {
      return requester(PricingDocument, variables, options);
    },
    pricingConnection(variables, options) {
      return requester(PricingConnectionDocument, variables, options);
    },
    pricingPageContent(variables, options) {
      return requester(PricingPageContentDocument, variables, options);
    },
    pricingPageContentConnection(variables, options) {
      return requester(PricingPageContentConnectionDocument, variables, options);
    },
    blog(variables, options) {
      return requester(BlogDocument, variables, options);
    },
    blogConnection(variables, options) {
      return requester(BlogConnectionDocument, variables, options);
    },
    pageMetadata(variables, options) {
      return requester(PageMetadataDocument, variables, options);
    },
    pageMetadataConnection(variables, options) {
      return requester(PageMetadataConnectionDocument, variables, options);
    },
    legal(variables, options) {
      return requester(LegalDocument, variables, options);
    },
    legalConnection(variables, options) {
      return requester(LegalConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
