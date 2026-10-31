// Turns an app path into a URL for places Next does not rewrite itself (fetch, plain <form action>). Empty in the
// normal build; in the static demo it adds the sub-path (/gfd) and, for pages, the trailing slash they are served at.
export function withBase(path: string, { page = true } = {}) {
  const slash = page && process.env.NEXT_PUBLIC_STATIC_DEMO === '1' && !path.endsWith('/') ? '/' : '';
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}${slash}`;
}
