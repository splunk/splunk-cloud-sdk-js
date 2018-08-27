const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const splunk = new SplunkSSC(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);

describe('Identity Endpoints', () => {

    describe('Validate a member', () => {
        it('should return a validate info object', () => {
            return splunk.identity.validate(config.stubbyTEST_TENANT).then(data => {
                assert.equal(data.name,'TEST_TENANT', 'tenant should be TEST_TENANT');
                assert.equal(data.tenants[0],'mem1', 'member should be mem1');
                assert.equal(data.tenants[1],'mem2', 'member should be mem2');
            });
        });
    });

    describe('Create a new member', () => {
        it('should return a new member', () => {
            const memberName = {"name": "mem1"};
            return splunk.identity.addMember(config.stubbyTEST_TENANT, memberName).then(data => {
                assert.equal(data.tenant,'TEST_TENANT', 'tenant should be TEST_TENANT');
                assert.equal(data.name,'mem1', 'member should be mem1');
                assert.equal(data.addedAt,'2018-08-15T22:04:17.915Z', 'addedAt should be 2018-08-15T22:04:17.915Z');
                assert.equal(data.addedBy,'test1@splunk.com', 'addedBy should be test1@splunk.com');
            });
        });
    });

    describe('Get a member', () => {
        it('should return a member', () => {
            return splunk.identity.getMember(config.stubbyTEST_TENANT, 'mem1').then(data => {
                assert.equal(data.tenant,'TEST_TENANT', 'tenant should be TEST_TENANT');
                assert.equal(data.name,'mem1', 'member should be mem1');
                assert.equal(data.addedAt,'2006-01-02T15:04:05.999999999Z', 'addedAt should be 2006-01-02T15:04:05.999999999Z');
                assert.equal(data.addedBy,'test1', 'addedBy should be test1');
            });
        });
    });

    describe('Get all members', () => {
        it('should return a list of members', () => {
            return splunk.identity.getMembers(config.stubbyTEST_TENANT).then(data => {
                assert.typeOf(data, 'Array', 'response should be an array');
                assert.equal(data[0], 'mem1', 'members should contain mem1');
                assert.equal(data[1], 'mem2', 'members should contain mem2');
            });
        });
    });

    describe('Delete a member', () => {
        it('should delete a member', () => {
            return splunk.identity.deleteMember(config.stubbyTEST_TENANT, 'mem1').then(response => {
               assert(!response);
            });
        });
    });

    describe('Create a new role', () => {
        it('should return a new role', () => {
            const roleInput = {
                "permissions": [
                    "TEST_TENANT%3A%2A%3Acatalog.%2A",
                    "TEST_TENANT%3A%2A%3Aingest.%2A",
                    "TEST_TENANT%3A%2A%3Asearch.%2A"
                ],
                    "name": "roles.sdk-test"
            };
            return splunk.identity.createRole(config.stubbyTEST_TENANT, roleInput).then(data => {
                assert.equal(data.tenant,'TEST_TENANT', 'tenant should be TEST_TENANT');
                assert.equal(data.name,'roles.sdk-test', 'role name should be roles.sdk-test');
                assert.equal(data.createdAt,'2018-08-15T22:04:17.915Z', 'createdAt should be 2018-08-15T22:04:17.915Z');
                assert.equal(data.createdBy,'test1@splunk.com', 'createdBy should be test1@splunk.com');
            });
        });
    });

    describe('Get a list of roles for a tenant', () => {
        it('should return a list of roles', () => splunk.identity.getRoles(config.stubbyTEST_TENANT).then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.equal(data[0], 'role1', 'role1 should be in the list');
            assert.equal(data[1], 'role2', 'role2 should be in the list');
        }));
    });

    describe('Get a role details', () => {
        it('should return the details for a role', () => splunk.identity.getRole(config.stubbyTEST_TENANT, 'role2').then(data => {
            assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
            assert.equal(data.name, 'role2', 'role name should be role2');
            assert.equal(data.createdAt, '2006-01-02T15:04:05.999999999Z', 'createdAt should be 2006-01-02T15:04:05.999999999Z');
            assert.equal(data.createdBy, 'test1', 'createdBy should be test1');
        }));
    });

    describe('Delete a role from a tenant', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteRole(config.stubbyTEST_TENANT, 'roles.sdk-test').then(response => {
                assert(!response);
            });
        });
    });

    describe('Get a role permissions', () => {
        it('should return a list of roles', () => splunk.identity.getRolePermissions(config.stubbyTEST_TENANT, 'role2').then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.equal(data[0], 'perm1', 'perm1 should be in the perm1');
            assert.equal(data[1], 'perm2', 'perm2 should be in the perm2');
        }));
    });

    describe('Get a role permission details', () => {
        it('should return a list of roles', () => splunk.identity.getRolePermission(config.stubbyTEST_TENANT, 'role2', 'perm2').then(data => {
            assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
            assert.equal(data.role, 'role2', 'role name should be role2');
            assert.equal(data.permission, 'perm2', 'perm2 name should be perm2');
            assert.equal(data.addedAt, '2018-08-15T17:56:19.079Z', 'addedAt should be 2018-08-15T17:56:19.079Z');
            assert.equal(data.addedBy, 'test1', 'addedBy should be test1');
        }));
    });

    describe('Delete a permission from a role', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteRolePermission(config.stubbyTEST_TENANT, 'roles.sdk-test', 'TEST_TENANT:%252A:kvstore.%252A').then(response => {
                assert(!response);
            });
        });
    });

    describe('Create a new group', () => {
        it('should return no response body', () => {
            const postBody = {"name": "sdk-group"};
            return splunk.identity.createGroup(config.stubbyTEST_TENANT, postBody).then(data => {
                assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
                assert.equal(data.name, 'sdk-group', 'group name should be sdk-group');
                assert.equal(data.createdAt, '2018-08-15T22:07:17.062Z', 'createdAt should be 2018-08-15T22:07:17.062Z');
                assert.equal(data.createdBy, 'test1@splunk.com', 'createdBy should be test1@splunk.com');
            });
        });
    });

    describe('Delete a group', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteGroup(config.stubbyTEST_TENANT, 'sdk-group').then(response => {
                assert(!response);
            });
        });
    });

    describe('Get a list of groups for a tenant', () => {
        it('should return a list of groups', () => splunk.identity.getGroups(config.stubbyTEST_TENANT).then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.equal(data[0], 'grp1', 'grp1 should be in the list');
            assert.equal(data[1], 'grp2', 'grp2 should be in the list');
        }));
    });

    describe('Get details for a group', () => {
        it('should return group details', () => splunk.identity.getGroup(config.stubbyTEST_TENANT, 'grp1').then(data => {
            assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
            assert.equal(data.name, 'grp1', 'group name should be grp1');
            assert.equal(data.createdAt, '2018-08-15T18:13:00.453Z', 'createdAt should be 2018-08-15T18:13:00.453Z');
            assert.equal(data.createdBy, 'test1', 'createdBy should be test1');
        }));
    });

    describe('Get group roles for a tenant', () => {
        it('should return a list of roles', () => splunk.identity.getGroupRoles(config.stubbyTEST_TENANT, 'grp1').then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.equal(data[0], 'role1', 'role1 should be in the list');
            assert.equal(data[1], 'role2', 'role2 should be in the list');
        }));
    });

    describe('Remove a role from a group', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteGroupRole(config.stubbyTEST_TENANT, 'sdk-group', 'roles.sdk-test').then(response => {
                assert(!response);
            });
        });
    });

    describe('Get details for a group', () => {
        it('should return group details', () => splunk.identity.getGroup(config.stubbyTEST_TENANT, 'grp1').then(data => {
            assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
            assert.equal(data.name, 'grp1', 'group name should be grp1');
            assert.equal(data.createdAt, '2018-08-15T18:13:00.453Z', 'createdAt should be 2018-08-15T18:13:00.453Z');
            assert.equal(data.createdBy, 'test1', 'createdBy should be test1');
        }));
    });

    describe('Create a new group member', () => {
        it('should return no response body', () => {
            const postBody = {"name": "sdk-int-test@splunk.com",};
            return splunk.identity.addGroupMember(config.stubbyTEST_TENANT, 'sdk-group', postBody).then(data => {
                assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
                assert.equal(data.group, 'sdk-group', 'group name should be sdk-group');
                assert.equal(data.principal, 'sdk-int-test@splunk.com', 'principal should be sdk-int-test@splunk.com');
                assert.equal(data.addedAt, '2018-08-15T22:13:16.536Z', 'addedAt should be 2018-08-15T22:13:16.536Z');
                assert.equal(data.addedBy, 'test1@splunk.com', 'addedBy should be test1@splunk.com');
            });
        });
    });

    describe('Get details for a group member', () => {
        it('should return group member details', () => splunk.identity.getGroupMember(config.stubbyTEST_TENANT, 'grp1', 'mem1').then(data => {
            assert.equal(data.tenant, 'TEST_TENANT', 'tenant should be TEST_TENANT');
            assert.equal(data.group, 'grp1', 'group name should be grp1');
            assert.equal(data.principal, 'mem1', 'group member name should be mem1');
            assert.equal(data.addedAt, '2018-08-15T18:13:00.453Z', 'addedAt should be 2018-08-15T18:13:00.453Z');
            assert.equal(data.addedBy, 'test1', 'addedBy should be test1');
        }));
    });

    describe('Get group members for a tenant', () => {
        it('should return a list of members', () => splunk.identity.getGroupMembers(config.stubbyTEST_TENANT, 'grp1').then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.equal(data[0], 'mem1', 'mem1 should be in the list');
            assert.equal(data[1], 'mem2', 'mem2 should be in the list');
        }));
    });

    describe('Get member groups for a tenant', () => {
        it('should return a list of members', () => splunk.identity.getMemberGroups(config.stubbyTEST_TENANT, 'mem1').then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.equal(data[0], 'group1', 'group1 should be in the list');
            assert.equal(data[1], 'group2', 'group2 should be in the list');
        }));
    });

    describe('Delete a member from a group', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteGroupMember(config.stubbyTEST_TENANT, 'sdk-group', 'sdk-int-test@splunk.com').then(response => {
                assert(!response);
            });
        });
    });

    describe('Create a new principal', () => {
        it('should return no response body', () => {
            const postBody = {"name": "mem1", "kind": "user"};
            return splunk.identity.createPrincipal(postBody).then(data => {
                assert.equal(data.kind, 'user', 'kind should be user');
                assert.equal(data.name, 'mem1', 'principal should be mem1');
                assert.equal(data.createdAt, '2018-08-15T22:07:17.062Z', 'createdAt should be 2018-08-15T22:07:17.062Z');
                assert.equal(data.createdBy, 'test1@splunk.com', 'createdBy should be test1@splunk.com');
                assert.equal(data.profile.ref, "haha", 'profile ref should be haha');
            });
        });
    });

    describe('Get details for a principal', () => {
        it('should return principal details', () => splunk.identity.getPrincipal('mem1').then(data => {
            assert.equal(data.name, 'mem1', 'principal name should be mem1');
            assert.equal(data.kind, 'user', 'kind should be user');
            assert.typeOf(data.tenants, 'Array', 'tenants should be an array');
            assert.equal(data.tenants[0], 'TEST_TENANT', 'tenants should contain TEST_TENANT');
            assert.equal(data.createdAt, '2018-08-15T22:32:15.084Z', 'createdAt should be 2018-08-15T22:32:15.084Z');
            assert.equal(data.createdBy, 'test1@splunk.com', 'createdBy should be test1');
        }));
    });

    describe('Get all principals', () => {
        it('should return principals', () => splunk.identity.getPrincipals().then(data => {
            assert.typeOf(data, 'Array', 'principals should be an array');
            assert.equal(data[0], 'mem1', 'principals should contain mem1');
        }));
    });

    describe('Delete a principal', () => {
        it('should return no response body', () => splunk.identity.deletePrincipal('mem1').then(response => {
            assert(!response);
        }));
    });
});
