import React from 'react';
import pf from 'petfinder-client';

import { Consumer } from './SearchContext';
import Pet from './Pet';
import SearchBox from './SearchBox';

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pets: []
    };
  }

  componentDidMount() {
    this.search();
  }

  search = () => {
    const { location, animal, breed } = this.props.searchParams;

    petfinder.pet
      .find({ output: 'full', location, animal, breed })
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
  };

  render() {
    return (
      <div className="search">
        <SearchBox search={this.search} />
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
            id={pet.id}
          >
            {pet.name}
          </Pet>
        ))}
      </div>
    );
  }
}

export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {context => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
