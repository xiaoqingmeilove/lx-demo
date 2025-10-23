export const resolveUrl = (url: string, prefix = '/api') => `${prefix.replace(/\/$/, '')}/${url}`;
