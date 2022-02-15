import Ajax from "Utils/ajax";

export const fetchRoles = () => Ajax.get('list/fetchRoles');

export const fetchUserForRoles = (data) => Ajax.post('master/FetchUsersForRole',data);

export const fetchMenusForRole = (data) => Ajax.post('master/FetchMenusForRole',data);

export const removeAdminMenuFromRole = (data) => Ajax.post('master/RemoveAdminMenuFromRole',data);

export const editRoleById = (data) => Ajax.post('master/editRoleById',data);

export const addRole = (data) => Ajax.post('master/addRole',data);

export const assignMenusToRole = (data) => Ajax.post('master/AssignMenusToRole',data);

export const fetchAdminMenu = (data) => Ajax.post('master/fetchAdminMenu',data);