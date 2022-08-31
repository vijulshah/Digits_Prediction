const PORT = '5000';

//LOCAL
const BaseURL = 'http://localhost:'+PORT+'/';

const Endpoints = {
    showLogsOnConsole: true,
    home: {
        predictDigitFromImage: BaseURL + 'predict-digit-from-image'
    }
}

export default Endpoints;
