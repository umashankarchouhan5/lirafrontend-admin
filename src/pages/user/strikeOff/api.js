import Ajax from "Utils/ajax";

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/195');

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const generateRRANotice = (data) => Ajax.post('admin/generateRRANotice', data);

export const getStrikeOffList = (data) => Ajax.post('list/getStrikeOffList', data);

export const updateStrikeOffGazette = (data) => Ajax.post('admin/updateStrikeOffGazette', data);

export const strikeOffByAdminUser = (data) => Ajax.post('admin/strikeOffByAdminUser', data);

export const getStrikeOffReason = (data) => Ajax.post('list/getStrikeOffReason', data);

export const fetchMailoutById = (data) => Ajax.post('admin/fetchMailoutById', data);

export const deleteStrikeOffByAdminUser = (data) => Ajax.post('admin/deleteStrikeOffByAdminUser', data);
