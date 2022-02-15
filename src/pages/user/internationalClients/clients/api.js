import Ajax from "Utils/ajax";

export const getClientsList = (data) => Ajax.post('admin/getClientsList',data);

export const createIntlClients = (data) => Ajax.post('admin/createIntlClients',data);
