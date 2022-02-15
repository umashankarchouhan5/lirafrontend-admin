import Ajax from "Utils/ajax";

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getDocuments = (data) => Ajax.post('admin/getCompanyDoc', data);

export const getDocumentCategories = () => Ajax.get('list/fetchDefinitionChildrenByName/DocumentCategory');

export const fetchDocumentTypeById = (id) => Ajax.get(`master/fetchDocumentTypeById/${id}`);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getCompanyDocArchive = (data) => Ajax.post('admin/getCompanyDocArchive', data);

export const adminStorebylicense = (data) => Ajax.post('admin/adminStorebylicense', data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const fetchPQSearchbyAdmin = (data) => Ajax.post('pqform/fetchPQSearchbyAdmin', data);