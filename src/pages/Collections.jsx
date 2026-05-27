import './Collections.css';
import { useState, useEffect } from 'react';

export default function Collections() {
  const collections = [
    {
      id: 1,
      name: 'Balaclava Collection',
      images: ['balaclava 1.jpg', 'balaclava 2.jpg', 'balaclava 3.jpg', 'balaclava 4.jpg']
    },
    {
      id: 2,
      name: 'Ski Mask Collection',
      images: ['ski mask 1.jpg', 'ski mask 2.jpg', 'ski mask 3.jpg', 'ski mak 4.jpg']
    },
    {
      id: 3,
      name: 'Streetwear Collection',
      images: ['streetwear.jpg', 'streetwear  2.jpg', 'streetwear 3.jpg', 'streetwear 4.jpg']
    },
    {
      id: 4,
      name: 'Jorts Collection',
      images: ['jorts 1.jpg', 'jorts 2.jpg', 'jorts 3.jpg', 'jorts 4.jpg']
    },
    {
      id: 5,
      name: 'Hoodie Collection',
      images: ['hooodie 1.jpg', 'hoodie 2.jpg', 'hoodie 3.jpg', 'hoodie 4.jpg']
    }
  ];

  const [activeSlides, setActiveSlides] = useState({});

  // Initialize active slides
  useEffect(() => {
    const initial = {};
    collections.forEach(collection => {
      initial[collection.id] = 0;
    });
    setActiveSlides(initial);
  }, []);

  // Rotate carousels
  useEffect(() => {
    if (Object.keys(activeSlides).length === 0) return;

    const interval = setInterval(() => {
      setActiveSlides(prev => {
        const updated = { ...prev };
        collections.forEach(collection => {
          updated[collection.id] = (prev[collection.id] + 1) % collection.images.length;
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [collections]);

  return (
    <div className="collections-container">
      <h1>Featured Collections</h1>
      <p className="collection-subtitle">Explore our top picks — Semester Clearance, Streetwear, Jewelry & More</p>
      
      <div className="collections-grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-card carousel">
            <div className="slides-container">
              {collection.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`slide ${activeSlides[collection.id] === index ? 'active' : ''}`}
                >
                  <img src={image} alt={`${collection.name} - Image ${index + 1}`} />
                </div>
              ))}
            </div>
            <h3>{collection.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
