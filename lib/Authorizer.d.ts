import * as casbin from 'casbin';
import Permission from './Permission';
import { StringKV } from './types';
declare type Mode = "auto" | "cookies" | "manual";
export declare class Authorizer {
    mode: Mode;
    endpoint: string | undefined;
    permission: Permission | undefined;
    cookieKey: string | undefined;
    cacheExpiredTime: number;
    user: string | undefined;
    enforcer: casbin.Enforcer | undefined;
    /**
     *
     * @param mode "auto", "cookies" or "manual"
     * "auto": Specify the casbin server endpoint, and Casbin.js will load permission from it when the identity changes
     * "cookies": Casbin.js load the permission data from the cookie "access_perm" or the specified cookie key.
     * "manual": Load the permission mannually with "setPermission"
     * @param args.endpoint Casbin service endpoint, REQUIRED when mode == "auto"
     * @param args.cacheExpiredTime The expired time of local cache, Unit: seconds, Default: 60s, activated when mode == "auto"
     * @param args.cookieKey The cookie key when loading permission, activated when mode == "cookies"
     */
    constructor(mode?: Mode, args?: {
        endpoint?: string;
        cacheExpiredTime?: number;
    });
    /**
     * Get the permission.
     */
    getPermission(): StringKV;
    setPermission(permission: Record<string, unknown> | string): void;
    initEnforcer(s: string): Promise<void>;
    /**
     * Initialize the enforcer
     */
    getEnforcerDataFromSvr(): Promise<string>;
    /**
     * Set the user subject for the authroizer
     * @param user The current user
     */
    setUser(user: string): Promise<void>;
    can(action: string, object: string): Promise<boolean>;
    cannot(action: string, object: string): Promise<boolean>;
    canAll(action: string, objects: string[]): Promise<boolean>;
    canAny(action: string, objects: string[]): Promise<boolean>;
}
export {};
