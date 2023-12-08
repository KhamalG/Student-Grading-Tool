import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

interface AssignmentData {
    class_name: string;
    title: string;
    type: string;
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-evenly',
        border: '5px solid gray',
        backgroundColor: 'blue'
    },
    header_buttons: {
        width: '100px',
        height: '50px',
        padding: '10px',
        border: '5px solid gray',
        margin: '10px',
        fontFamily: 'Copperplate',
    },
    header_title: {
        fontFamily: 'Copperplate',
        color: 'white',
        textShadow: '2px 2px gray'
    },
    table: {
        width: '100%',
        border: 'gray',
        height: '100%'
    },
    td: {
        backgroundColor: 'white',
        fontFamily: 'Copperplate',
        padding: '0.5rem',
        lastChild: {borderRight: '0'}
    },
    th: {
        background: 'blue',
        color: 'white',
        fontWeight: 'bold',
        border: '5px solid gray',
        textShadow: '2px 2px gray',
        fontFamily: 'Copperplate',
        margin: '5px',
        height: '100%'
    },
    modal: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function Assignments () {
    const [assignmentsData, setAssignmentsData] = useState<AssignmentData[]>([]);
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        async function fetchAssignments() {
            try {
                const result = await axios.get<AssignmentData[]>(`http://localhost:3050/api/assignment/assignments`);
                if (result && result.data) {
                    setAssignmentsData(result.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchAssignments();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setNavigate(true);
    };

    if (navigate) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.header_buttons}>Log Out</button>
                <h1 style={styles.header_title}>Assignments</h1>
                <button style={styles.header_buttons}><Link to='/classes'> Classes </Link></button>
                <button style={styles.header_buttons}><Link to='/students'> Students </Link></button>
            </div>
            <div style={styles.header}>
                <button style={styles.header_buttons}><Link to='/new/assignment'>New Assignment</Link></button>
            </div>
            <div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Class</th>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignmentsData.map((val, key) => (
                            <tr key={key}>
                                <td style={styles.td}>{val.class_name}</td>
                                <td style={styles.td}>{val.title}</td>
                                <td style={styles.td}>{val.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}