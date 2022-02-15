import Ajax from "Utils/ajax";

export const closeticket = (data) => Ajax.post('admin/closeticket',data); 

export const SelfAssignTicket = (data) => Ajax.post('admin/SelfAssignTicket',data);  

export const assignTicket = (data) => Ajax.post('admin/AssignTicket',data);  

export const viewSignedAttachment = (data) => Ajax.post('admin/ViewSignedAttachment', data);

export const getTasks = (data) => Ajax.post('admin/filtertasks', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const getStatuses = (data) => Ajax.post('list/fetchAdminFilterStatusList', data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getProcessTypes = (data) => Ajax.post('list/fetchProcessType', data);

export const getProcesses = (data) => Ajax.post('list/fetchSubProcess', data);

export const exportexcel = (data) => Ajax.post('utilities/exportexcel', data);

export const assignMultipleTicket = (data) => Ajax.post('admin/assignMultipleTicket', data);

export const getSigneeList = (data) => Ajax.post('list/getSigneeList', data);

export const generateFinalResponse  = (data) => Ajax.post('admin/generateFinalResponse ', data);
// export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

// export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

