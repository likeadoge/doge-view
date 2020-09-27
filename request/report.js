//统计工具包
import * as http from "./http";

/**
 * 获取报表主页初始化数据
 * @param year 年份
 * @returns {*}
 */
export const getMainData = (year) => {
    return http.get('/task/report/main', {year: year});
};

/**
 * 获取报表项目也初始化数据
 * @param projectId 项目ID
 * @param year 年份
 * @returns {*}
 */
export const getProjectData = (projectId, year) => {
    return http.get('/task/report/project/' + projectId + '/' + year);
};

/**
 * 获取项目list
 * @param status 项目状态
 * @returns {*}
 */
export const getProjectList = (status) => {
    return http.get('/task/report/project/list', {status: status});
};

/**
 * 获取成员负荷
 * @param projectId 项目ID
 * @returns {*}
 */
export const getPagePress = (projectId) => {
    return http.get('/task/report/page/press', {projectId: projectId})
};

/**
 * 获取成员逾期
 * @param projectId 项目ID
 * @returns {*}
 */
export const getPageOverdue = (projectId) => {
    return http.get('/task/report/page/overdue', {projectId: projectId})
};

/**
 * 获取项目任务趋势
 * @param month 当前月份
 * @returns {*}
 */
export const getPageTrend = (month) => {
    return http.get('/task/report/page/trend', {month: month});
};

/**
 * 获取项目燃尽图
 * @param projectId 项目ID
 * @returns {*}
 */
export const getBurnOut = (projectId) => {
    return http.get('/task/report/project/burn/' + projectId);
};