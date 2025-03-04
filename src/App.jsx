import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FilmDetails from './filmDetails.jsx';
import { gsap } from 'gsap';
import './App.css';
import './FilmDetails.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('Detective Conan');
  const [filter, setFilter] = useState([]);
  const [detail, setDetail] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const motionRef = useRef(null);
  const buttonRef = useRef(null);

  gsap.defaults({
    duration: 0.3,
    ease: 'power1.out'
  });

  useEffect(() => { //Button
    const ctx = gsap.context(() => {

      const button = buttonRef.current;

      const onMouseEnter = () => {
        if (gsap.isTweening(button)) {
          gsap.killTweensOf(button);
        }
        gsap.to(button, { scale: 1.3 });
      };

      const onMouseLeave = () => {
        if (gsap.isTweening(button)) {
          gsap.killTweensOf(button);
        }
        gsap.to(button, { scale: 1 });
      };

      const onMouseDown = () => {
        if (gsap.isTweening(button)) {
          gsap.killTweensOf(button);
        }
        gsap.to(button, { scale: 0.9, duration: 0.1, ease: 'power1.inOut' });
      };

      const onMouseUp = () => {
        if (gsap.isTweening(button)) {
          gsap.killTweensOf(button);
        }
        gsap.to(button, { scale: 1.2, duration: 0.5, ease: 'bounce.out' });
      };

      button.addEventListener('mouseenter', onMouseEnter);
      button.addEventListener('mouseleave', onMouseLeave);
      button.addEventListener('mousedown', onMouseDown);
      button.addEventListener('mouseup', onMouseUp);

      return () => {
        button.removeEventListener('mouseenter', onMouseEnter);
        button.removeEventListener('mouseleave', onMouseLeave);
        button.removeEventListener('mousedown', onMouseDown);
        button.removeEventListener('mouseup', onMouseUp);
      };
    }, motionRef);

    return () => ctx.revert(); 

  }, []);

  useEffect(() => { //transition
    if (motionRef.current) {
      const elements = motionRef.current.children;
      gsap.fromTo(
        elements,
        { y: '-50px', opacity: 0 },
        { y: '0px', opacity: 1, duration: 1, ease: 'power3.outIn', stagger: 0.2 }
      );
    }
  }, [movies]);

  useEffect(() => { //container
    if (motionRef.current) {
      const ctx = gsap.context(() => {

        const onMouseEnter = (event) => {
          const target = event.currentTarget;
          if (gsap.isTweening(target)) {
            gsap.killTweensOf(target);
          }
          gsap.to(target, { scale: 1.05 });
        };

        const onMouseLeave = (event) => {
          const target = event.currentTarget;
          if (gsap.isTweening(target)) {
            gsap.killTweensOf(target);
          }
          gsap.to(target, { scale: 1 });
        };

        const containers = motionRef.current.children;
        for (const container of containers) {
          container.addEventListener('mouseenter', onMouseEnter);
          container.addEventListener('mouseleave', onMouseLeave);
        }

        return () => {
          for (const container of containers) {
            container.removeEventListener('mouseenter', onMouseEnter);
            container.removeEventListener('mouseleave', onMouseLeave);
          }
        };
      }, motionRef);

      return () => ctx.revert(); 
    }
  }, [movies]);

  const getFilm = async () => {
    try {
      Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the movies.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false
      });
      const response = await axios.get(`https://imdb.iamidiotareyoutoo.com/search?q=${search}`);
      setMovies(response.data.description);
      setFilter(response.data.description);
      Swal.close();
      Swal.fire('Success', 'Movies loaded successfully', 'success');
    } catch (error) {
      Swal.close();
      Swal.fire('Error', 'Failed to fetch movies. Please try again later.', 'error');
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    getFilm();
  };

  useEffect(() => {
    getFilm();
  }, []);

  const openModal = (movie) => {
    setIsOpen(true);
    setDetail(movie);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDetail(null);
  };

  return (
    <div>
      <div className="header">
        <h1 className="title">Movie Collection</h1>
        <input value={search} type="text" placeholder="search" onChange={handleInputChange} />
        <button ref={buttonRef} onClick={handleSearchClick}>Search</button>
      </div>
      <div ref={motionRef} className="mapMovie">
        {filter.map((movie) => (
          <div className="movie" key={movie['#IMDB_ID']}>
            <img src={movie['#IMG_POSTER']} alt={movie['#TITLE']} />
            <h1>{movie['#TITLE']}</h1>
            <div className="info">
              <p>{movie['#YEAR']}</p>
              <p>#{movie['#RANK']}</p>
            </div>
            <button onClick={() => openModal(movie)}>More Info</button>
            <p className="cast">cast:<br />{movie['#ACTORS']}</p>
          </div>
        ))}
      </div>
      {isOpen && <FilmDetails isOpen={isOpen} movie={detail} onClose={closeModal} />}
    </div>
  );
}

export default App;

