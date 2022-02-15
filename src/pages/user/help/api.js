import Ajax from "Utils/ajax";

export const getHelpText = (data) => Ajax.post('admin/processhelptext', data);
