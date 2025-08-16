import { LdapClient } from './client';
import { LdapEntry, SearchResult } from '../types';

const ldapClient = new LdapClient();

export async function addEntry(entry: LdapEntry): Promise<void> {
    if (!ldapClient.isConnected()) {
        await ldapClient.connect();
    }
    await ldapClient.add(entry);
}

export async function searchEntries(filter: string): Promise<SearchResult[]> {
    if (!ldapClient.isConnected()) {
        await ldapClient.connect();
    }
    return await ldapClient.search(filter);
}

export async function deleteEntry(dn: string): Promise<void> {
    if (!ldapClient.isConnected()) {
        await ldapClient.connect();
    }
    await ldapClient.delete(dn);
}