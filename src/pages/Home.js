import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome to Movies App</h1>
                <Link className="btn btn-primary" to={"/movies"}>View movies</Link>
            </Col>
        </Row>
    )
}