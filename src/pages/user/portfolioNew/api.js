import Ajax from "Utils/ajax";

export const getDepartmentList = () => Ajax.get('misc/departmentlist');

export const getProcessTypes = (data) => Ajax.post('list/fetchProcessType', data);

export const getProcesses = (data) => Ajax.post('list/fetchSubProcess', data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

export const getICSPLicenses = (data) => Ajax.post('list/getICSPLicenses',data);

export const addPortfolioRule = (data) => Ajax.post('admin/addPortfolioRule',data);

export const editPortfolioRule = (data) => Ajax.post('admin/editPortfolioRule',data);

export const listPortfolioRule = (data) => Ajax.post('admin/listPortfolioRule',data);

export const deletePortfolioRuleById = (data) => Ajax.post('admin/deletePortfolioRuleById',data);

export const fetchPortfolioRuleById = (data) => Ajax.post('admin/fetchPortfolioRuleById',data);

export const getNotificationGroupList = (data) => Ajax.post('list/getNotificationGroupList',data);






