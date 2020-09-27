//部门工具包
import * as http from "./http";

//新增保存部门信息
export const addDepart = (depart) => {
    return http.post('/sys/sysDepart/add', depart);
};

//修改保存部门信息
export const editDepart = (depart) => {
    return http.post('/sys/sysDepart/edit', depart);
};

//排序保存部门信息
export const sortDepart = (departs) => {
    return http.post('/sys/sysDepart/sort', departs);
};

//根据部门ID删除部门信息
export const deleteDepart = (departId) => {
    return http.del('/sys/sysDepart/delete', {id: departId});
};

//根据部门ID获取用户数
export const userCount = (departId) => {
    return http.get('/sys/sysDepart/userCount', {departId: departId});
};