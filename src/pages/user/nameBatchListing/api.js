import Ajax from "Utils/ajax";

export const fetchBatchResponse = (data) => Ajax.post('admin/fetchBatchResponse',data);

export const generateLetter = (data) => Ajax.post('admin/generateLetter',data);

export const sendLetter = (data) => Ajax.post('admin/sendLetter', data);
