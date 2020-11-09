import React, { useState, useMemo } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import { UserContext } from './context';

const App = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const userDetails = useMemo(() => {
		return {
			getDetails: (name,room) => {
				setName(name);
				setRoom(room);
            },
            name,
            room
		};
	}, [name, room]);

    return (
        <Router>
            <UserContext.Provider value={userDetails}>
                <Route exact path="/" component={Join} />
                <Route path="/chat" component={Chat} />
            </UserContext.Provider>
        </Router>
    );
}

export default App;