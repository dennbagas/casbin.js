"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Permission = /** @class */ (function () {
    function Permission() {
        this.actObjData = new Map();
        this.objActData = new Map();
    }
    Permission.prototype.load = function (permission) {
        var p;
        if (typeof (permission) == 'string') {
            p = JSON.parse(permission);
        }
        else {
            p = permission;
        }
        // Generate data: {key:Actions, value: Array of objects}
        for (var act in p) {
            this.actObjData.set(act, p[act]);
        }
        // Generate data: {key:Objects, value: Array of actions}
        var tmp = {};
        for (var act in p) {
            for (var obj in p[act]) {
                if (!(obj in tmp)) {
                    tmp[obj] = [];
                }
                tmp[obj].push(act);
            }
        }
        for (var obj in tmp) {
            this.objActData.set(obj, tmp[obj]);
        }
    };
    Permission.prototype.getPermissionJsonObject = function () {
        var obj = {};
        this.actObjData.forEach(function (value, key) { return (obj[key] = value); });
        return obj;
    };
    /*
        Parse the permission into JSON string
    */
    Permission.prototype.getPermissionString = function () {
        return JSON.stringify(this.getPermissionJsonObject());
    };
    Permission.prototype.getTargetsFromAction = function (action) {
        var result = this.actObjData.get(action);
        if (result === undefined) {
            return new Array();
        }
        else {
            return result;
        }
    };
    Permission.prototype.getActionsObjects = function () {
        return this.actObjData;
    };
    Permission.prototype.getObjectsActions = function () {
        return this.objActData;
    };
    Permission.prototype.check = function (action, object) {
        var objects = this.actObjData.get(action);
        if (objects == undefined) {
            return false;
        }
        else {
            return objects.includes(object);
        }
    };
    return Permission;
}());
exports.default = Permission;
