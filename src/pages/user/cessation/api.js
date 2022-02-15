import Ajax from "Utils/ajax";

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/131');

export const getCessationList = (data) => Ajax.post('list/getCessationList', data);

export const cessationRequestAdmin = (data) => Ajax.post('admin/cessationRequestAdmin', data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getStrikeOffReason = (data) => Ajax.post('list/getStrikeOffReason', data);
