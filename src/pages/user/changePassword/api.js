import Ajax from 'Utils/ajax';

export const changePassword = (data) => Ajax.post("admin/change_password", data);




