//角色工具包
import * as http from "./http";

//获取所有角色信息
export const getRoles = () => {
    return http.get('/sys/role/getRoles');
};

//新增保存职能信息
export const addRole = (role) => {
    return http.post('/sys/role/add', role);
};

//修改保存职能信息
export const editRole = (role) => {
    return http.post('/sys/role/edit', role);
};

//获取所有角色用户
export const getRoleUsers = (roleId) => {
    return http.get('/sys/role/getRoleUsers', {id: roleId});
};

//批量添加角色用户信息
export const addBatchUsers = (roleId,userIds) => {
    return http.post('/sys/role/addBatchUsers',{roleId,userIds:userIds});
};

//移除角色用户信息
export const deleteUsers = (roleId,userIds) => {
    return http.post('/sys/role/deleteUsers', {roleId: roleId,userIds:userIds});
};