import Ajax from "Utils/ajax";

export const updatePreview = (data) => Ajax.post('admin/updatePreview', data);

export const processTicketAfterFinalResponse = (data) => Ajax.post('admin/processTicketAfterFinalResponse', data);