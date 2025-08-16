export interface LdapEntry {
    dn: string;
    attributes: { [key: string]: string | string[] };
}

export interface SearchResult {
    entries: LdapEntry[];
    count: number;
}