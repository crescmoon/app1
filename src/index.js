import React from 'react';
// import { hydrateRoot, createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { hydrate, render } from "react-dom";

const rootElement = document.getElementById("root");
// const root = hydrateRoot(rootElement, <App />);
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}