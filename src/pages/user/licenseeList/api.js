import Ajax from "Utils/ajax";

export const getLicenseeListReport = (data) => Ajax.post('list/getLicenseeListReport', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/131');

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const exportLicenseeExcel = (data) => Ajax.post('list/exportLicenseeExcel', data);
