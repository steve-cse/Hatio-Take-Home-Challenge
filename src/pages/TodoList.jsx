import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { supabaseClient } from '../config/supabase';
import { PencilSquare } from 'react-bootstrap-icons';

function TodoList() {
    const { projectId } = useParams();
    const [todos, setTodos] = useState([]);
    const [projectTitle, setProjectTitle] = useState("Loading...");
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoDescription, setEditTodoDescription] = useState('');
    const [editProjectTitleModal, setEditProjectTitleModal] = useState(false);
    const [updatedProjectTitle, setUpdatedProjectTitle] = useState('');
    const [removeTodoId, setRemoveTodoId] = useState(null);


    useEffect(() => {
        fetchTodos();
        fetchProjectTitle();
    }, []);

    const fetchTodos = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('todo')
                .select('*')
                .eq('projectid', projectId)
                .order('created_at')

            if (error) {
                throw error;
            }

            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error.message);
        }
    };

    const fetchProjectTitle = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('project')
                .select('title')
                .eq('id', projectId)


            if (error) {
                throw error;
            }

            setProjectTitle(data[0].title);
        } catch (error) {
            console.error('Error fetching project title:', error.message);
        }
    };


    const completedTodos = todos.filter(todo => todo.status === 'Complete').length;
    const totalTodos = todos.length;


    const addTodo = async (e) => {
        e.preventDefault()
        try {
            if (newTodoDescription.trim() === '') {
                return; // Prevent adding empty todos
            }

            const { data, error } = await supabaseClient
                .from('todo')
                .insert([{ projectid: projectId, description: newTodoDescription }])
                .select();

            if (error) {
                throw error;
            }

            setNewTodoDescription('');
            setTodos([...todos, data[0]]);
        } catch (error) {
            console.error('Error adding todo:', error.message);
        }
    };

    const updateTodoStatus = async (id, status) => {
        try {
            // Update the status of the todo
            await supabaseClient
                .from('todo')
                .update({ status })
                .eq('id', id)

            // Refresh todos after updating status
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo status:', error.message);
        }
    };

    const removeTodo = async () => {
        try {
            await supabaseClient
                .from('todo')
                .delete()
                .eq('id', removeTodoId);


            setRemoveTodoId(null)
            // Refresh todos after removing
            fetchTodos();

        } catch (error) {
            console.error('Error removing todo:', error.message);
        }
    };

    const handleEditTodo = (id, description) => {
        setEditTodoId(id);
        setEditTodoDescription(description);
    };

    const saveEditedTodo = async () => {
        // Get current date
        const currentDate = new Date();
        // Extract year, month, and day
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        // Format the date
        const formattedDate = `${year}-${month}-${day}`;
        try {
            await supabaseClient
                .from('todo')
                .update({ description: editTodoDescription, updateddate: formattedDate })
                .eq('id', editTodoId);
            // Close modal and refresh todos
            setEditTodoId(null);
            setEditTodoDescription('');
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo description:', error.message);
        }
    };

    const openEditProjectTitleModal = () => {
        setUpdatedProjectTitle(projectTitle);
        setEditProjectTitleModal(true);
    };

    const closeEditProjectTitleModal = () => {
        setEditProjectTitleModal(false);
    };

    const saveEditedProjectTitle = async () => {
        try {
            await supabaseClient
                .from('project')
                .update({ title: updatedProjectTitle })
                .eq('id', projectId);

            setProjectTitle(updatedProjectTitle);
            closeEditProjectTitleModal();
        } catch (error) {
            console.error('Error updating project title:', error.message);
        }
    };
    const exportToMarkdown = () => {
        const markdownContent = generateMarkdown(todos);
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectTitle}.md`;
        a.click();
    };

    const generateMarkdown = (todos) => {
        let markdown = `# ${projectTitle}\n\n**Summary:** ${completedTodos} out of ${totalTodos} todos completed \n\n`;
        let pending = `## Pending \n`
        let completed = `## Completed \n`
        todos.forEach(todo => {
            if (todo.status === "Pending")
                pending += `- [ ] ${todo.description} \n`
            else
                completed += `- [x] ${todo.description} \n`
        });
        markdown += pending
        markdown += completed
        return markdown;
    };



    return (
        <>
            <NavigationBar />
            <div className="container mt-4">
                <h2>{projectTitle}{' '}<PencilSquare style={{ cursor: "pointer", marginBottom: "7px" }} onClick={openEditProjectTitleModal} /></h2>
                <h5>{completedTodos} out of {totalTodos} todos complete</h5>
                <div className='d-flex align-items-center mt-4 mb-4'>
                    <Form onSubmit={addTodo} className="flex-grow-1">
                        <Form.Group className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Enter todo description"
                                value={newTodoDescription}
                                onChange={(e) => setNewTodoDescription(e.target.value)}
                                required
                            />
                            <Button style={{ margin: '0 8px' }} variant="primary" type="submit" className="flex-shrink-0">Add Todo</Button>
                        </Form.Group>
                    </Form>

                    <div className="ml-auto">
                        <Button onClick={exportToMarkdown}>Save as Gist</Button>
                    </div>
                </div>

                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Updated Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map(todo => (
                            <tr key={todo.id}>
                                <td>{todo.description}</td>
                                <td>{todo.status}</td>
                                <td>{todo.createddate}</td>
                                <td>{todo.updateddate}</td>
                                <td >
                                    {todo.status === 'Complete' ? (
                                        <Button variant="info" style={{ width: "160px" }} onClick={() => updateTodoStatus(todo.id, 'Pending')}>Mark as Pending</Button>
                                    ) : (
                                        <Button variant="success" style={{ width: "160px" }} onClick={() => updateTodoStatus(todo.id, 'Complete')}>Mark as Complete</Button>
                                    )}{' '}
                                    <Button variant="primary" onClick={() => handleEditTodo(todo.id, todo.description)}>Edit Todo</Button>{' '}
                                    <Button variant="danger" onClick={() => { setRemoveTodoId(todo.id) }}>Remove</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Edit Todo Modal */}
                <Modal show={editTodoId !== null} onHide={() => setEditTodoId(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Todo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            placeholder="Enter updated todo description"
                            value={editTodoDescription}
                            onChange={(e) => setEditTodoDescription(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setEditTodoId(null)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={saveEditedTodo}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Edit Project Title Modal */}
                <Modal show={editProjectTitleModal} onHide={closeEditProjectTitleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Project Title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            placeholder="Enter updated project title"
                            value={updatedProjectTitle}
                            onChange={(e) => setUpdatedProjectTitle(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEditProjectTitleModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={saveEditedProjectTitle}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Remove Todo Confirmation Dialog */}
                <Modal show={removeTodoId !== null} onHide={() => setRemoveTodoId(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Todo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to remove this todo?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setRemoveTodoId(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={removeTodo}>
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default TodoList;
