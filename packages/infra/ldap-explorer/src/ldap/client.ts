export class LdapClient {
  private client: any;
  private isConnectedState: boolean = false;

  constructor(private url: string, private options: any) {
    // Initialize the LDAP client with the provided URL and options
    this.client = require("ldapts").Client;
  }

  async connect() {
    if (!this.isConnectedState) {
      try {
        await this.client.connect(this.url, this.options);
        this.isConnectedState = true;
      } catch (error) {
        throw new Error(`Failed to connect to LDAP server: ${error.message}`);
      }
    }
  }

  async disconnect() {
    if (this.isConnectedState) {
      await this.client.unbind();
      this.isConnectedState = false;
    }
  }

  isConnected(): boolean {
    return this.isConnectedState;
  }
}
