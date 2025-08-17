# LDAP Explorer

A TypeScript-based LDAP exploration project using the `ldapts` library and OpenLDAP running in Docker.

## Features

- ✅ OpenLDAP server running in Docker
- ✅ TypeScript client with comprehensive LDAP operations
- ✅ Sample organizational structure with users and groups
- ✅ Multiple search examples and filters
- ✅ Proper error handling and connection management

## Quick Start

### 1. Start the OpenLDAP Server

```bash
# Start the OpenLDAP container
docker-compose -f docker/docker-compose.yml up -d

# Check if it's running
docker-compose -f docker/docker-compose.yml ps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Explorer

```bash
# Run the main application
npx ts-node src/app.ts
```

## Directory Structure Created

The application creates the following LDAP directory structure:

```
dc=example,dc=org (root)
├── ou=People (users container)
│   ├── cn=John Doe (Software Engineer)
│   ├── cn=Jane Smith (Product Manager)
│   └── cn=Bob Wilson (DevOps Engineer)
├── ou=Groups (groups container)
│   ├── cn=Administrators (John Doe, Bob Wilson)
│   ├── cn=Engineering (John Doe, Bob Wilson)
│   └── cn=AllUsers (all users)
└── ou=Applications (application accounts)
```

## Sample Data

### Users

- **John Doe** (`jdoe`) - Software Engineer, Engineering dept
- **Jane Smith** (`jsmith`) - Product Manager, Product dept
- **Bob Wilson** (`bwilson`) - DevOps Engineer, Engineering dept

### Groups

- **Administrators** - System administrators (John, Bob)
- **Engineering** - Engineering team (John, Bob)
- **AllUsers** - All company users (John, Jane, Bob)

## LDAP Operations Examples

The application demonstrates various LDAP operations:

### Basic Connection

```typescript
const ldapClient = new LdapClient();
await ldapClient.connect();
```

### Search Operations

```typescript
// Search all entries
await ldapClient.search(baseDN, "(objectClass=*)");

// Search users only
await ldapClient.search(
  "ou=People,dc=example,dc=org",
  "(objectClass=inetOrgPerson)"
);

// Search with custom filters
await ldapClient.searchByFilter("(title=*Engineer*)");
await ldapClient.searchByFilter("(departmentNumber=Engineering)");
await ldapClient.searchByFilter("(&(objectClass=inetOrgPerson)(givenName=J*))");
```

### Adding Entries

```typescript
await ldapClient.add("cn=New User,ou=People,dc=example,dc=org", {
  objectClass: ["inetOrgPerson"],
  cn: "New User",
  sn: "User",
  givenName: "New",
  mail: "new.user@example.org",
  uid: "nuser",
});
```

## LDAP Filter Examples

| Filter                                                         | Description                        |
| -------------------------------------------------------------- | ---------------------------------- |
| `(objectClass=*)`                                              | All entries                        |
| `(objectClass=inetOrgPerson)`                                  | All users                          |
| `(objectClass=groupOfNames)`                                   | All groups                         |
| `(cn=John*)`                                                   | Entries starting with "John"       |
| `(mail=*@example.org)`                                         | All entries with example.org email |
| `(title=*Engineer*)`                                           | Entries with "Engineer" in title   |
| `(&(objectClass=inetOrgPerson)(departmentNumber=Engineering))` | Users in Engineering dept          |
| `(\|(givenName=John)(givenName=Jane))`                         | Users named John OR Jane           |

## Docker Configuration

The OpenLDAP server is configured with:

- **Base DN**: `dc=example,dc=org`
- **Admin DN**: `cn=admin,dc=example,dc=org`
- **Admin Password**: `admin`
- **Organization**: Example Inc.
- **Port**: 389 (LDAP), 636 (LDAPS)

## Useful Commands

### Docker Management

```bash
# Start LDAP server
docker-compose -f docker/docker-compose.yml up -d

# Stop LDAP server
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Reset data (removes all entries)
docker-compose -f docker/docker-compose.yml down -v
```

### LDAP Utilities (if installed)

```bash
# Search using command line tools
ldapsearch -x -H ldap://localhost:389 -D "cn=admin,dc=example,dc=org" -w admin -b "dc=example,dc=org"

# Add entry using LDIF
ldapadd -x -H ldap://localhost:389 -D "cn=admin,dc=example,dc=org" -w admin -f sample.ldif
```

## Advanced Exploration Ideas

1. **Authentication Testing**

   - Test user authentication with `ldapClient.bind(userDN, userPassword)`
   - Implement password policies

2. **CRUD Operations**

   - Add modify and delete operations
   - Update user attributes
   - Manage group memberships

3. **Schema Exploration**

   - Query available object classes
   - Explore attribute types
   - Custom schema definitions

4. **Performance Testing**

   - Bulk data creation
   - Search performance with indexes
   - Connection pooling

5. **Security Features**
   - TLS/SSL connections
   - Access control lists (ACLs)
   - Password policies

## Troubleshooting

### Common Issues

1. **Connection Refused**

   - Ensure Docker container is running: `docker-compose ps`
   - Check port availability: `netstat -ln | grep 389`

2. **Invalid Credentials**

   - Verify admin password in docker-compose.yml
   - Check base DN configuration

3. **Entry Already Exists**
   - The sample data creation is idempotent
   - Reset data with `docker-compose down -v`

### Reset Environment

```bash
# Stop and remove all data
docker-compose -f docker/docker-compose.yml down -v

# Start fresh
docker-compose -f docker/docker-compose.yml up -d

# Wait for initialization and run
sleep 5 && npx ts-node src/app.ts
```
