//部门工具包
import * as http from "./http";

/**
 * 用户分页
 * @param params 传入参数
 * @returns {*}
 */
export const getPage = (params) => {
    return http.get('/sys/user/page', params);
};

/**
 * 用户添加
 * @param user
 * @returns {*}
 */
export const createUser = (user) => {
    return http.post('/sys/user/create', user);
};

/**
 * 用户修改
 * @param user
 * @returns {*}
 */
export const modifyUser = (user) => {
    return http.post('/sys/user/modify', user);
};

/**
 * 通过用户ID获取用户信息
 * @param userId
 * @returns {*}
 */
export const getUser = (userId) => {
    return http.get('/sys/user/getModify', {userId: userId});
};

/**
 * 用户批量启用和禁用操作
 * @param userIds 用户ids
 * @param status 更改后状态
 * @returns {*}
 */
export const statusBatch = (userIds, status) => {
    let params = new URLSearchParams();
    params.append("ids", userIds);
    params.append("status", status);
    return http.put('/sys/user/statusBatch', params);
};

/**
 * 用户批量部门转换操作
 * @param userIds 用户ids
 * @param departId 部门ID
 * @returns {*}
 */
export const departBatch = (userIds, departId) => {
    let params = new URLSearchParams();
    params.append("ids", userIds);
    params.append("depId", departId);
    return http.put('/sys/user/departBatch', params);

};