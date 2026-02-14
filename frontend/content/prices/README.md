# Price pages content (Tina)

All product/price pages are driven by `prices.json`. Edit in Tina Cloud under **Prices** or here.

## Structure

- **pageEntries**: array of one object per route. Each has:
  - **slug**: route path (e.g. `buy-youtube-views`, `buy-tiktok-followers`)
  - **title**, **titleHighlight**, **subtitle**, **imageAlt**, **imageSrc**
  - **tabs**: `[{ id, label }]` (e.g. regular / fast / ads)
  - **infoBanner**, **packagesRegular**, **packagesFast**, **packagesAds**: arrays of `{ quantity, price, originalPrice?, discount? }`
  - **quantityKey**, **quantityUnit**: e.g. `views`, `followers`, `likes`
  - **features**: `[{ label }]`
  - **buyNowLabel**, **addToCartLabel**
  - **allInOnePrice**, **allInOneTitle**, **allInOneDescription**, **allInOneFeatures** (optional)

## Using in a page

Use the shared component so the hero and pricing card come from content:

```jsx
import PricePageContent from '../components/PricePageContent';

<PricePageContent
  slug="buy-youtube-views"
  platform="YouTube"
  fallbackPackages={viewPackagesFallback}
  fallbackTitle="Buy YouTube Views"
  fallbackUnit="views"
>
  {/* Rest of page: FAQ, sections, etc. */}
</PricePageContent>
```

**Buy YouTube Views** is already wired. Other Buy* pages can be migrated the same way (same props, different `slug` / `platform` / `fallbackPackages` / `fallbackTitle` / `fallbackUnit`).
