import Ajax from "Utils/ajax";

export const getRejectionReasons = (data) => Ajax.post('admin/tasks/ticket/process/disposition', data);





