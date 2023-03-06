import React from 'react';
import './App.css';

import l1 from './logov.png';
const Home = () => {


  return (
    <>
    <div className="main-logo">
    <img src={l1} alt="Not Found"/>
    </div>
<div className="a1">
      <section className="app-download">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="section-title ">
                <h2>DOWNLOAD<span> OUR APP</span></h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="app-download-item">
                <i className="fab fa-google-play"> </i>
                <h3>GOOGLE PLAY</h3>
                <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                <a href="#" className="btn btn-2">DOWNLOAD NOW</a>

              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="app-download-item">
                <i className="fab fa-apple"> </i>
                <h3>APPLE STORE</h3>
                <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                <a href="#" className="btn btn-2">DOWNLOAD NOW</a>

              </div>
            </div>

            
          </div>
        </div>
      </section>


</div>

    </>



  )

}

export default Home;



