import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { supabaseClient } from '../config/supabase';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function Home() {
    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('project')
                .select('*')
                .order('title')
                .eq('userid', user.id)

            if (error) {
                throw error;
            }

            setProjects(data);
        } catch (error) {
            setError("Error fetching projects:", error.message)
            console.error('Error fetching projects:', error.message);
        }
    };

    const handleCreateProject = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('project')
                .insert([{ title: newProjectTitle }])
                .select()
            if (error) {
                throw error;
            }

            // Add the newly created project to the projects state
            setProjects([...projects, data[0]]);

            // Clear the input field
            setNewProjectTitle('');
        } catch (error) {
            setError("Error creating project:", error.message)
            console.error('Error creating project:', error.message);
        }
    };
    const handleProjectClick = (projectId) => {
        navigate(`/todo/${projectId}`);
    };

    return (
        <>
            <NavigationBar />
            <div className="container mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <div className='d-flex align-items-center'>
                    <Form.Group className='flex-grow-1'>
                        <Form.Control
                            type="text"
                            placeholder="Enter project title"
                            value={newProjectTitle}
                            onChange={(e) => setNewProjectTitle(e.target.value)}
                            
                        />
                    </Form.Group>
                    <Button  style={{ margin: '0 8px' }} onClick={handleCreateProject}>Add Project</Button>
                </div>
                <div className="row mt-4">
                    {projects.map(project => (
                        <div className="col-md-4 mb-4" key={project.id} onClick={() => handleProjectClick(project.id)}>
                            <Card style={{ cursor: "pointer" }}>
                                <Card.Body>
                                    <Card.Title>{project.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Project ID: {project.id}</Card.Subtitle>

                                    <Card.Text>Created Date: {project.createddate}</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;
