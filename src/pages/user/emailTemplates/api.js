import Ajax from "Utils/ajax";

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getEmailTemplates = (data) => Ajax.post(`list/getEmailTemplateList`, data);

export const addEmailTemplate = (data) => Ajax.post("master/addEmailTemplate", data);

export const fetchEmailTemplateByID = (id) => Ajax.get(`master/fetchEmailTemplateByID/${id}`);

export const editEmailTemplate = (data) => Ajax.post("master/editEmailTemplateByID", data);

export const deleteEmailTemplateByID = (id) => Ajax.get(`master/deleteEmailTemplateByID/${id}`);