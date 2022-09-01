import React, { Component } from 'react';
import Endpoints from '../API/api.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

class PredictDigitFromImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadedDigitImage: "",
            isPredicting: false,
            successMessage: "",
            errorMessage: "",
            previewImg: ""
        }
    }

    render(){
        return(
            <Container>
                <Row style={{ marginTop: '10px' }}>
                    <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <h2>Predict Digit From Image</h2>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <span>(Works best with black background)</span>
                    </Col>
                </Row>
                <br/>
                <div>
                {
                    this.state.uploadedDigitImage !== "" ?
                    <Row>
                        <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <img 
                                alt="uploaded image preview" 
                                src={this.state.previewImg} 
                                height="300px"
                                width="300px"
                                style={{ borderRadius: '15px', boxShadow: '2px 2px #888888' }}
                            />
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <div style={{ display: 'flex', height: "300px", width: "300px", backgroundColor: 'lightgray', opacity: '50%', borderRadius: '15px', alignItems: 'center', justifyContent: 'center', }}>
                                Upload Image
                            </div>
                        </Col>
                    </Row>
                }
                <br/>
                <input 
                    type="file" 
                    style={{display: 'none'}}
                    required
                    ref={(fileInput) => this.fileInput = fileInput}
                    onChange = {(event) => this.handleChange(event)}
                />
                <Row style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <button
                            onClick={() => this.fileInput.click()}
                            style={{ borderRadius: '5px', backgroundColor: 'orange', border: 'none', padding: '10px', boxShadow: '2px 2px #888888', width: '200px', color: "black" }}
                        >
                            Pick Image
                        </button>
                    </Col>
                    <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    {
                        this.state.errorMessage!=="" || this.state.uploadedDigitImage === "" ?
                        <button
                            style={{ borderRadius: '5px', backgroundColor: 'lightblue', opacity: '50%', border: 'none', padding: '10px', boxShadow: '2px 2px #888888', width: '200px', color: 'darkblue' }}
                            disabled={true}
                        >
                            Predict
                        </button>
                        :
                        <button
                            style={{ borderRadius: '5px', backgroundColor: 'lightblue', border: 'none', padding: '10px', boxShadow: '2px 2px #888888', width: '200px', color: 'darkblue' }}
                            disabled={this.state.errorMessage!=="" || this.state.uploadedDigitImage === ""}
                            onClick={() => this.getPrediction()}
                        >
                            Predict
                        </button>
                    }
                    </Col>
                    <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <button 
                            style={{ borderRadius: '5px', backgroundColor: 'lightgreen', border: 'none', padding: '10px', boxShadow: '2px 2px #888888', width: '200px', color: 'darkgreen' }}
                            onClick={() => this.clearBtn()}
                        >
                            Clear
                        </button>
                    </Col>
                </Row>
                <br/><br/>
                {
                    this.state.isPredicting ?
                    <Row>
                        <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                    :
                    <Row>
                        {
                            this.state.errorMessage ? 
                            <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', color: "red", fontSize: '25px' }}>
                                <b style={{ marginRight: '5px' }}>Error: </b>{this.state.errorMessage}
                            </Col>
                            :
                            null
                        }
                        {
                            this.state.successMessage ? 
                            <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', color: "green", fontSize: '25px' }}>
                                <b style={{ marginRight: '5px' }}>Prediction: </b>{this.state.successMessage}
                            </Col>
                            :
                            null
                        }
                    </Row>
                }
                </div>
            </Container>
        );
    }

    handleChange = (event) => {
        if(event.target.files[0].type !== "image/jpeg" && event.target.files[0].type !== "image/png"){
            this.setState({ 
                errorMessage: "Only jpeg/jpg/png files allowed",
                uploadedDigitImage: "",
                previewImg: ""
            })
            return;
        }
        if(Endpoints.showLogsOnConsole) console.log("image = ",event.target.files[0]);
        this.setState({
            errorMessage: "",
            successMessage: "",
            uploadedDigitImage: event.target.files[0],
            previewImg: URL.createObjectURL(event.target.files[0])
        });
    }

    getPrediction() {
        let url = Endpoints.home.predictDigitFromImage;
        var formData = new FormData();
        formData.append("image", this.state.uploadedDigitImage)
        this.setState({
            isPredicting: true
        });
        axios.post(url, formData)
        .then((response) => {
            if(Endpoints.showLogsOnConsole) console.log("response = ",response);
            this.setState({
                successMessage: "The Predicted Digit is "+ response.data.predicted_number,
                isPredicting: false
            })
        })
        .catch((error) => {
            if(Endpoints.showLogsOnConsole) console.log("error = ",error)
            this.setState({
                isPredicting: false,
                errorMessage: "Something Went Wrong! Please try by uploading a different image or Try again later",
                successMessage: ""
            });
        })
    }

    clearBtn = () => {
        this.setState({
            uploadedDigitImage: "",
            isPredicting: false,
            successMessage: "",
            errorMessage: "",
            previewImg: ""
        })
    }
}

export default PredictDigitFromImage;