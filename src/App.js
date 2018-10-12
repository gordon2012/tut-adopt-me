import React from 'react';
import { render } from 'react-dom';
import Pet from './Pet';
import pf from 'petfinder-client';

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pets: []
    };
  }
  componentDidMount() {
    petfinder.pet
      .find({ output: 'full', location: 'Phoenix, AZ' })
      .then(data => {
        let pets;

        if (data.petfinder.pets && data.petfinder.pets.pet) {
          if (Array.isArray(data.petfinder.pets.pet)) {
            pets = data.petfinder.pets.pet;
          } else {
            pets = [data.petfinder.pets.pet];
          }
        } else {
          pets = [];
        }

        this.setState({ pets });
      });
  }
  render() {
    return (
      <div>
        <h1>Adopt Me!</h1>
        <div>
          {this.state.pets.map(pet => (
            <Pet
              key={pet.id}
              animal={pet.animal}
              name={pet.name}
              breed={
                Array.isArray(pet.breeds.breed)
                  ? pet.breeds.breed.join(', ')
                  : pet.breeds.breed
              }
              media={pet.media}
              location={`${pet.contact.city}, ${pet.contact.state}`}
            >
              {pet.name}
            </Pet>
          ))}
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
