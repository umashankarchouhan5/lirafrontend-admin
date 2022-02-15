import Ajax from "Utils/ajax";

export const getNotes = (data) => Ajax.post('admin/tasks/ticket/getnotes', data);


