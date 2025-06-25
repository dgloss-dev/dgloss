export function convertToQuery(data: Record<string, any> | undefined): string {
  return Object.entries(data || {})
    ?.filter(([_, value]) => value !== undefined && value !== null && value !== '')
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    ?.join('&');
}
