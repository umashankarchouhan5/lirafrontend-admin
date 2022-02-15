import Ajax from "Utils/ajax";

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getDocuments = (data) => Ajax.post('list/getDocuments', data);

export const getDocumentCategories = () => Ajax.get('list/fetchDefinitionChildrenByName/DocumentCategory');

export const addDocument = (data) => Ajax.post("master/addDocumentType", data);

export const fetchDocumentTypeByCode = (code) => Ajax.get(`master/fetchDocumentTypeByCode/${code}`);

export const editDocument = (data) => Ajax.post("master/editDocumentType", data);

// export const deleteDocument = (code) => Ajax.get(`master/deleteDocumentTypeByCode/${code}`);
export const deleteDocument = (id) => Ajax.get(`master/deleteDocumentType/${id}`);

export const fetchDocumentTypeById = (id) => Ajax.get(`master/fetchDocumentTypeById/${id}`);
