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
    ctaSecondary
    lastOrder
    activeCampaigns
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
export const PricesPartsFragmentDoc = gql`
    fragment PricesParts on Prices {
  __typename
  pageEntries {
    __typename
    slug
    title
    titleHighlight
    subtitle
    imageAlt
    imageSrc
    tabs {
      __typename
      id
      label
    }
    infoBanner
    infoBannerHighlight
    packagesRegular {
      __typename
      quantity
      price
      originalPrice
      discount
    }
    packagesFast {
      __typename
      quantity
      price
      originalPrice
      discount
    }
    packagesAds {
      __typename
      quantity
      price
      originalPrice
      discount
    }
    quantityKey
    quantityUnit
    features {
      __typename
      label
    }
    buyNowLabel
    addToCartLabel
    allInOnePrice
    allInOneTitle
    allInOneButtonLabel
    allInOneDescription
    allInOneFeatures {
      __typename
      value
      label
    }
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
export const PricesDocument = gql`
    query prices($relativePath: String!) {
  prices(relativePath: $relativePath) {
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
    ...PricesParts
  }
}
    ${PricesPartsFragmentDoc}`;
export const PricesConnectionDocument = gql`
    query pricesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PricesFilter) {
  pricesConnection(
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
        ...PricesParts
      }
    }
  }
}
    ${PricesPartsFragmentDoc}`;
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
    prices(variables, options) {
      return requester(PricesDocument, variables, options);
    },
    pricesConnection(variables, options) {
      return requester(PricesConnectionDocument, variables, options);
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
      url: "https://content.tinajs.io/2.1/content/722e7af1-e7c6-48b3-a0f5-0cf3c4672195/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
