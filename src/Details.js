import React from 'react';
import pf from 'petfinder-client';
import { navigate } from '@reach/router';

import Carousel from './Carousel';

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Details extends React.Component {
  state = {
    loading: true,
    error: false
  };

  componentDidMount() {
    petfinder.pet
      .get({ output: 'full', id: this.props.id })
      .then(data => {
        if (!data.petfinder.pet) {
          this.setState({
            loading: false,
            error: data.petfinder.header.status.message
          });
          return;
        }

        const pet = data.petfinder.pet;
        this.setState({
          name: pet.name,
          animal: pet.animal,
          location: `${pet.contact.city}, ${pet.contact.state}`,
          media: pet.media,
          description: pet.description,
          breed: Array.isArray(pet.breeds.breed)
            ? pet.breeds.breed.join(', ')
            : pet.breeds.breed,
          loading: false
        });
      })
      .catch(() => {
        navigate('/');
      });
  }

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }

    if (this.state.error) {
      return <h1>Error: {this.state.error}</h1>;
    }

    const { name, animal, breed, location, media, description } = this.state;

    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>
            {animal} - {breed} - {location}
          </h2>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

export default Details;
