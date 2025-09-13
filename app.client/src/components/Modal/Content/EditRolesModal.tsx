import React, { useState } from "react";

type Props = {
    userRole: { id: number; email: string; roles: string[] };
    onSave: (roles: string[]) => void;
};

const allRoles = [
    "OnboardingUser",
    "OffboardingUser",
    "OnboardingAdmin",
    "OffboardingAdmin",
    "SuperAdmin",
];

const EditRolesModal: React.FC<Props> = ({ userRole, onSave }) => {
    // local state for selected checkboxes
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        userRole.roles
    );

    const toggleRole = (role: string) => {
        setSelectedRoles((prev) =>
            prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role]
        );
    };

    return (
        <div className="edit-roles-modal">
            <h2>Edit Roles for {userRole.email}</h2>

            <div className="roles-list">
                {allRoles.map((role) => (
                    <label key={role}>
                        <input
                            type="checkbox"
                            checked={selectedRoles.includes(role)}
                            onChange={() => toggleRole(role)}
                        />
                        {role}
                    </label>
                ))}
            </div>

            <div className="modal-actions">
                <button onClick={() => onSave(selectedRoles)}>Save</button>
            </div>
        </div>
    );
};

export default EditRolesModal;
