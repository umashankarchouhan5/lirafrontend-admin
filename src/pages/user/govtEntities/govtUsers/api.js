import Ajax from "Utils/ajax";

export const getGovtEntityUsersList = (data) => Ajax.post('admin/getGovtEntityUsersList',data);

export const createGovtEntityWebuser = (data) => Ajax.post('admin/createGovtEntityWebuser',data);
