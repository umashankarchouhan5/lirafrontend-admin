import Ajax from "Utils/ajax";

export const fetchActionList = () => Ajax.get('list/FetchActionType');

// export const addActions = (data) => Ajax.post('admin/tasks/actions/action',data);
// admin/tasks/fsacreateticket  
export const addActions = (data) => Ajax.post('admin/tasks/fsacreateticket',data);

export const markCompleteAction = (data) => Ajax.post('admin/tasks/actions/completeaction',data);

// export const getActions = (data) =>Ajax.post('admin/tasks/reviews/actions',data);
// admin/tasks/reviews/fsaactions   
export const getActions = (data) =>Ajax.post('admin/tasks/reviews/fsaactions',data);

export const assignTicket = (data) => Ajax.post('admin/AssignTicket',data); 