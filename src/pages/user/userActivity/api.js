import Ajax from "Utils/ajax";

export const getUsersActivity = (data) => Ajax.post('admin/getUsersActivity', data);
export const getWebUsers = () => Ajax.post('admin/getWebUsers');