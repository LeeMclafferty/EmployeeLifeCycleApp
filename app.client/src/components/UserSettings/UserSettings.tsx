import { useEffect, useState } from "react";
import { type UserRole } from "../../types/UserRole";
import "./UserSettings.css";
import { addUserRole, deleteUserRole, getUsers } from "../../api/UserApi";
import Modal from "../Modal/Modal";
import EditRolesModal from "../Modal/Content/EditRolesModal";
import { useUser } from "../../hooks/UseUser";

const UserSettings = () => {
    const [appUsers, setAppUsers] = useState<UserRole[]>([]);
    const [isEditingRolesOpen, setIsEditingRolesOpen] =
        useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        email: string;
        roles: string[];
    } | null>(null);
    const { isSuperAdmin } = useUser();

    useEffect(() => {
        const loadUsers = async () => {
            const users = await getUsers();
            setAppUsers(users);
        };
        loadUsers();
    }, []);

    const closeModal = () => {
        setIsEditingRolesOpen(false);
        setSelectedUser(null);
    };

    const groupedUsers = appUsers.reduce((acc, user) => {
        if (!acc[user.email]) {
            acc[user.email] = { ...user, roles: [] };
        }
        acc[user.email].roles.push(user.role);
        return acc;
    }, {} as Record<string, { id: number; email: string; roles: string[] }>);

    const handleSaveRoles = async (email: string, newRoles: string[]) => {
        if (!selectedUser) return;

        // roles in DB now
        const currentRoles = selectedUser.roles;

        // determine added + removed
        const addedRoles = newRoles.filter((r) => !currentRoles.includes(r));
        const removedRoles = currentRoles.filter((r) => !newRoles.includes(r));

        try {
            // add new role entries
            for (const role of addedRoles) {
                await addUserRole({ id: 0, email, role }); // id ignored on POST
            }

            // remove roles
            await Promise.all(
                removedRoles.map((role) => deleteUserRole(email, role))
            );

            // refresh table
            const users = await getUsers();
            setAppUsers(users);
        } catch (err) {
            console.error("Error saving roles:", err);
        }
        closeModal();
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Users</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(groupedUsers).map((user) => (
                        <tr key={user.email}>
                            <td>{user.email}</td>
                            <td>
                                {user.roles.map((role, i) => (
                                    <span
                                        key={i}
                                        className={`role-pill ${role.toLowerCase()}`}
                                    >
                                        {role}
                                    </span>
                                ))}
                                {/* Edit roles pill */}
                                {isSuperAdmin && (
                                    <button
                                        className="role-pill role-edit-pill"
                                        onClick={() => {
                                            setSelectedUser(user); // store the user for the row
                                            setIsEditingRolesOpen(true);
                                        }}
                                    >
                                        . . .
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal isOpen={isEditingRolesOpen} onClose={closeModal}>
                {selectedUser && (
                    <EditRolesModal
                        userRole={selectedUser}
                        onSave={(newRoles) =>
                            handleSaveRoles(selectedUser.email, newRoles)
                        }
                    />
                )}
            </Modal>
        </>
    );
};

export default UserSettings;
