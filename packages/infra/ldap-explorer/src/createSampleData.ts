import { Client } from 'ldapts';

const ldapUrl = "ldap://localhost:389"; // Change this if your LDAP server is running on a different host or port
const baseDN = "dc=example,dc=org"; // Updated to match docker-compose.yml domain
const adminDN = "cn=admin,dc=example,dc=org"; // Full admin DN
const adminPassword = "admin"; // Password from docker-compose.yml

interface LdapEntry {
  dn: string;
  attributes: Record<string, any>;
}

class SampleDataCreator {
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

  async add(dn: string, attributes: any) {
    if (!this.client) {
      throw new Error("Not connected to LDAP server");
    }
    return await this.client.add(dn, attributes);
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

  async entryExists(dn: string): Promise<boolean> {
    try {
      const result = await this.search(dn, "(objectClass=*)", "base");
      return result.searchEntries.length > 0;
    } catch (error) {
      return false;
    }
  }

  async createSampleData() {
    console.log("\n🏗️  Creating sample LDAP data...");

    // Create Organizational Units
    const organizationalUnits: LdapEntry[] = [
      {
        dn: "ou=People,dc=example,dc=org",
        attributes: {
          objectClass: ["organizationalUnit"],
          ou: "People",
          description: "Container for user accounts",
        },
      },
      {
        dn: "ou=Groups,dc=example,dc=org",
        attributes: {
          objectClass: ["organizationalUnit"],
          ou: "Groups",
          description: "Container for group objects",
        },
      },
      {
        dn: "ou=Applications,dc=example,dc=org",
        attributes: {
          objectClass: ["organizationalUnit"],
          ou: "Applications",
          description: "Container for application accounts",
        },
      },
    ];

    // Create sample users
    const users: LdapEntry[] = [
      {
        dn: "cn=John Doe,ou=People,dc=example,dc=org",
        attributes: {
          objectClass: ["inetOrgPerson"],
          cn: "John Doe",
          sn: "Doe",
          givenName: "John",
          mail: "john.doe@example.org",
          uid: "jdoe",
          userPassword: "password123",
          employeeNumber: "1001",
          title: "Software Engineer",
          departmentNumber: "Engineering",
        },
      },
      {
        dn: "cn=Jane Smith,ou=People,dc=example,dc=org",
        attributes: {
          objectClass: ["inetOrgPerson"],
          cn: "Jane Smith",
          sn: "Smith",
          givenName: "Jane",
          mail: "jane.smith@example.org",
          uid: "jsmith",
          userPassword: "password456",
          employeeNumber: "1002",
          title: "Product Manager",
          departmentNumber: "Product",
        },
      },
      {
        dn: "cn=Bob Wilson,ou=People,dc=example,dc=org",
        attributes: {
          objectClass: ["inetOrgPerson"],
          cn: "Bob Wilson",
          sn: "Wilson",
          givenName: "Bob",
          mail: "bob.wilson@example.org",
          uid: "bwilson",
          userPassword: "password789",
          employeeNumber: "1003",
          title: "DevOps Engineer",
          departmentNumber: "Engineering",
        },
      },
    ];

    // Create sample groups
    const groups: LdapEntry[] = [
      {
        dn: "cn=Administrators,ou=Groups,dc=example,dc=org",
        attributes: {
          objectClass: ["groupOfNames"],
          cn: "Administrators",
          description: "System administrators group",
          member: [
            "cn=John Doe,ou=People,dc=example,dc=org",
            "cn=Bob Wilson,ou=People,dc=example,dc=org",
          ],
        },
      },
      {
        dn: "cn=Engineering,ou=Groups,dc=example,dc=org",
        attributes: {
          objectClass: ["groupOfNames"],
          cn: "Engineering",
          description: "Engineering team group",
          member: [
            "cn=John Doe,ou=People,dc=example,dc=org",
            "cn=Bob Wilson,ou=People,dc=example,dc=org",
          ],
        },
      },
      {
        dn: "cn=AllUsers,ou=Groups,dc=example,dc=org",
        attributes: {
          objectClass: ["groupOfNames"],
          cn: "AllUsers",
          description: "All company users",
          member: [
            "cn=John Doe,ou=People,dc=example,dc=org",
            "cn=Jane Smith,ou=People,dc=example,dc=org",
            "cn=Bob Wilson,ou=People,dc=example,dc=org",
          ],
        },
      },
    ];

    try {
      // Create OUs first
      for (const ou of organizationalUnits) {
        if (!(await this.entryExists(ou.dn))) {
          await this.add(ou.dn, ou.attributes);
          console.log(`✅ Created OU: ${ou.dn}`);
        } else {
          console.log(`⏭️  OU already exists: ${ou.dn}`);
        }
      }

      // Create users
      for (const user of users) {
        if (!(await this.entryExists(user.dn))) {
          await this.add(user.dn, user.attributes);
          console.log(`✅ Created user: ${user.attributes.cn}`);
        } else {
          console.log(`⏭️  User already exists: ${user.attributes.cn}`);
        }
      }

      // Create groups
      for (const group of groups) {
        if (!(await this.entryExists(group.dn))) {
          await this.add(group.dn, group.attributes);
          console.log(`✅ Created group: ${group.attributes.cn}`);
        } else {
          console.log(`⏭️  Group already exists: ${group.attributes.cn}`);
        }
      }

      console.log("🎉 Sample data creation completed!");
    } catch (error) {
      console.error("❌ Error creating sample data:", error);
      throw error;
    }
  }
}

/**
 * Standalone function to create sample LDAP data
 * Can be run independently or imported into other modules
 */
export async function createSampleData(): Promise<void> {
  const creator = new SampleDataCreator();
  
  try {
    console.log("Connecting to LDAP server for sample data creation...");
    await creator.connect();
    console.log("✅ Connected to LDAP server successfully!");
    
    await creator.createSampleData();
  } catch (error) {
    console.error("❌ Error during sample data creation:", error);
    throw error;
  } finally {
    await creator.disconnect();
    console.log("🔌 Disconnected from LDAP server");
  }
}

// Allow running this file directly
if (require.main === module) {
  createSampleData()
    .then(() => {
      console.log("✅ Sample data creation script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Sample data creation script failed:", error);
      process.exit(1);
    });
}
