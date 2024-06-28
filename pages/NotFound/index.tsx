import React from 'react';
import { Link } from 'react-router-dom'

export default function NotFound () {
    return (
        <div className="page-not-found w-full text-center">
            <h1 className='text-5xl text-center mt-24'>404 Not Found!</h1>
            <div className='flex flex-col justify-center items-center'>
                <Link to='/explore' className='text-3xl mt-8'>Explore BAE</Link>
            </div>
        </div>
    )
}