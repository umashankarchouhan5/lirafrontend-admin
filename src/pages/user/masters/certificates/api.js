import Ajax from "Utils/ajax";

export const getCertificateList = (data) => Ajax.post('list/getCertificateList',data);

export const editCertificateByID = (data) => Ajax.post('master/editCertificateByID',data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const addCertificate = (data) => Ajax.post("master/addCertificate", data);

export const fetchCertificateByID = (id) => Ajax.get(`master/fetchCertificateByID/${id}`);

export const deleteCertificateByID = (id) => Ajax.get(`master/deleteCertificateByID/${id}`);