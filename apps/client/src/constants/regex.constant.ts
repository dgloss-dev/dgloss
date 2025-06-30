export const REGEX = {
  HALF_WIDTH_ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  EMAIL:
    /^(?:"[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~ -]+"|[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9_](?:[a-zA-Z0-9-_]{0,61}[a-zA-Z0-9_])?(?:\.[a-zA-Z0-9_](?:[a-zA-Z0-9-_]{0,61}[a-zA-Z0-9_])?)*\.[a-zA-Z]{2,}$/,
  PASSWORD_REQ:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/,
  EMPTY_SPACE: /^\s*\S.*$/,
  JP_ONLY: /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF0-9\s]+$/,
  JP_ONLY_WITH_SPECIAL: /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF0-9\s\p{P}\p{S}]*$/u,
  EN_ONLY: /^[a-zA-Z0-9\s]+$/,
  EN_ONLY_WITH_SPECIAL: /^[A-Za-z0-9\s\p{P}\p{S}]*$/u,
  CHECK_HALF_WIDTH_ENGLISH_CHARACTERS: /^(?!.*[A-Za-z]).*$/,
  CHECK_HIRAGANA_CHARACTERS: /^(?!.*[\u3040-\u309F]).*$/,
};
