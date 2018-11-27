[@splunk/cloud-sdk](../README.md) > [IdentityService](../classes/identityservice.md)

# Class: IdentityService

Encapsulates Identity endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ IdentityService**

## Index

### Constructors

* [constructor](identityservice.md#constructor)

### Properties

* [client](identityservice.md#client)

### Methods

* [addGroupMember](identityservice.md#addgroupmember)
* [addMember](identityservice.md#addmember)
* [addRolePermission](identityservice.md#addrolepermission)
* [addRoleToGroup](identityservice.md#addroletogroup)
* [createGroup](identityservice.md#creategroup)
* [createPrincipal](identityservice.md#createprincipal)
* [createRole](identityservice.md#createrole)
* [createTenant](identityservice.md#createtenant)
* [deleteGroup](identityservice.md#deletegroup)
* [deletePrincipal](identityservice.md#deleteprincipal)
* [deleteRole](identityservice.md#deleterole)
* [deleteTenant](identityservice.md#deletetenant)
* [getGroup](identityservice.md#getgroup)
* [getGroupMember](identityservice.md#getgroupmember)
* [getGroupMembers](identityservice.md#getgroupmembers)
* [getGroupRole](identityservice.md#getgrouprole)
* [getGroupRoles](identityservice.md#getgrouproles)
* [getGroups](identityservice.md#getgroups)
* [getMember](identityservice.md#getmember)
* [getMemberGroups](identityservice.md#getmembergroups)
* [getMembers](identityservice.md#getmembers)
* [getPrincipal](identityservice.md#getprincipal)
* [getPrincipals](identityservice.md#getprincipals)
* [getRole](identityservice.md#getrole)
* [getRolePermission](identityservice.md#getrolepermission)
* [getRolePermissions](identityservice.md#getrolepermissions)
* [getRoles](identityservice.md#getroles)
* [getTenant](identityservice.md#gettenant)
* [getTenants](identityservice.md#gettenants)
* [removeGroupMember](identityservice.md#removegroupmember)
* [removeGroupRole](identityservice.md#removegrouprole)
* [removeMember](identityservice.md#removemember)
* [removeRolePermission](identityservice.md#removerolepermission)
* [validate](identityservice.md#validate)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new IdentityService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [IdentityService](identityservice.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [IdentityService](identityservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="addgroupmember"></a>

###  addGroupMember

▸ **addGroupMember**(groupName: *`string`*, groupMemberName: *[GroupMemberName](../interfaces/groupmembername.md)*): `Promise`<[GroupMember](../interfaces/groupmember.md)>

Adds a member to the group

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |
| groupMemberName | [GroupMemberName](../interfaces/groupmembername.md) |  String name of group member |

**Returns:** `Promise`<[GroupMember](../interfaces/groupmember.md)>
a GroupMember object

___
<a id="addmember"></a>

###  addMember

▸ **addMember**(memberName: *[MemberName](../interfaces/membername.md)*): `Promise`<[Member](../interfaces/member.md)>

Adds a member to the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| memberName | [MemberName](../interfaces/membername.md) |  input object of a member |

**Returns:** `Promise`<[Member](../interfaces/member.md)>
a Member object

___
<a id="addrolepermission"></a>

###  addRolePermission

▸ **addRolePermission**(roleName: *`string`*, permission: *`string`*): `Promise`<[RolePermission](../interfaces/rolepermission.md)>

Adds permissions to an existing role in this tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleName | `string` |  String name of a role |
| permission | `string` |  String name of a permission |

**Returns:** `Promise`<[RolePermission](../interfaces/rolepermission.md)>
A promise that resolves upon deletion

___
<a id="addroletogroup"></a>

###  addRoleToGroup

▸ **addRoleToGroup**(groupName: *`string`*, roleName: *[RoleName](../interfaces/rolename.md)*): `Promise`<[GroupRole](../interfaces/grouprole.md)>

Adds a role to the group

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |
| roleName | [RoleName](../interfaces/rolename.md) |  String name of a role |

**Returns:** `Promise`<[GroupRole](../interfaces/grouprole.md)>
GroupRole

___
<a id="creategroup"></a>

###  createGroup

▸ **createGroup**(groupInput: *[GroupInput](../interfaces/groupinput.md)*): `Promise`<[Group](../interfaces/group.md)>

Creates a new group in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupInput | [GroupInput](../interfaces/groupinput.md) |  The group params for creating a new group |

**Returns:** `Promise`<[Group](../interfaces/group.md)>
A promise that resolves upon deletion

___
<a id="createprincipal"></a>

###  createPrincipal

▸ **createPrincipal**(principalInput: *[PrincipalInput](../interfaces/principalinput.md)*): `Promise`<[Principal](../interfaces/principal.md)>

Create a new principal

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| principalInput | [PrincipalInput](../interfaces/principalinput.md) |  \- |

**Returns:** `Promise`<[Principal](../interfaces/principal.md)>
a Principal object

___
<a id="createrole"></a>

###  createRole

▸ **createRole**(roleInput: *[RoleInput](../interfaces/roleinput.md)*): `Promise`<[Role](../interfaces/role.md)>

Creates a new authorization role in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleInput | [RoleInput](../interfaces/roleinput.md) |  The role params for creating a new role |

**Returns:** `Promise`<[Role](../interfaces/role.md)>
a Role object

___
<a id="createtenant"></a>

###  createTenant

▸ **createTenant**(tenantName: *[TenantName](../interfaces/tenantname.md)*): `Promise`<[Tenant](../interfaces/tenant.md)>

Creates a tenant and default roles/groups

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tenantName | [TenantName](../interfaces/tenantname.md) |  unique identifier of the tenant |

**Returns:** `Promise`<[Tenant](../interfaces/tenant.md)>
a Tenant object

___
<a id="deletegroup"></a>

###  deleteGroup

▸ **deleteGroup**(groupName: *`string`*): `Promise`<`any`>

Deletes a group in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="deleteprincipal"></a>

###  deletePrincipal

▸ **deletePrincipal**(principalName: *`string`*): `Promise`<`any`>

Deletes a principal

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| principalName | `string` |  \- |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="deleterole"></a>

###  deleteRole

▸ **deleteRole**(roleName: *`string`*): `Promise`<`any`>

Delete an authorization role in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleName | `string` |  String name of a role |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="deletetenant"></a>

###  deleteTenant

▸ **deleteTenant**(tenantName: *`string`*): `Promise`<`any`>

Delete the tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tenantName | `string` |  unique identifier of the tenant |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="getgroup"></a>

###  getGroup

▸ **getGroup**(groupName: *`string`*): `Promise`<[Group](../interfaces/group.md)>

Defines a group in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |

**Returns:** `Promise`<[Group](../interfaces/group.md)>
a Group object

___
<a id="getgroupmember"></a>

###  getGroupMember

▸ **getGroupMember**(groupName: *`string`*, groupMemberName: *`string`*): `Promise`<[GroupMember](../interfaces/groupmember.md)>

Returns group-member relationship details

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |
| groupMemberName | `string` |  String name of group member |

**Returns:** `Promise`<[GroupMember](../interfaces/groupmember.md)>
a GroupMember object

___
<a id="getgroupmembers"></a>

###  getGroupMembers

▸ **getGroupMembers**(groupName: *`string`*): `Promise`<`string`[]>

Lists the members in the given group

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |

**Returns:** `Promise`<`string`[]>
a list of group members

___
<a id="getgrouprole"></a>

###  getGroupRole

▸ **getGroupRole**(groupName: *`string`*, roleName: *`string`*): `Promise`<[GroupRole](../interfaces/grouprole.md)>

Returns group-role relationship details

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |
| roleName | `string` |  String name of a role |

**Returns:** `Promise`<[GroupRole](../interfaces/grouprole.md)>
a GroupRole object

___
<a id="getgrouproles"></a>

###  getGroupRoles

▸ **getGroupRoles**(groupName: *`string`*): `Promise`<`string`[]>

Lists the roles attached to the group

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |

**Returns:** `Promise`<`string`[]>
a list of groupRoles

___
<a id="getgroups"></a>

###  getGroups

▸ **getGroups**(): `Promise`<`string`[]>

Lists the groups in the current tenant

**Returns:** `Promise`<`string`[]>
a list of groups

___
<a id="getmember"></a>

###  getMember

▸ **getMember**(memberName: *`string`*): `Promise`<[Member](../interfaces/member.md)>

Get a member of the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| memberName | `string` |  input object of a member |

**Returns:** `Promise`<[Member](../interfaces/member.md)>
a Member object

___
<a id="getmembergroups"></a>

###  getMemberGroups

▸ **getMemberGroups**(memberName: *`string`*): `Promise`<`string`[]>

Returns the list of the member's groups in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| memberName | `string` |  input object of a member |

**Returns:** `Promise`<`string`[]>
a list of Groups

___
<a id="getmembers"></a>

###  getMembers

▸ **getMembers**(): `Promise`<`string`[]>

Returns the list of members in the current tenant

**Returns:** `Promise`<`string`[]>
a list of Members

___
<a id="getprincipal"></a>

###  getPrincipal

▸ **getPrincipal**(principalName: *`string`*): `Promise`<[Principal](../interfaces/principal.md)>

Returns the principal details

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| principalName | `string` |  \- |

**Returns:** `Promise`<[Principal](../interfaces/principal.md)>
a Principal object

___
<a id="getprincipals"></a>

###  getPrincipals

▸ **getPrincipals**(): `Promise`<`string`[]>

Returns the list of principals known to IAC

**Returns:** `Promise`<`string`[]>
a list of principals

___
<a id="getrole"></a>

###  getRole

▸ **getRole**(roleName: *`string`*): `Promise`<[Role](../interfaces/role.md)>

Get a role for the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleName | `string` |  String name of a role |

**Returns:** `Promise`<[Role](../interfaces/role.md)>
a Role object

___
<a id="getrolepermission"></a>

###  getRolePermission

▸ **getRolePermission**(roleName: *`string`*, permissionName: *`string`*): `Promise`<[RolePermission](../interfaces/rolepermission.md)>

Get a permission for the current tenant, role name, and permission name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleName | `string` |  String name of a role |
| permissionName | `string` |  String name of a permission |

**Returns:** `Promise`<[RolePermission](../interfaces/rolepermission.md)>
a RolePermission object

___
<a id="getrolepermissions"></a>

###  getRolePermissions

▸ **getRolePermissions**(roleName: *`string`*): `Promise`<`string`[]>

Get all the permissions for a current tenant and role name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleName | `string` |  String name of a role |

**Returns:** `Promise`<`string`[]>
A list of permissions

___
<a id="getroles"></a>

###  getRoles

▸ **getRoles**(): `Promise`<`string`[]>

Get all roles for the current tenant

**Returns:** `Promise`<`string`[]>
A list of roles

___
<a id="gettenant"></a>

###  getTenant

▸ **getTenant**(tenantName: *`string`*): `Promise`<[Tenant](../interfaces/tenant.md)>

Returns the tenant details

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tenantName | `string` |  unique identifier of the tenant |

**Returns:** `Promise`<[Tenant](../interfaces/tenant.md)>
a Tenant object

___
<a id="gettenants"></a>

###  getTenants

▸ **getTenants**(): `Promise`<`string`[]>

Returns the list of tenants in the system

**Returns:** `Promise`<`string`[]>
a list of tenant names

___
<a id="removegroupmember"></a>

###  removeGroupMember

▸ **removeGroupMember**(groupName: *`string`*, groupMemberName: *`string`*): `Promise`<`any`>

Removes the member from the group

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |
| groupMemberName | `string` |  String name of group member |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="removegrouprole"></a>

###  removeGroupRole

▸ **removeGroupRole**(groupName: *`string`*, roleName: *`string`*): `Promise`<`any`>

Removes the role from the group

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| groupName | `string` |  String name of a group |
| roleName | `string` |  String name of a role |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="removemember"></a>

###  removeMember

▸ **removeMember**(memberName: *`string`*): `Promise`<`any`>

Removes a member from the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| memberName | `string` |  input object of a member |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="removerolepermission"></a>

###  removeRolePermission

▸ **removeRolePermission**(roleName: *`string`*, permissionName: *`string`*): `Promise`<`any`>

Remove an authorization role in the current tenant

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| roleName | `string` |  String name of a role |
| permissionName | `string` |  \- |

**Returns:** `Promise`<`any`>
A promise that resolves upon deletion

___
<a id="validate"></a>

###  validate

▸ **validate**(): `Promise`<[ValidateInfo](../interfaces/validateinfo.md)>

Validates the access token obtained from authorization header and returns the principal name and tenant memberships

**Returns:** `Promise`<[ValidateInfo](../interfaces/validateinfo.md)>
a ValidateInfo object

___

