import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

interface StudentData {
    name: string;
    grades: Grade[];
}

interface Grade {
    class_id: number;
    class_name: string;
    grade: number;
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

export default function Student() {
    const [studentData, setStudentData] = useState<StudentData>({ name: '', grades: [] });
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem('student');
                    const studentResult = await axios.get<StudentData>(`http://localhost:3050/api/student/${id}/student`);
                    if (studentResult && studentResult.data) {
                        console.log("statts: ", studentResult)
                        setStudentData(studentResult.data);
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

    const generateClassGradeTable = () => {
        return (
            <tbody>
                {studentData.grades.map((grade, index) => (
                    <tr key={index}>
                        <td style={styles.td}>{grade.class_name}</td>
                        <td style={styles.td}>{grade.grade}</td>
                    </tr>
                ))}
            </tbody>
        );
    };

    if (navigate === true) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.header_buttons}>Log Out</button>
                <h1 style={styles.header_title}>Classes</h1>
                <button style={styles.header_buttons}><Link to='/classes'> Classes </Link></button>
                <button style={styles.header_buttons}><Link to='/students'> Students </Link></button>
            </div>
            <div style={styles.header}>
                <button style={styles.header_buttons}>Update Student Grade</button>
            </div>
            <h1>{studentData.name}</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Assignment Name</th>
                    </tr>
                </thead>
                {generateClassGradeTable()}
            </table>

        </div>
    );
}