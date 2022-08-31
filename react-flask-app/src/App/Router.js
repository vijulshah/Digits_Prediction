import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainWrapper from './MainWrapper';
// Predict Image Page
import PredictDigitFromImage from '../Home/PredictDigitFromImage.js';

const Router = () => (
    <MainWrapper>
      <main>
        <Routes>
          <Route exact path="/" element={<PredictDigitFromImage/>} />
        </Routes>
    </main>
  </MainWrapper>
);

export default Router;