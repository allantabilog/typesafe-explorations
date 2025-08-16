import { Client } from 'ldapts';

const ldapUrl = "ldap://localhost:389";
const baseDN = "dc=example,dc=org";
const adminDN = "cn=admin,dc=example,dc=org";
const adminPassword = "admin";

class WorkingLdapExamples {
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

  // Search operations with various filters
  async searchOperations() {
    if (!this.client) throw new Error("Not connected");

    console.log("\n🔍 Advanced Search Operations:");

    // 1. Search by exact attribute match
    console.log("\n1. Find users with title 'Software Engineer':");
    const engineers = await this.client.search(baseDN, { filter: "(title=Software Engineer)" });
    engineers.searchEntries.forEach(entry => {
      console.log(`   - ${entry.cn} (${entry.mail})`);
    });

    // 2. Search using wildcards
    console.log("\n2. Find users with names starting with 'J':");
    const jNames = await this.client.search(baseDN, { filter: "(cn=J*)" });
    jNames.searchEntries.forEach(entry => {
      console.log(`   - ${entry.cn} (${entry.uid})`);
    });

    // 3. Complex AND filter
    console.log("\n3. Find users in Engineering department with Engineer title:");
    const engineeringEngineers = await this.client.search(baseDN, { 
      filter: "(&(objectClass=inetOrgPerson)(departmentNumber=Engineering)(title=*Engineer*))"
    });
    engineeringEngineers.searchEntries.forEach(entry => {
      console.log(`   - ${entry.cn}: ${entry.title} in ${entry.departmentNumber}`);
    });

    // 4. OR filter
    console.log("\n4. Find users named John OR Jane:");
    const johnOrJane = await this.client.search(baseDN, { 
      filter: "(|(givenName=John)(givenName=Jane))"
    });
    johnOrJane.searchEntries.forEach(entry => {
      console.log(`   - ${entry.givenName} ${entry.sn} (${entry.mail})`);
    });

    // 5. NOT filter
    console.log("\n5. Find users NOT in Engineering department:");
    const nonEngineering = await this.client.search(baseDN, { 
      filter: "(&(objectClass=inetOrgPerson)(!(departmentNumber=Engineering)))"
    });
    nonEngineering.searchEntries.forEach(entry => {
      console.log(`   - ${entry.cn}: ${entry.title} in ${entry.departmentNumber}`);
    });

    // 6. Presence filter (has attribute)
    console.log("\n6. Find entries that have an email address:");
    const withEmail = await this.client.search(baseDN, { filter: "(mail=*)" });
    console.log(`   Found ${withEmail.searchEntries.length} entries with email addresses`);

    // 7. Substring search
    console.log("\n7. Find entries with 'example.org' in email:");
    const orgEmails = await this.client.search(baseDN, { filter: "(mail=*example.org*)" });
    orgEmails.searchEntries.forEach(entry => {
      console.log(`   - ${entry.cn}: ${entry.mail}`);
    });
  }

  // Group membership analysis
  async analyzeGroups() {
    if (!this.client) throw new Error("Not connected");

    console.log("\n👥 Group Membership Analysis:");

    const groups = await this.client.search("ou=Groups,dc=example,dc=org", { filter: "(objectClass=groupOfNames)" });
    
    for (const group of groups.searchEntries) {
      console.log(`\n📋 Group: ${group.cn}`);
      console.log(`   Description: ${group.description}`);
      
      if (group.member) {
        const members = Array.isArray(group.member) ? group.member : [group.member];
        console.log(`   Members (${members.length}):`);
        
        for (const memberDN of members) {
          try {
            const memberSearch = await this.client.search(memberDN.toString(), { 
              filter: "(objectClass=*)", 
              scope: "base" 
            });
            if (memberSearch.searchEntries.length > 0) {
              const member = memberSearch.searchEntries[0];
              console.log(`     - ${member.cn} (${member.mail}) - ${member.title}`);
            }
          } catch (error) {
            console.log(`     - ${memberDN} (could not resolve details)`);
          }
        }
      } else {
        console.log("   No members found");
      }
    }
  }

