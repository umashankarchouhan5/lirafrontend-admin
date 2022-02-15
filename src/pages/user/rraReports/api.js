import Ajax from "Utils/ajax";

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getReports = (data) => Ajax.post('admin/getRAResignationReport', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const generateRRANotice = (data) => Ajax.post('admin/generateRRANotice', data);

export const updateRRAGazette = (data) => Ajax.post('admin/updateRRAGazette', data);