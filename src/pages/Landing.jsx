import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Feather_Logo from "../assets/feather.png";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="w-100" style={{ maxWidth: "450px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Hatio Take Home Challenge</h2>
                            <img
                                width="150"
                                src={Feather_Logo}
                                className="mx-auto d-block  my-3"
                                alt="Feather Logo"
                            />
                            <Button
                                className="w-100 container my-3"
                                onClick={() => {
                                    navigate("/home");
                                }}
                            >
                                Manage your todos
                            </Button>

                            <div className="w-100 text-center mt-3">
                                <h6> Submitted by Steve Boby George </h6>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    );
}
