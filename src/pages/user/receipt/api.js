import Ajax from "Utils/ajax";

export const getInvoiceStatus = () => Ajax.post('list/fetchInvoiceStatus');

export const getReceiptListByAdmin = (data) => Ajax.post('list/getReceiptListByAdmin', data);

export const searchCompanies = (data) => Ajax.post('misc/icsplist',data);

export const exportReceipts = (data) => Ajax.post(`admin/exportReceipts`,data);

export const fetchReceiptByInvoiceId = (data) => Ajax.post(`webuser/fetchReceiptByInvoiceId`,data);