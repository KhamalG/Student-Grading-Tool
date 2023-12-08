import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";


interface StudentData {
    name: string;
    department: string;
    students: AssignmentData[];
}

interface AssignmentData {
    class_name: string;
    assignment_id: number;
    class_id: number;
    title: string;
    type: string;
    student_id: string;
    student_name: string;
    grade: string;
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

export default function NewAssignments() {
    const [studentsData, setStudentsData] = useState<StudentData>({ name: '', department: '', students: [] });
    const [className, setClassName] = useState<string>('');
    const [assignmentTitle, setAssignmentTitle] = useState<string>('');
    const [assignmentType, setAssignmentType] = useState<string>('');
    const [grades, setGrades] = useState<Record<string, string>>({});
    const [navigate, setNavigate] = useState<boolean>(false);

    useEffect(() => {
        async function fetchStudents() {
            try {
                const id = localStorage.getItem('class');
                const result = await axios.get<StudentData>(`http://localhost:3050/api/class/${id}/class`);
                if (result && result.data) {
                    setStudentsData(result.data);
                    if (!className) {
                        setClassName(studentsData.name);
                    }
                }
                const storedClassName = localStorage.getItem('className');
                if (storedClassName) {
                    setClassName(storedClassName);
                }
                if (!storedClassName) {
                    setClassName(studentsData.name);
                }
                console.log("resultsssss: ", studentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchStudents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setNavigate(true);
    };

    const handleAssignmentTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAssignmentTitle(e.target.value);
    };

    const handleAssignmentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAssignmentType(e.target.value);
    };

    const handleGradeChange = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
    
        // Find the index of the student in the studentsData array
        const studentIndex = studentsData.students.findIndex(
            (student) => student.student_id === studentId
        );
    
        // If the student is found
        if (studentIndex !== -1) {
            const updatedStudents = [...studentsData.students]; // Copy the students array
    
            // Update the student's grade in the copied array
            updatedStudents[studentIndex] = {
                ...updatedStudents[studentIndex],
                grade: value,
            };
    
            // Get the current grades array for the student
            // const currentGrades = grades[studentId] || [];
    
            // Update the grades object with the new grades array
            // const updatedGrades = {
            //     ...grades,
            //     [studentId]: [...currentGrades, value], // Push the new value into the array
            // };
    
            // Set the updated students and grades in state
            setStudentsData({ ...studentsData, students: updatedStudents });
            setGrades(grades);
        }
    };

    const handleSubmit = async () => {
        try {
            const classId = localStorage.getItem('class');
            const data = studentsData.students.map((student) => ({
                assignment_id: Math.floor(Math.random() * 100),
                title: assignmentTitle,
                type: assignmentType,
                class_id: Number(classId),
                class_name: className,
                student_id: student.student_name, // Assuming student.student_name is the unique identifier
                grade: grades[student.student_name] || 'N/A',
            }));
            console.log("data: ", data);
            await axios.post<AssignmentData[]>(`http://localhost:3050/api/assignment/new`, data);
            setNavigate(true);
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    if (navigate) {
        return <Navigate to="/assignments" />;
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
                <h2>Create Assignment for {studentsData.name}</h2>

                <label htmlFor="assignmentTitle">Assignment Title:</label>
                <input
                    type="text"
                    id="assignmentTitle"
                    value={assignmentTitle}
                    onChange={handleAssignmentTitleChange}
                />

                <label htmlFor="assignmentType">Select Assignment Type:</label>
                <select id="assignmentType" value={assignmentType} onChange={handleAssignmentTypeChange}>
                    <option value="">Select type</option>
                    <option value="homework">Homework</option>
                    <option value="test">Test</option>
                    {/* Add other assignment types */}
                </select>

                <h3>Enter Grades:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsData.students.map((student) => (
                            <tr key={student.student_id}>
                                <td style={styles.td}>{student.student_name}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={grades[student.student_name] || ''}
                                        onChange={(e) => handleGradeChange(student.student_id, e)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={handleSubmit}>Submit Assignment</button>
            </div>
        </div>
    );
}