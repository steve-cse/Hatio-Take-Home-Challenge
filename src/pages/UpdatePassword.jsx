import React, { useState, useEffect,useRef} from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { supabaseClient } from "../config/supabase";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function UpdatePassword() {
    const passwordRef = useRef();
    const [linkError, setLinkError] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        console.log(location.hash);
        const params = new URLSearchParams(location.hash);
        const errorMessage = params.get("error_description");
        if (errorMessage) {
            setLinkError(errorMessage);
        }
    }, [location.hash]);
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage("");
            setError("");
            setLoading(true);
            const { error } = await supabaseClient.auth.updateUser({
                password: passwordRef.current.value,
            });
            if (error) throw error;
            setMessage("Password updated. Redirecting to Login....");
            setTimeout(function () {
                navigate('/login')
            }, 5000);
        } catch (err) {
            setError(err.message);
            console.error(err);
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
                            <h2 className="text-center mb-4">Password Reset</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {message && <Alert variant="success">{message}</Alert>}
                            {linkError && <Alert variant="danger">{linkError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label>Enter New Password</Form.Label>
                                    <Form.Control type="Password" ref={passwordRef} required />
                                </Form.Group>
                                <Button
                                    disabled={loading || linkError}
                                    className="w-100 container my-3 "
                                    type="submit"
                                >
                                    Update Password
                                </Button>
                            </Form>
                            <div className="w-100 text-center mt-3">
                                <Link to="/login">Login</Link>
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
