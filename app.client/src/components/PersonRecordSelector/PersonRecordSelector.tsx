import { useEffect, useState } from "react";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../types/PersonRecordType";
import PersonRecordCard from "./PersonRecordCard";
import { getPersonRecordsByPhase } from "../../api/PersonRecordApi";
import { useNavigate } from "react-router-dom";

type Props = {
    person?: PersonRecord;
    phase: LifeCyclePhase;
};

const PersonRecordSelector = ({ person, phase }: Props) => {
    const [selectedPerson, setselectedPerson] = useState<PersonRecord>();
    const [phasePersons, setPhasePersons] = useState<PersonRecord[]>([]);
    const nav = useNavigate();

    const getPhasePersons = async (cyclePhase: LifeCyclePhase) => {
        try {
            return await getPersonRecordsByPhase(cyclePhase);
        } catch (err) {
            console.log(`Failed to load personRecords by phase `, err);
        }
    };

    useEffect(() => {
        if (person) {
            setselectedPerson(person);
        }

        const load = async () => {
            const people = await getPhasePersons(phase);
            if (people) {
                setPhasePersons(people);
            }
        };

        load();
    }, [person, phase]);

    const handleCardClick = (person: PersonRecord) => {
        setselectedPerson(person);
        nav(`/Task/${person.id}`);
    };

    return (
        <>
            <div className="scroll-container">
                <ul>
                    {phasePersons.map((person) => (
                        <li key={person.id}>
                            {person.id === selectedPerson?.id ? (
                                <div className="person-card">
                                    <PersonRecordCard
                                        person={person}
                                        isActive={true}
                                    />
                                </div>
                            ) : (
                                <div className="person-card">
                                    <PersonRecordCard
                                        person={person}
                                        isActive={false}
                                        onClick={() => handleCardClick(person)}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default PersonRecordSelector;
