import Ajax from "Utils/ajax";

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/174');

export const getDirectiveList = (data) => Ajax.post('list/getEnforcementList', data);

// export const directiveByAdminUser = (data) => Ajax.post('admin/directiveByAdminUser', data);admin/enforcementByAdminUser
export const directiveByAdminUser = (data) => Ajax.post('admin/enforcementByAdminUser', data);

export const fetchEnforcementbyId = (data) => Ajax.post('admin/fetchEnforcementbyId', data);

export const generateDirectiveNotice = (data) => Ajax.post('admin/generateDirectiveNotice', data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const sendEmailByAdmin = (data) => Ajax.post('admin/SendEmailByAdmin', data);

export const getEnforcementType = (data) => Ajax.post('list/getEnforcementType', data);

export const getLicenseeList = (data) => Ajax.post('list/getLicenseeList', data);

export const generateProcessTicket = (data) => Ajax.post('admin/generateProcessTicketAdmin', data);

export const deleteEnforcement = (data) => Ajax.post('admin/deleteEnforcement', data);