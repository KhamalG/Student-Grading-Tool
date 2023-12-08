import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

interface ClassData {
    name: string;
    department: string;
    students: [];
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
        color: 'black',
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


export default function Classes() {
    const [classesData, setClassesData] = useState<ClassData[]>([]);
    const [navigate, setNavigate] = useState(false);
    const [openClass, setOpenClass] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get<ClassData[]>(`http://localhost:3050/api/class/classes`);
                if (result && result.data) {
                    setClassesData(result.data);
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

    const onRowClick = (val: ClassData) => {
        localStorage.removeItem('class');
        localStorage.setItem('class', String(val._id));
        localStorage.removeItem('className');
        console.log('val: ', val);
        localStorage.setItem('classsName', String(val.name));
        setOpenClass(true);
    };

    if (navigate) {
        return <Navigate to="/" />;
    }

    if (openClass) {
        return <Navigate to="/class" />;
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
                <button style={styles.header_buttons}><Link to='/new/class'>New Class</Link></button>
                <button style={styles.header_buttons}><Link to='/delete/class'>Delete Class</Link></button>
            </div>
            <div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Classes</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Number of Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classesData.map((val) => (
                            <tr key={val._id} onClick={() => onRowClick(val)}>
                                <td style={styles.td}>{val.name}</td>
                                <td style={styles.td}>{val.department}</td>
                                <td style={styles.td}>{val.students.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
