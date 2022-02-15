import Ajax from "Utils/ajax";

export const generateNotice = (data) => Ajax.post('admin/generateNotice',data);

export const processNotice = (data) => Ajax.post('admin/processNotice',data);

export const getNoticeTypebyDepartment = (data) => Ajax.post('list/getNoticeTypebyDepartment',data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

// New APis

export const sendNotice = (data) => Ajax.post('admin/sendNotice', data);

export const generateNoticeEligible = (data) => Ajax.post('admin/generateNoticeEligible', data);

export const getEligibleByNotice = (data) => Ajax.post('admin/getEligibleByNotice', data);

export const getNoticeList = (data) => Ajax.post('list/getNoticeList', data);

export const getCompanyStatusList = () => Ajax.get('list/getCompanyStatusList/102')

export const getSigneeList = (data) => Ajax.post('list/getSigneeList', data);

export const sendNoticeToPrintqueue = (data) => Ajax.post('admin/sendNoticeToPrintqueue', data);

export const fetchNoticeById = (data) => Ajax.post('admin/fetchNoticeById', data);