import React from 'react';
import pf from 'petfinder-client';
import { navigate } from '@reach/router';

import Carousel from './Carousel';
import Modal from './Modal';

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Details extends React.Component {
  state = {
    loading: true,
    error: false,
    showModal: false
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

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }

    if (this.state.error) {
      return <h1>Error: {this.state.error}</h1>;
    }

    const {
      name,
      animal,
      breed,
      location,
      media,
      description,
      showModal
    } = this.state;

    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>
            {animal} - {breed} - {location}
          </h2>
          <button onClick={this.toggleModal}>Adopt {name}</button>
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <h1>Would you like to adopt {name}?</h1>
              <div className="buttons">
                <button onClick={this.toggleModal}>Yes</button>
                <button onClick={this.toggleModal}>Definitely Yes</button>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Details;
