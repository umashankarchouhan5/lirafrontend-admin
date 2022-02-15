import Ajax from "Utils/ajax";

export const saveNote = (data) => Ajax.post('admin/tasks/ticket/notes/save', data);


