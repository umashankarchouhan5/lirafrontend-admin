import Ajax from "Utils/ajax";

export const getCompanyCalendarList = (data) => Ajax.post('list/getCompanyCalendarList',data);

export const getCompanyStatus = (data) => Ajax.post('list/fetchAdminFilterStatusList', data);

// export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/101');

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const assignTask = (data) => Ajax.post('admin/assignDeadline',data);

export const getCalendarHistory = (data) => Ajax.post('admin/getCalendarHistory',data);

export const getDateType = () => Ajax.get('list/fetchDefinitionChildrenByName/datetype');

export const getICSPLicenses = (data) => Ajax.post('list/getICSPLicenses',data);