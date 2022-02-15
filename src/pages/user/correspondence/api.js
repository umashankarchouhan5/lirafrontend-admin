import Ajax from "Utils/ajax";

//export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/131'); // later

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompanies = () => Ajax.get('list/getcompanies');

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const getCorrespondenceList = (data) => Ajax.post('list/getCorrespondencelist', data);

export const reSendEmailByAdmin = (data) => Ajax.post('admin/reSendEmailByAdmin', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getCompanyRegName = (data) => Ajax.post('company/getCompanyRegName', data);