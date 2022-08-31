import React, { Component } from 'react';
import Endpoints from '../API/api.js';
import axios from 'axios';

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
            <div>
                <h3>Predict Digit From Image</h3>
                <span>(Works best with black background)</span><br/><br/><br/>
                {
                    this.state.uploadedDigitImage !== "" ?
                    <div>
                        <img 
                            alt="uploaded image preview" 
                            src={this.state.previewImg} 
                            height="300px"
                            width="300px"
                        />
                        <br/>
                    </div>
                    :
                    null
                }
                <input 
                    type="file" 
                    style={{display: 'none'}}
                    required
                    ref={(fileInput) => this.fileInput = fileInput}
                    onChange = {(event) => this.handleChange(event)}
                />
                <button
                    onClick={() => this.fileInput.click()}
                >
                    Pick Image
                </button>
                <br/><br/>
                <button 
                    style={{marginRight: "10px"}}
                    disabled={this.state.errorMessage!=="" || this.state.uploadedDigitImage === ""}
                    onClick={() => this.getPrediction()}
                >
                    Predict
                </button>
                <button 
                    style={{marginLeft: "10px"}}
                    onClick={() => this.clearBtn()}
                >
                    Clear
                </button>
                <br/><br/>
                {
                    this.state.errorMessage ? 
                    <span style={{color: "red"}}>
                        {this.state.errorMessage}
                    </span>
                    :
                    null
                }
                {
                    this.state.successMessage ? 
                    <span style={{color: "green"}}>
                        {this.state.successMessage}
                    </span>
                    :
                    null
                }
            </div>
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
        axios.post(url, formData)
        .then((response) => {
            if(Endpoints.showLogsOnConsole) console.log("response = ",response);
            this.setState({
                successMessage: "Predicted Digit: "+ response.data.predicted_number
            })
        })
        .catch((error) => {
            if(Endpoints.showLogsOnConsole) console.log("error = ",error)
            this.setState({
                isPredicting: false,
                errorMessage: "Something Went Wrong! Please try by uploading a different image or Try again later",
                successMessage: ""
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        errorMessage: "",
                        successMessage: ""
                    });
                },5000)
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