import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import {Button} from '@mui/material';
import EditAssignment from "./EditAssignment";
import AddAssignment from "./AddAssignment";


function ListAssignment(props) {


    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const token = sessionStorage.getItem("jwt");

    useEffect(() => {
        // called once after intial render
        fetchAssignments();
    }, [])

    const fetchAssignments = () => {
        console.log("fetchAssignments");
        fetch(`${SERVER_URL}/assignment`, {
            headers: {'Authorization' : token}
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("assignment length " + data.length);
                setAssignments(data);
            })
            .catch(err => console.error(err));
    }

    const handleDelete = (assignment, force) => {
        fetch(`${SERVER_URL}/assignment/${assignment.id}?force=${force}`, {
            method: 'DELETE',
            headers: {'Authorization' : token}
        })
            .then((response) => {
                if(response.ok){
                    setMessage('Assignment deleted');
                    fetchAssignments();
                }else if(response.status === 400){
                    setMessage('Assignment has grades, use Force Delete');
                }else{
                    setMessage('Error deleting assignment');
                }
            })
            .catch((error) => {
                console.error('Error deleting assignment: ' + error);
                setMessage('Error deleting assignment');
            })
    }
    const openEditDialog = (assignment) => {
        setSelectedAssignment(assignment);
        setEditDialogOpen(true);
    }

    const closeEditDialog = () => {
        setSelectedAssignment(null);
        setEditDialogOpen(false);
    }

    const openAddDialog = () => {
        setAddDialogOpen(true);
    }

    const closeAddDialog = () => {
        setAddDialogOpen(false);
    }


    const headers = ['Assignment Name', 'Course Title', 'Due Date', ' ', ' ', ' ', ' '];

    return (
        <div>
            <h3>Assignments</h3>
            <div margin="auto">
                <h4>{message}&nbsp;</h4>
                <table className="Center">
                    <thead>
                    <tr>
                        {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.assignmentName}</td>
                            <td>{row.courseTitle}</td>
                            <td>{row.dueDate}</td>
                            <td>
                                <Link to={`/gradeAssignment/${assignments[idx].id}`}>Grade</Link>
                            </td>
                            <td><Button variant='outlined'  onClick={() => openEditDialog(row)}>Edit</Button></td>
                            <td><Button variant='outlined' onClick={()=> handleDelete(row, false)}>Delete</Button></td>
                            <td><Button variant='outlined' onClick={()=> handleDelete(row, true)}>Force Delete</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Button variant='outlined' id="ADD" onClick={() => openAddDialog()}>Add</Button>
                <p>&nbsp;</p>
            </div>

            {editDialogOpen && (
                <EditAssignment assignment={selectedAssignment} onClose={closeEditDialog} reload={fetchAssignments}/>
            )}

            {addDialogOpen && (
                <AddAssignment reload={fetchAssignments} onClose={closeAddDialog}/>
            )}

        </div>
    )
}

export default ListAssignment;