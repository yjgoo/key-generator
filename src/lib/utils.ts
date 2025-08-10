// Utility function to convert generator titles to URL-friendly slugs
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Generate page title for SEO
export function generatePageTitle(generatorTitle: string): string {
  return `${generatorTitle} - Key Generator`;
}

// Generate meta description for SEO
export function generateMetaDescription(generatorTitle: string, description: string): string {
  return `Generate secure ${generatorTitle.toLowerCase()} instantly. ${description} Free, secure, and browser-based key generator tool.`;
}
