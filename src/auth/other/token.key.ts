
interface CookieTokensKeys {
    tokens_prefix: string,
    server_tokens_prefix: string,
    access_token_key: string,
    refresh_token_key: string,
} 

let _cache = undefined as CookieTokensKeys | undefined;

export function getTokensKeys(): CookieTokensKeys {
    if (_cache) return _cache;

    const TOKENS_PREFIX = (() => {
        let prefix = process.env.TOKENS_PREFIX as string;
        if (prefix?.includes('-')) {
            if (prefix.endsWith('-')) return prefix;
            return prefix + '-';
        }
        if (!prefix) prefix = 'mi';
        if (prefix.endsWith('_')) return prefix;
        return prefix + '_';
    })();

    if (TOKENS_PREFIX.includes('-')) {
        _cache = {
            tokens_prefix: TOKENS_PREFIX,
            server_tokens_prefix: 's-',
            access_token_key: TOKENS_PREFIX + 'access-token',
            refresh_token_key: TOKENS_PREFIX + 'refresh-token',
        }
    } else {
        _cache = {
            tokens_prefix: TOKENS_PREFIX,
            server_tokens_prefix: 's_',
            access_token_key: TOKENS_PREFIX + 'access_token',
            refresh_token_key: TOKENS_PREFIX + 'refresh_token',
        }
    }
    return _cache;
}