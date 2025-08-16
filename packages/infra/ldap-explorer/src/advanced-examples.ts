import { Client } from 'ldapts';

const ldapUrl = "ldap://localhost:389";
const baseDN = "dc=example,dc=org";
const adminDN = "cn=admin,dc=example,dc=org";
const adminPassword = "admin";

class AdvancedLdapExplorer {
  private client: Client | null = null;

  async connect() {
    this.client = new Client({ url: ldapUrl });
    await this.client.bind(adminDN, adminPassword);
  }

  async disconnect() {
    if (this.client) {
      await this.client.unbind();
      this.client = null;
    }
  }

  // Test user authentication
  async authenticateUser(userDN: string, password: string): Promise<boolean> {
    try {
      const tempClient = new Client({ url: ldapUrl });
      await tempClient.bind(userDN, password);
      await tempClient.unbind();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Modify user attributes (using Change format for ldapts)
  async modifyUser(userDN: string, changes: any) {
    if (!this.client) throw new Error("Not connected");
    return await this.client.modify(userDN, changes);
  }

  // Delete an entry
  async deleteEntry(dn: string) {
    if (!this.client) throw new Error("Not connected");
    return await this.client.del(dn);
  }

  // Add user to group
  async addUserToGroup(userDN: string, groupDN: string) {
    const { Change } = require('ldapts');
    const changes = new Change({
      operation: 'add',
      modification: {
        member: [userDN]
      }
    });
    return await this.modifyUser(groupDN, changes);
  }

  // Remove user from group
  async removeUserFromGroup(userDN: string, groupDN: string) {
    const { Change } = require('ldapts');
    const changes = new Change({
      operation: 'delete',
      modification: {
        member: [userDN]
      }
    });
    return await this.modifyUser(groupDN, changes);
  }

  // Search with paging (for large result sets)
  async searchWithPaging(searchBase: string, filter: string, pageSize: number = 10) {
    if (!this.client) throw new Error("Not connected");
    
    const searchOptions = {
      scope: 'sub' as const,
      filter,
      paged: {
        pageSize,
        pagePause: false,
      }
    };

    const allEntries: any[] = [];
    const searchResult = await this.client.search(searchBase, searchOptions);
    
    allEntries.push(...searchResult.searchEntries);
    
    return {
      entries: allEntries,
      total: allEntries.length
    };
  }

  // Get schema information
  async getSchema() {
    if (!this.client) throw new Error("Not connected");
    
    const schemaSearch = await this.client.search('cn=Subschema', {
      scope: 'base',
      filter: '(objectClass=*)',
      attributes: ['objectClasses', 'attributeTypes', 'matchingRules']
    });
    
    return schemaSearch.searchEntries[0];
  }

  // Compare attribute values
  async compareAttribute(dn: string, attribute: string, value: string) {
    if (!this.client) throw new Error("Not connected");
    return await this.client.compare(dn, attribute, value);
  }
}

async function demonstrateAdvancedOperations() {
  const explorer = new AdvancedLdapExplorer();
  
  try {
    await explorer.connect();
    console.log("🔗 Connected to LDAP server");

    // Test user authentication
    console.log("\n🔐 Testing user authentication:");
    const johnDN = "cn=John Doe,ou=People,dc=example,dc=org";
    const isAuthenticated = await explorer.authenticateUser(johnDN, "password123");
    console.log(`John Doe authentication: ${isAuthenticated ? '✅ Success' : '❌ Failed'}`);

    // Test wrong password
    const wrongAuth = await explorer.authenticateUser(johnDN, "wrongpassword");
    console.log(`Wrong password test: ${wrongAuth ? '✅ Success' : '❌ Failed (expected)'}`);

    // Modify user attribute using Change class
    console.log("\n✏️ Modifying user attributes:");
    const { Change } = require('ldapts');
    
    // Update title
    const titleChange = new Change({
      operation: 'replace',
      modification: {
        title: ['Senior Software Engineer']
      }
    });
    
    try {
      await explorer.modifyUser(johnDN, titleChange);
      console.log("✅ Updated John Doe's title");
    } catch (error: any) {
      console.log("⚠️  Title modification failed:", error.message);
    }

    // Add phone number
    const phoneChange = new Change({
      operation: 'add',
      modification: {
        telephoneNumber: ['+1-555-0123']
      }
    });
    
    try {
      await explorer.modifyUser(johnDN, phoneChange);
      console.log("✅ Added phone number to John Doe");
    } catch (error: any) {
      console.log("⚠️  Phone number addition failed:", error.message);
    }

    // Search with paging
    console.log("\n📄 Searching with paging:");
    const pagedResults = await explorer.searchWithPaging(baseDN, "(objectClass=*)", 5);
    console.log(`Found ${pagedResults.total} entries with page size 5`);

    // Compare attribute
    console.log("\n🔍 Comparing attributes:");
    const titleMatch = await explorer.compareAttribute(johnDN, 'title', 'Senior Software Engineer');
    console.log(`Title comparison result: ${titleMatch}`);

    // Get schema info (basic info only)
    console.log("\n📋 Schema information:");
    try {
      const schema = await explorer.getSchema();
      console.log(`Found schema with ${Object.keys(schema).length} properties`);
    } catch (error) {
      console.log("Schema query not supported or accessible");
    }

    // Demonstrate group management
    console.log("\n👥 Group management:");
    const janeDN = "cn=Jane Smith,ou=People,dc=example,dc=org";
    const engineeringGroupDN = "cn=Engineering,ou=Groups,dc=example,dc=org";
    
    try {
      await explorer.addUserToGroup(janeDN, engineeringGroupDN);
      console.log("✅ Added Jane to Engineering group");
    } catch (error) {
      console.log("⚠️  Jane might already be in the group or group modification failed");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await explorer.disconnect();
    console.log("🔌 Disconnected from LDAP server");
  }
}

// Run if this file is executed directly
if (require.main === module) {
  demonstrateAdvancedOperations();
}

export { AdvancedLdapExplorer };
