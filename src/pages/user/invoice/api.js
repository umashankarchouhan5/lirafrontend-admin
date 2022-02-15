import Ajax from "Utils/ajax";

export const getInvoiceStatus = () => Ajax.post('list/fetchInvoiceStatus');

export const getInvoiceListByAdmin = (data) => Ajax.post('list/getInvoiceListByAdmin', data);

export const searchCompanies = (data) => Ajax.post('misc/icsplist',data);

export const exportInvoices = (data) => Ajax.post(`webuser/exportInvoices`,data);

export const fetchReceiptByInvoiceId = (data) => Ajax.post(`webuser/fetchReceiptByInvoiceId`,data);

export const exportInvoicesExcel = (data) => Ajax.post(`list/exportInvoicesExcel`,data);