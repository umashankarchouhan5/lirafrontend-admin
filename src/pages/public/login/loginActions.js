import Ajax from "Utils/ajax";

export const loginRequest = data => Ajax.post("admin/login", data);

export const getLogo = (data) => Ajax.post('configs/getCompanyLogo', data, { Authorization: 'Lira' });

export const logoutRequest = data => Ajax.post("admin/logout", data);
