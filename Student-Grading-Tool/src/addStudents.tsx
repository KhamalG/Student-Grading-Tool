import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

interface StudentData {
    name: string;
    _id: number;
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

export default function AddStudent() {
    const [navigate, setNavigate] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<StudentData[]>([]);
    const [studentData, setStudentData] = useState<StudentData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get<StudentData[]>(`http://localhost:3050/api/student/students`);
                if (result && result.data) {
                    setStudentData(result.data);
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

    const handleRowClick = (rowId: number, name: string) => {
        const isSelected = selectedRows.find((row) => row._id === rowId);

        if (!isSelected) {
            setSelectedRows([...selectedRows, { _id: rowId, name }]);
        } else {
            setSelectedRows(selectedRows.filter((row) => row._id !== rowId));
        }
    };

    const handleSubmit = async () => {
        try {
            const classId = localStorage.getItem('class');
            const data = selectedRows.map((row) => ({ student_name: row.name, student_id: row._id }));
            console.log('data in submit: ', data);
            await axios.patch(`http://localhost:3050/api/class/student`, { data, class_id: classId });
            setNavigate(true);
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    if (navigate) {
        return <Navigate to="/students" />;
    }




    return (
        <div>
            <div style={styles.header}>
                <button onClick={handleLogout} style={styles.header_buttons}>Log Out</button>
                <h1 style={styles.header_title}>Classes</h1>
                <button style={styles.header_buttons}><Link to='/classes'> Classes </Link></button>
                <button style={styles.header_buttons}><Link to='/students'> Students </Link></button>
            </div>
            <div>
                <label htmlFor="studentName">Students</label>
                <ul>
                    {studentData.map((row) => (
                        <li
                            key={row._id}
                            style={{
                                backgroundColor: selectedRows.some((selected) => selected._id === row._id) ? 'blue' : 'grey',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleRowClick(row._id, row.name)}
                        >
                            {row.name}
                        </li>
                    ))}
                </ul>
                <div>
                    <button onClick={handleSubmit}>Add Student</button>
                </div>
            </div>
        </div>
    );
}

