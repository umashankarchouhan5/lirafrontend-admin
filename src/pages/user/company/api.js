import Ajax from "Utils/ajax";

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/101');

export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompanies = (data) => Ajax.post('list/getcompanylistreport', data);

export const getCompanyLogs = (data) => Ajax.post('company/getCompanyLog', data);

export const getCompanyDirectors = (data) => Ajax.post('company/getCompanyDirectors', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getCompanyCompliances = (data) => Ajax.post('company/getCompanyCompliances', data);

export const saveCompanyCompliance = (data) => Ajax.post('company/saveCompanyCompliance', data);

export const getCompanyComplianceById = (data) => Ajax.post('company/getCompanyComplianceById', data);

export const deleteCompanyCompliance = (data) => Ajax.post('company/deleteCompanyCompliance', data);

export const getCompanyById = (data) => Ajax.post('company/getCompanyById', data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const exportEntitiesExcel = (data) => Ajax.post('list/exportEntitiesExcel', data);
