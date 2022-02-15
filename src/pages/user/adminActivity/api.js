import Ajax from "Utils/ajax";

export const getAdminActivity = (data) => Ajax.post('admin/getAdminActivity', data);
export const getAdminUsers = () => Ajax.post('admin/getAdminUsers');