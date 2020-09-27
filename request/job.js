import * as http from './http'

//获取所有职能信息
export const getJobs = () => {
    return http.get('/task/job/getJobs');
};

//新增保存职能信息
export const addJob = (job) => {
    return http.post('/task/job/add', job);
};

//修改保存职能信息
export const editJob = (job) => {
    return http.post('/task/job/edit', job);
};

//删除职能信息
export const deleteJob = (jobId) => {
    return http.get('/task/job/delete', {id: jobId});
};

//获取职能用户列表
export const getJobUsers = (jobId) => {
    return http.get('/task/job/getJobUsers', {id: jobId});
};

//移除用户信息
export const deleteUsers = (jobId,userIds) => {
    return http.post('/task/job/deleteUsers', {jobId: jobId,userIds:userIds});
};

//批量添加用户信息
export const addBatchUsers = (jobId,userIds) => {
    return http.post('/task/job/addBatchUsers', {jobId: jobId,userIds:userIds});
};