import { apiRequest } from "./ApiClient";
import { type PersonRecord } from '../types/PersonRecordType';

export const getPersonRecords = () =>
    apiRequest<PersonRecord[]>("PersonRecord/Get");

export const getPersonRecordById = (id: number) =>
    apiRequest<PersonRecord>(`PersonRecord/Get/${id}`);

export const createPersonRecord = (personData: PersonRecord) =>
    apiRequest<PersonRecord, PersonRecord>(
        "PersonRecord/Create",
        "POST",
        personData
    );

export const updatePersonRecord = (person: PersonRecord) =>
    apiRequest<PersonRecord, PersonRecord>(
        "PersonRecord/Update",
        "PUT",
        person
    );
