import { Client, SearchOptions } from 'ldapts';
import { createSampleData } from './createSampleData';

const ldapUrl = "ldap://localhost:389";
const baseDN = "dc=example,dc=org";
const adminDN = "cn=admin,dc=example,dc=org";
const adminPassword = "admin";

const client = new Client({
  url: ldapUrl
});

async function run() {
  await client.bind(adminDN, adminPassword);

  // Only create sample data if needed (comment out if data already exists)
  // await createSampleData();
  
  console.log("Search for bob wilson by UID");
  await searchByUid('bwilson');

  let uid = 'bwilson'
  const dn = 'ou=People,dc=example,dc=org';
  console.log(`Check if uid ${uid} exists in dn ${dn}`);

    let existsResult = await exists(uid, dn);
    console.log(`Exists result for uid ${uid} in dn ${dn}: ${existsResult}`);

console.log(`Check if uid ${uid} exists in dn ${dn}`)    

uid = 'atabilog'
existsResult = await exists(uid, dn);
    console.log(`Exists result for uid ${uid} in dn ${dn}: ${existsResult}`);


  await client.unbind();
}

async function searchAllPeople() {
console.log("Search for all people by UID:");
  const allPeople = await client.search("ou=People,dc=example,dc=org", {
    filter: '(uid=*)',
    scope: 'sub',
    attributes: ['dn', 'cn', 'mail']
  });
  console.log('All People Search Result by UID:', allPeople);
}

async function searchByUid(uid: string) {
  console.log(`Search for user by UID: ${uid}`);
  const user = await client.search("ou=People,dc=example,dc=org", {
    filter: `(uid=${uid})`,
    scope: 'sub',
    attributes: ['dn', 'cn', 'mail', 'uid']
  });
  console.log(`Found ${user.searchEntries.length} entries for UID ${uid}:`);
  user.searchEntries.forEach((entry, index) => {
    console.log(`  ${index + 1}. DN: ${entry.dn}`);
    console.log(`     CN: ${entry.cn}`);
    console.log(`     UID: ${entry.uid}`);
    console.log(`     Mail: ${entry.mail}`);
  });
  return user;
}

async function exists(uid: string, dn: string) {
    console.log(`Checking if user exists by UID: ${uid} in DN: ${dn}`);

    try {
        const result = await client.search(dn, {
            filter: `(uid=${uid})`,
            scope: 'sub',
            attributes: ['1.1'] // Request no attributes, just check existence
        });
        return result.searchEntries.length > 0;
    } catch (err: any) {
        console.error("ldap error with exists check", {
            uid,
            error: err.message,
            code: err.code
        });
        if (err.code === 32) { // No such object
            return false; // because the UID does not exist
        }
        // Otherwise, re-throw any other error (connection, permissions, etc.)
        throw err;
    }
}


run().catch(console.error);
