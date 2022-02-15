import Ajax from "Utils/ajax";

export const fetchCustomerCodeList = (data) => Ajax.post('admin/fetchCustomerCodeList', data);

export const assignNewWalletCode = (data) => Ajax.post('admin/assignNewWalletCode', data);

export const fetchClientLedger = (data) => Ajax.post('webuser/fetchClientLedger', data);

export const updateWalletCodeNOpeningBalance = (data) => Ajax.post('admin/updateWalletCodeNOpeningBalance', data);

export const checkWalletBalance = (data) => Ajax.post('webuser/checkWalletBalance',data);
