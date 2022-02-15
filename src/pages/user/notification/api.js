import Ajax from 'Utils/ajax';

export const getNotification = (data) => Ajax.post("list/FetchNotificationAdmin",data);

export const getNotificationCount = () => Ajax.post("admin/getNotificationCountAdmin");

export const readNotificationWeb = (data) => Ajax.post("admin/ReadNotificationAdmin",data);

export const ticketToProcess = (data) => Ajax.post("webuser/TicketToProcess",data);