//公共组件接口工具包
import {get, post} from '@/request/http'

//通用后端重复值验证
export const duplicateCheck = (params) => {
    return get("/sys/duplicate/check", params);
};

//通用用户取码获取数据接口
export const selectUser = (departId, selectedUserIds) => {
    return post("/sys/common/user/select", {
        departId: departId,
        selectedUserIds: selectedUserIds
    })
};

//通用用户关键字查找
export const userKeyword = (keyword) => {
    return get("/sys/common/user/keyword", {keyword: keyword});
};

//通用部门关键字查找
export const departKeyword = (keyword) => {
    return get("/sys/common/depart/keyword", {keyword: keyword});
};

//通用部门树获取
export const departTree = (departId) => {
    return get("/sys/sysDepart/queryTreeList", {departId: departId});
};

//获取当前用户所有公司或团体数组
export const companyList = () => {
    return get("/sys/common/company/list");
};

//切换用户公司
export const switchCompany = (companyId) => {
    return get("/sys/common/company/switch",{companyId:companyId});
};