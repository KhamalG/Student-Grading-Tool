import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

interface StudentData {
    _id: number;
    name: string;
    gpa: number;
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

export default function Students() {
    const [studentsData, setStudentsData] = useState<StudentData[]>([]);
    const [navigate, setNavigate] = useState(false);
    const [openStudent, setOpenStudent] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get<StudentData[]>(`http://localhost:3050/api/student/students`);
                console.log("result: ", result);
                if (result && result.data) {
                    setStudentsData(result.data);
                    console.log('response data: ', studentsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [studentsData]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setNavigate(true);
    };

    const onRowClick = (val: StudentData) => {
        localStorage.removeItem('student');
        localStorage.setItem('student', String(val._id));
        localStorage.removeItem('studentName');
        console.log('val: ', val);
        localStorage.setItem('studentName', String(val.name));
        setOpenStudent(true);
    };

    if (navigate === true) {
        return <Navigate to="/" />;
    }

    if (openStudent) {
        return <Navigate to="/student" />;
    }

    return (
        <div>
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.header_buttons}>Log Out</button>
                <h1 style={styles.header_title}>Students</h1>
                <button style={styles.header_buttons}><Link to='/classes'> Classes </Link></button>
                <button style={styles.header_buttons}><Link to='/students'> Students </Link></button>
            </div>
            <div style={styles.header}>
                <button style={styles.header_buttons}><Link to='/new/student'>New Student</Link></button>
                <button style={styles.header_buttons}><Link to='/delete/student'>Delete Student</Link></button>
            </div>
            <div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsData.map((val, key) => (
                            <tr key={key} onClick={() => onRowClick(val)}>
                                <td style={styles.td}>{val.name}</td>
                                <td style={styles.td}>{val.gpa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
