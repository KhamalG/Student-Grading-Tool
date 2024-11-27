import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

interface ClassData {
    name: string;
    department: string;
    students: number;
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
        color: 'black',
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

export default function Class() {
    const [assignmentData, setAssignmentData] = useState<ClassData[]>([]);
    const [classData, setClassData] = useState<ClassData>({ name: '', department: '', students: 0 });
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem('class');
                const classResult = await axios.get<ClassData[]>(`http://localhost:3050/api/class/${id}/class`);
                if (classResult && classResult.data && classResult.data.data.length > 0) {
                    setClassData(classResult.data.data[0]);
                }

                const result = await axios.get<ClassData[]>(`http://localhost:3050/api/assignment/${id}/class`);
                if (result && result.data) {
                    setAssignmentData(result.data.data);
                }
            
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setNavigate(true);
    };

    if (navigate === true) {
        return <Navigate to="/" />;
    }


    return (
        <div>
            {/* Header */}
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.header_buttons}>Log Out</button>
                <h1 style={styles.header_title}>Classes</h1>
                <button style={styles.header_buttons}><Link to='/classes'> Classes </Link></button>
                <button style={styles.header_buttons}><Link to='/students'> Students </Link></button>
            </div>
            {/* Buttons */}
            <div style={styles.header}>
                <button style={styles.header_buttons}><Link to='/add/class'>Add Student</Link></button>
                <button style={styles.header_buttons}><Link to='/delete/class/student'>Remove Student</Link></button>
                <button style={styles.header_buttons}><Link to='/new/assignment'>New Assignment</Link></button>
                <button style={styles.header_buttons}><Link to='/delete/assignment'>Delete Assignment</Link></button>
            </div>
            {/* Class name */}
            <h1>{classData.name}</h1>

            {/* Assignments Table */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Assignment Name</th>
                    </tr>
                </thead>
                <tbody>
                    {assignmentData.map((assignment, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{assignment.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}