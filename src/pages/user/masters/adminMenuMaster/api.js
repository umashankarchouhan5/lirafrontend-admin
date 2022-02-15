import Ajax from "Utils/ajax";

export const getDepartmentList = () => Ajax.get('misc/departmentlist');

export const fetchAdminMenu = (data) => Ajax.post('master/fetchAdminMenu',data);

export const addUpdateAdminMenu = (data) => Ajax.post('master/addUpdateAdminMenu',data);

export const fetchTopAdminMenu = (data) => Ajax.post('master/fetchTopAdminMenu',data);

export const AssignMenusToRole = (data) => Ajax.post('master/AssignMenusToRole',data);

export const RemoveAdminMenuFromRole = (data) => Ajax.post('master/RemoveAdminMenuFromRole',data);

export const FetchRolesForMenu = (data) => Ajax.post('master/FetchRolesForMenu',data)

export const fetchRoles = () => Ajax.get('list/fetchRoles');