  // Create a new test user
  async createTestUser() {
    if (!this.client) throw new Error("Not connected");

    const testUserDN = "cn=Test User,ou=People,dc=example,dc=org";
    
    // Check if user already exists
    try {
      const existing = await this.client.search(testUserDN, { 
        filter: "(objectClass=*)", 
        scope: "base" 
      });
      if (existing.searchEntries.length > 0) {
        console.log("⚠️  Test user already exists, skipping creation");
        return testUserDN;
      }
    } catch (error) {
      // User doesn't exist, which is what we want
    }

    try {
      await this.client.add(testUserDN, {
        objectClass: ["inetOrgPerson"],
        cn: "Test User",
        sn: "User",
        givenName: "Test",
        mail: "test.user@example.org",
        uid: "testuser",
        userPassword: "testpass123",
        employeeNumber: "9999",
        title: "Test Engineer",
        departmentNumber: "Testing"
      });
      console.log("✅ Created test user successfully");
      return testUserDN;
    } catch (error: any) {
      console.log("❌ Failed to create test user:", error.message);
      throw error;
    }
  }

  // Delete the test user
  async deleteTestUser() {
    if (!this.client) throw new Error("Not connected");

    const testUserDN = "cn=Test User,ou=People,dc=example,dc=org";
    
    try {
      await this.client.del(testUserDN);
      console.log("✅ Deleted test user successfully");
    } catch (error: any) {
      console.log("⚠️  Could not delete test user:", error.message);
    }
  }

  // Compare operations
  async demonstrateCompare() {
    if (!this.client) throw new Error("Not connected");

    console.log("\n🔍 Compare Operations:");
    
    const johnDN = "cn=John Doe,ou=People,dc=example,dc=org";
    
    // Test various comparisons
    const comparisons = [
      { attribute: 'cn', value: 'John Doe' },
      { attribute: 'sn', value: 'Doe' },
      { attribute: 'givenName', value: 'John' },
      { attribute: 'mail', value: 'john.doe@example.org' },
      { attribute: 'title', value: 'Software Engineer' },
      { attribute: 'title', value: 'Manager' }, // This should be false
    ];

    for (const comp of comparisons) {
      try {
        const result = await this.client.compare(johnDN, comp.attribute, comp.value);
        console.log(`   ${comp.attribute}='${comp.value}': ${result ? '✅ Match' : '❌ No match'}`);
      } catch (error: any) {
        console.log(`   ${comp.attribute}='${comp.value}': ⚠️ Error - ${error.message}`);
      }
    }
  }
}

async function demonstrateWorkingOperations() {
  const explorer = new WorkingLdapExamples();
  
  try {
    await explorer.connect();
    console.log("🔗 Connected to LDAP server");

    // Test user authentication
    console.log("\n🔐 Testing Authentication:");
    const johnDN = "cn=John Doe,ou=People,dc=example,dc=org";
    const authResult = await explorer.authenticateUser(johnDN, "password123");
    console.log(`John Doe auth with correct password: ${authResult ? '✅ Success' : '❌ Failed'}`);
    
    const wrongAuthResult = await explorer.authenticateUser(johnDN, "wrongpass");
    console.log(`John Doe auth with wrong password: ${wrongAuthResult ? '✅ Success' : '❌ Failed (expected)'}`);

    // Demonstrate various search operations
    await explorer.searchOperations();

    // Analyze group memberships
    await explorer.analyzeGroups();

    // Create, test, and delete a user
    console.log("\n🛠️ User Lifecycle (Create/Delete):");
    const testUserDN = await explorer.createTestUser();
    
    // Test authentication with the new user
    if (testUserDN) {
      const testAuth = await explorer.authenticateUser(testUserDN, "testpass123");
      console.log(`Test user authentication: ${testAuth ? '✅ Success' : '❌ Failed'}`);
    }
    
    await explorer.deleteTestUser();

    // Demonstrate compare operations
    await explorer.demonstrateCompare();

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  } finally {
    await explorer.disconnect();
    console.log("\n🔌 Disconnected from LDAP server");
  }
}

// Run if this file is executed directly
if (require.main === module) {
  demonstrateWorkingOperations();
}

export { WorkingLdapExamples };
