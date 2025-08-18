import { Client } from 'ldapts';
import { createSampleData } from './createSampleData';

const ldapUrl = "ldap://localhost:389"; // Change this if your LDAP server is running on a different host or port
const baseDN = "dc=example,dc=org"; // Updated to match docker-compose.yml domain
const adminDN = "cn=admin,dc=example,dc=org"; // Full admin DN
const adminPassword = "admin"; // Password from docker-compose.yml

class LdapClient {
  private client: Client | null = null;

  async connect() {
    this.client = new Client({ url: ldapUrl });
    await this.client.bind(adminDN, adminPassword); // Use correct admin credentials
  }

  async disconnect() {
    if (this.client) {
      await this.client.unbind();
      this.client = null;
    }
  }

  isConnected(): boolean {
    return this.client !== null;
  }

  async search(
    searchBase: string,
    filter: string = "(objectClass=*)",
    scope: "base" | "one" | "sub" = "sub"
  ) {
    if (!this.client) {
      throw new Error("Not connected to LDAP server");
    }

    const searchOptions = {
      scope,
      filter,
      attributes: ["*", "+"], // Include all attributes and operational attributes
    };

    return await this.client.search(searchBase, searchOptions);
  }

  async getBaseDN() {
    return baseDN;
  }

  async add(dn: string, attributes: any) {
    if (!this.client) {
      throw new Error("Not connected to LDAP server");
    }
    return await this.client.add(dn, attributes);
  }

  async entryExists(dn: string): Promise<boolean> {
    try {
      const result = await this.search(dn, "(objectClass=*)", "base");
      return result.searchEntries.length > 0;
    } catch (error) {
      return false;
    }
  }

  async searchUsers() {
    console.log("\n👥 Searching for all users:");
    const users = await this.search(
      "ou=People,dc=example,dc=org",
      "(objectClass=inetOrgPerson)"
    );
    users.searchEntries.forEach((user, index) => {
      console.log(`${index + 1}. ${user.cn} (${user.uid})`);
      console.log(`   Email: ${user.mail}`);
      console.log(`   Title: ${user.title}`);
      console.log(`   Department: ${user.departmentNumber}`);
      console.log("");
    });
    return users;
  }

  async searchGroups() {
    console.log("\n👨‍👩‍👧‍👦 Searching for all groups:");
    const groups = await this.search(
      "ou=Groups,dc=example,dc=org",
      "(objectClass=groupOfNames)"
    );
    groups.searchEntries.forEach((group, index) => {
      console.log(`${index + 1}. ${group.cn}`);
      console.log(`   Description: ${group.description}`);
      console.log(
        `   Members: ${Array.isArray(group.member) ? group.member.length : 1}`
      );
      if (group.member) {
        const members = Array.isArray(group.member)
          ? group.member
          : [group.member];
        members.forEach((member) => {
          const memberStr = member.toString();
          const cn = memberStr.split(",")[0].replace("cn=", "");
          console.log(`     - ${cn}`);
        });
      }
      console.log("");
    });
    return groups;
  }

  async searchByFilter(filter: string, searchBase: string = baseDN) {
    console.log(`\n🔍 Custom search with filter: ${filter}`);
    const results = await this.search(searchBase, filter);
    console.log(`Found ${results.searchEntries.length} entries:`);
    results.searchEntries.forEach((entry, index) => {
      console.log(`${index + 1}. DN: ${entry.dn}`);
      if (entry.cn) console.log(`   CN: ${entry.cn}`);
      if (entry.mail) console.log(`   Email: ${entry.mail}`);
      if (entry.title) console.log(`   Title: ${entry.title}`);
      console.log("");
    });
    return results;
  }
}

async function main() {
  const ldapClient = new LdapClient();
  try {
    console.log("Connecting to LDAP server...");
    await ldapClient.connect();
    console.log("✅ Connected to LDAP server successfully!");

    // Create sample data
    await createSampleData();

    // Get the base DN info
    console.log("\n🔍 Searching base DN:", baseDN);
    const baseSearch = await ldapClient.search(
      baseDN,
      "(objectClass=*)",
      "base"
    );
    console.log(
      "Base DN entry:",
      JSON.stringify(baseSearch.searchEntries[0], null, 2)
    );

    // Search for all entries in the directory
    console.log("\n📋 Listing all entries in the directory:");
    const allEntries = await ldapClient.search(baseDN, "(objectClass=*)");
    console.log(`Found ${allEntries.searchEntries.length} entries:`);

    allEntries.searchEntries.forEach((entry, index) => {
      console.log(`${index + 1}. DN: ${entry.dn}`);
      console.log(`   Object Classes: ${entry.objectClass}`);
      if (entry.cn) console.log(`   Common Name: ${entry.cn}`);
      if (entry.description)
        console.log(`   Description: ${entry.description}`);
      console.log("");
    });

    // Demonstrate various LDAP search operations
    await ldapClient.searchUsers();
    await ldapClient.searchGroups();

    // Example custom searches
    await ldapClient.searchByFilter("(title=*Engineer*)");
    await ldapClient.searchByFilter("(departmentNumber=Engineering)");
    await ldapClient.searchByFilter("(mail=*@example.org)");
    await ldapClient.searchByFilter(
      "(&(objectClass=inetOrgPerson)(givenName=J*))"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await ldapClient.disconnect();
    console.log("🔌 Disconnected from LDAP server");
  }
}

main();
