import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, Button, TextField} from '@mui/material';
import {SERVER_URL} from "../constants";


function EditAssignment({assignment, onClose, reload}) {

    const [editedAssignment, setEditedAssignment] = useState({
        courseId: assignment ? assignment.courseId : '',
        assignmentName: assignment ? assignment.assignmentName : '',
        dueDate: assignment ? assignment.dueDate : '',
    });

    const [message, setMessage] = useState('');
    const [editDialog, setEditDialog] = useState(true);


    useEffect(() => {

    }, [])

    const handleEdit = (e) => {
        const {name, value} = e.target;
        setEditedAssignment({
            ...editedAssignment,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        setMessage('');
        console.log("Assignment.save");
        fetch(`${SERVER_URL}/assignment/${assignment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedAssignment),
        })
            .then((response) => {
                if (response.ok) {
                    setMessage('Assignment update successful');
                    onClose();
                    setEditDialog(false);
                    reload();
                } else {
                    setMessage("Assignment update failed");
                }
            })
            .catch((error) => {
                console.error("There was an error: " + error);
                setMessage("Error updating assignment");
            });
    };

    return (
        <div>
            <Dialog open={editDialog} onClose={onClose}>
                <DialogContent>
                    <TextField
                        label="Assignment Name"
                        variant="outlined"
                        fullWidth
                        name="assignmentName"
                        value={editedAssignment.assignmentName}
                        style={{
                            paddingBottom: '10px'
                        }}
                        onChange={handleEdit}>
                    </TextField>
                    <TextField
                        label="Course ID"
                        name="courseId"
                        variant="outlined"
                        value={editedAssignment.courseId}
                        onChange={handleEdit}
                        style={{
                            paddingBottom: '10px'
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        type="date"
                        label="Due Date"
                        name="dueDate"
                        value={editedAssignment.dueDate}
                        fullWidth
                        onChange={handleEdit}
                        variant="outlined">
                    </TextField>
                    <p>{message}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditAssignment;