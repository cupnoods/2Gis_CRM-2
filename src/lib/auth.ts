export function safeReturnPath(value: string | null) {
  return value && /^\/(catalogue|companies\/[^/?#]+|pipeline|tasks|dashboard|map|import-export|settings)(\?[^#]*)?$/.test(value) && !value.includes('\\') ? value : '/catalogue';
}
