import Ajax from "Utils/ajax";

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

export const getDepartments = (data) => Ajax.post('list/fetchDataFromMaster', data);

export const getManagers = () => Ajax.get('admin/fetchManagers');

export const getRoles = () => Ajax.get(`list/fetchRoles`);

export const getLocations = () => Ajax.get('list/fetchLocations');

export const addUser = (data) => Ajax.post("admin/createuser", data);

export const editUser = (data) => Ajax.post("admin/updatedetails", data);

export const deleteUser = (id) => Ajax.get(`admin/deleteAdminuser/${id}`);

export const fetchUser = (data) => Ajax.post(`admin/fetchUser`, data);
 
export const fetchRoles = (data) => Ajax.post(`master/FetchRolesForDepartment`, data);

export const checkUser = (data) => Ajax.post(`admin/checkUser`, data);