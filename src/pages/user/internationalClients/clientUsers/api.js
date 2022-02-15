import Ajax from "Utils/ajax";

export const getIntlClientUsersList = (data) => Ajax.post('admin/getIntlClientUsersList',data);

export const createIntlClientWebuser = (data) => Ajax.post('admin/createIntlClientWebuser',data);

export const deleteIntlClientWebuser = (data) => Ajax.post('admin/deleteIntlClientWebuser',data);

export const getClientsList = (data) => Ajax.post('admin/getClientsList',data);
