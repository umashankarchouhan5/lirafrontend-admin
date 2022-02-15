import Ajax from "Utils/ajax";

export const getComplaintMode = () => Ajax.get('list/fetchDefinitionChildrenByName/ComplaintMode');

export const getDepartmentList = () => Ajax.get('misc/departmentlist');
  
export const createDraft = (data) => Ajax.post('admin/draftRequest', data);

export const submitForm = (data) => Ajax.post('admin/fileComplaint', data);

export const uploadDocument = (data) => Ajax.post('admin/ComplaintStore', data);

export const generateProcessTicket = (data) => Ajax.post('admin/generateProcessTicketAdmin', data);

export const fetchComplaintList = (data) => Ajax.post('list/fetchComplaintList', data);

export const getStatuses = (data) => Ajax.post('list/fetchAdminFilterStatusList', data);

export const getComplaintData = (data) => Ajax.post('admin/getComplaintbyID', data);
 
export const sendComplaintEmailByAdmin = (data) => Ajax.post('admin/SendComplaintEmailByAdmin', data);

export const printLetterBody = (data) => Ajax.post('admin/PrintLetterBody', data);

export const getCompanyStatusList = () => Ajax.get('list/getCompanyStatusList/3');