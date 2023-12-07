/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import '../styles/ToggleDark.css'; // Import a separate CSS file for styling

export default function ToggleDark(props) {
  return (
    <div>
      <div className="wrapper">
        <label className={`switch ${props.darkMode ? 'dark' : 'light'}`}>
          <input
            type="checkbox"
            id="checkbox-toggle"
            onClick={() => {
              props.toggleDark();
            }}
          />
          <span className="slider">
            <div className="fish">
              <div className="body"></div>
              <div className="eye"></div>
              <div className="tail"></div>
            </div>
          </span>
          <span className="wave"> </span>
          <div className="boat">
            <div className="bottom"></div>
            <div className="mast"></div>
            <div className="rectangle-sm"></div>
            <div className="rectangle-lg"></div>
          </div>
          <div className="sky">
            <div className="sun">
              <div className="outer"></div>
              <div className="inner"></div>
            </div>
            <div className="cloud cloud1">
              <div className="rect"></div>
              <div className="circle circle-lg"></div>
              <div className="circle circle-sm"></div>
            </div>
            <div className="cloud cloud2">
              <div className="rect"></div>
              <div className="circle circle-lg"></div>
              <div className="circle circle-sm"></div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

