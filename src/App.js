import React from 'react';
import { render } from 'react-dom';
import Pet from './Pet';

class App extends React.Component {
    handleTitleClick() {
        alert('You clicked the title');
    }

    render() {
        return (
            <div>
                <h1>Adopt Me!</h1>
                <Pet name="Winnifred" animal="Dog" breed="Italian Greyhound" />
                <Pet name="Simon" animal="Dog" breed="Italian Greyhound" />
                <Pet name="Rupert" animal="Dog" breed="Italian Greyhound" />
            </div>
        );
    }
}

render(<App />, document.getElementById('root'));
