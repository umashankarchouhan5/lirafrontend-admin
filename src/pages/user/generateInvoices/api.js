import Ajax from "Utils/ajax";

export const getICSPLicenses = (data) => Ajax.post('list/getICSPLicenses',data);

export const generateReviewInvoiceAdmin = (data) => Ajax.post('admin/generateReviewInvoiceAdmin',data);

export const sendInvoiceAdminEmail = (data) => Ajax.post('admin/sendInvoiceAdminEmail',data);