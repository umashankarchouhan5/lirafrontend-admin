import Ajax from 'Utils/ajax';

export const getChecklist = (data) => Ajax.post('admin/tasks/ticket/getchecklist', data);



