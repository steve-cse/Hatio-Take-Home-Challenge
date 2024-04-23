import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { supabaseClient } from '../config/supabase';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            const { error } = await supabaseClient.auth.signInWithPassword({
                email: emailRef.current.value,
                password: passwordRef.current.value
            });
            if (error) throw error;
            console.log("Auth Success");


            setLoading(false);
            navigate("/home");
        } catch (err) {
            setError(err.message)
            console.log(err.code);

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label htmlFor="emailInput">Email</Form.Label>
                                    <Form.Control id="emailInput"  type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label htmlFor="passwordInput">Password</Form.Label>
                                    <Form.Control id="passwordInput" type="password" ref={passwordRef} required />
                                </Form.Group>
                                <Button
                                    disabled={loading}
                                    className="w-100 container my-3"
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </Form>
                            <div className="w-100 text-center mt-3">
                            <Link to="/forgot-password"> Forgot Password?</Link>
                                
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </Container>
        </>
    );
}