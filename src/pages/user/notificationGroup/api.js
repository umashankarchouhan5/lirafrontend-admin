import Ajax from "Utils/ajax";

export const getNotificationGroupList = (data) => Ajax.post('list/getNotificationGroupList',data);

export const getNotificationGroupUsers = (data) => Ajax.post('admin/getNotificationGroupUsers',data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

export const saveNotificationGroupUsers = (data) => Ajax.post('admin/saveNotificationGroupUsers', data);

export const deleteNotificationGroupUsers = (data) => Ajax.post('admin/deleteNotificationGroupUsers', data);