import { apiRequest } from "./ApiClient";
import { type NotifyResult, type NotifyBody } from "../types/NotifyTypes";

export const sendTeamsNotification = (body: NotifyBody) =>
    apiRequest<NotifyResult, NotifyBody>("Notify", "POST", body);
