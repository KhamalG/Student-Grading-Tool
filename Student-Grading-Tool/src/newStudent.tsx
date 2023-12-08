import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";


interface StudentData {
    name: string;
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

export default function NewStudent() {
    const [navigate, setNavigate] = useState<boolean>(false);
    const [studentName, setStudentName] = useState<string>('');

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setNavigate(true);
    };

    const handleSubmit = async () => {
        try {
            const data = { name: studentName}
            await axios.post<StudentData[]>(`http://localhost:3050/api/student/new`, data);
            return <Navigate to="/students" />;
            // Assuming the response updates the state or triggers a re-fetch of classesData
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    if (navigate) {
        return <Navigate to="/" />;
    }

    const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentName(e.target.value);
    };

    return (
        <div>
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.header_buttons}>Log Out</button>
                <h1 style={styles.header_title}>Classes</h1>
                <button style={styles.header_buttons}><Link to='/classes'> Classes </Link></button>
                <button style={styles.header_buttons}><Link to='/students'> Students </Link></button>
            </div>
            <div>
                <label htmlFor="assignmentTitle">Student Name:</label>
                    <input
                        type="text"
                        id="assignmentTitle"
                        value={studentName}
                        onChange={handleStudentNameChange}
                    />
                <button onClick={handleSubmit}>Create New Student</button>
            </div>
        </div>
    );
}
