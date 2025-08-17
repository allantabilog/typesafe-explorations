import { Client, SearchOptions, SearchResult } from 'ldapts';

export class LdapClient {
  private client: Client | null = null;
  private isConnectedState: boolean = false;

  constructor(private url: string, private options?: any) {
    // Initialize the LDAP client with the provided URL and options
    this.client = new Client({ url: this.url, ...this.options });
  }

  async connect() {
    if (!this.isConnectedState && this.client) {
      try {
        // The ldapts Client doesn't have a separate connect method
        // Connection happens when you perform operations like bind
        this.isConnectedState = true;
      } catch (error: any) {
        throw new Error(`Failed to connect to LDAP server: ${error.message}`);
      }
    }
  }

  async disconnect() {
    if (this.isConnectedState && this.client) {
      await this.client.unbind();
      this.isConnectedState = false;
    }
  }

  isConnected(): boolean {
    return this.isConnectedState;
  }

  async bind(dn: string, password: string): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    try {
      await this.client.bind(dn, password);
      this.isConnectedState = true;
    } catch (error: any) {
      throw new Error(`Bind failed: ${error.message}`);
    }
  }

  async search(base: string, options: SearchOptions): Promise<SearchResult> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    if (!this.isConnectedState) {
      throw new Error("Not connected to LDAP server");
    }
    return await this.client.search(base, options);
  }

  async add(dn: string, entry: Record<string, any>): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    if (!this.isConnectedState) {
      throw new Error("Not connected to LDAP server");
    }
    await this.client.add(dn, entry);
  }

  async modify(dn: string, changes: any[]): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    if (!this.isConnectedState) {
      throw new Error("Not connected to LDAP server");
    }
    await this.client.modify(dn, changes);
  }

  async del(dn: string): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    if (!this.isConnectedState) {
      throw new Error("Not connected to LDAP server");
    }
    await this.client.del(dn);
  }

  getClient(): Client | null {
    return this.client;
  }
}
