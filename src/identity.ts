/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { IDENTITY_SERVICE_CLUSTER, IdentityServiceGen } from './generated/identity/v2beta1/api';
import * as identityModels from './models/identity';

export { identityModels };

/**
 * Encapsulates Identity service endpoints.
 */
export class IdentityService extends IdentityServiceGen {
    /**
     * Adds permissions to a role in the current tenant.
     * @param role The role name.
     * @param body The permission to add to a role.
     * @return A `RolePermission` object.
     */
    public addRolePermission = (role: string, body: string): Promise<identityModels.RolePermission> => {
        // NOTE: this function must send body as a quoted string, hence this override
        const pathParams = {
            role
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}/permissions`(pathParams);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), `"${body}"`)
            .then(response => response.body as identityModels.RolePermission);
    }
}
