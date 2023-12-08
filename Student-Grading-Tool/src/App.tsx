import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import { Login } from '../src/Login';
import Classes from './Classes';
import Students from './Students';
import Assignments from './Assignments';
import NewAssignments from './newAssignment';
import NewStudent from './newStudent';
import NewClass from './newClass';
import Class from './Class';
import AddStudent from './addStudents';
import Student from './Student';

function App() {
  

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/classes' element={<Classes/>}/>
          <Route path='/students' element={<Students/>}/>
          <Route path='/assignments' element={<Assignments/>}/>
          <Route path='/new/assignment' element={<NewAssignments/>}/>
          <Route path='/new/student' element={<NewStudent/>}/>
          <Route path='/new/class' element={<NewClass/>}/>
          <Route path='/class' element={<Class/>}/>
          <Route path='/add/class' element={<AddStudent/>}/>
          <Route path='/student' element={<Student/>}/>
          {/* 
          <Route path='/assignment' element={<Assignment/>}/> */}
        </Routes>
    </BrowserRouter>
  )
}

export default App
