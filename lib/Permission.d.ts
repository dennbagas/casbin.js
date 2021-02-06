import { StringKV } from './types';
export default class Permission {
    private actObjData;
    private objActData;
    constructor();
    load(permission: string | Record<string, unknown>): void;
    getPermissionJsonObject(): StringKV;
    getPermissionString(): string;
    getTargetsFromAction(action: string): Array<string>;
    getActionsObjects(): Map<string, Array<string>>;
    getObjectsActions(): Map<string, Array<string>>;
    check(action: string, object: string): boolean;
}
