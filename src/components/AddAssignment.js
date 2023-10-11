import React, {useEffect, useState} from 'react';
import {SERVER_URL} from "../constants";
import {Dialog} from "@mui/material";
import {DialogTitle} from "@mui/material";
import {DialogContent} from "@mui/material";
import {DialogActions} from "@mui/material";
import {Button} from "@mui/material";
import {TextField} from "@mui/material";


function AddAssignment(props) {

    const [open, setOpen] = useState(false);
    const [assignmentName, setAssignmentName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [courseId, setCourseId] = useState('');
    const [message, setMessage] = useState('');

    const handleDialogOpen = () => {
        setOpen(true);
    }

    const handleDialogClose = () => {
        setOpen(false);
    }

    useEffect(() => {},[]);


    const handleSubmit = () => {
        setMessage('');
        const newAssignment = {
            assignmentName,
            dueDate,
            courseId,
        };

        fetch(`${SERVER_URL}/assignment`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(newAssignment),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)

                setAssignmentName('');
                setDueDate('');
                setCourseId('');
                setMessage('Assignment added successfully');
                handleDialogClose();
                props.reload();
            })
            .catch((error) => {
                setMessage('There was an error creating the assignment: ' + error);
            });
    };

    return (
        <div>
            <Button variant='outlined' color='primary' onClick={handleDialogOpen}>Add Assignment</Button>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Add New Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        label = "Assignment Name"
                        variant = "outlined"
                        fullWidth
                        style={{
                            paddingBottom: '10px'
                        }}
                        name = "assignmentName"
                        onChange = {(e) => setAssignmentName(e.target.value)}>
                    </TextField>
                    <TextField
                        label = "Course ID"
                        variant = "outlined"
                        name = "courseID"
                        style={{
                            paddingBottom: '10px'
                        }}
                        onChange = {(e) => setCourseId(e.target.value)}
                        fullWidth>
                    </TextField>
                    <TextField
                        name = "dueDate"
                        variant = "outlined"
                        fullWidth
                        type = "date"
                        onChange={(e) => setDueDate(e.target.value)}>
                    </TextField>
                </DialogContent>

                <DialogActions>
                    <Button onClick = {handleDialogClose} color = 'primary'>
                        Cancel
                    </Button>

                    <Button onClick = {handleSubmit} color = "primary" type = "submit">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddAssignment;