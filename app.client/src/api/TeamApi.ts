import { type Team } from "../types/TeamType";
import { apiRequest } from "./ApiClient";

export const getTeamById = (id: number) => apiRequest<Team>(`Team/Get/${id}`);

export const getTeams = () => apiRequest<Team[]>(`Team/Get`);
