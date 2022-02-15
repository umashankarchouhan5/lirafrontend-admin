import Ajax from "Utils/ajax";

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/131');

export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompanies = (data) => Ajax.post('list/getcompanylist', data);

export const getCompanyLogs = (data) => Ajax.post('company/getCompanyLog', data);

export const getCompanyDocs = (data) => Ajax.post('company/getCompanyDocs', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);