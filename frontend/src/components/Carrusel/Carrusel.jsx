import React, { useEffect } from "react";
import './Carrusel.css';

function Nav() {
    useEffect(() => {
        const carousel = document.querySelector('#carouselExampleAutoplaying');
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 2000,
            ride: 'carousel'
        });
    }, []);

    return (
      <>
        <div className="container-fluid contenedor">
        <div id="carouselExampleAutoplaying" className="carousel carouselo slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="/car1.png" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="/car2.png" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="/car3.png" className="d-block w-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
              </div>

      </>
    );
  }

export default Nav;
