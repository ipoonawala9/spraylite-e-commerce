const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A deliberately forgiving check: something@something.tld, no spaces. */
export function isValidEmail(value: string) {
  return EMAIL.test(value.trim());
}
