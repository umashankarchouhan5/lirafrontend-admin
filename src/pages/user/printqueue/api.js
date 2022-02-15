import Ajax from "Utils/ajax";

export const getDocumentToPrint = (data) => Ajax.post('admin/GetDocumentToPrint',data);

export const returnPrintDocument = (data) => Ajax.post('admin/returnPrintDocument',data);

export const getCompanies = () => Ajax.get('list/getcompanies');

export const getPrintQueueList = (data) => Ajax.post('list/getPrintQueueList', data);

export const attachPrintDocument = (data) => Ajax.post('admin/attachPrintDocument', data);

export const printDocument = (data) => Ajax.post('admin/PrintDocument', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);