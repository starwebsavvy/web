import React from "react";
import { Route, Routes } from 'react-router-dom';
import Landing from './Explore';
import Search from './Search';

const Explore = (): React.JSX.Element => {

    return (
        <Routes>
            <Route path="/" element={ <Landing />} />
            <Route path="/search" element={ <Search /> } />
        </Routes>
    )
}

export default Explore;