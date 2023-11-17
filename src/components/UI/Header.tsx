import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
const Header = () => {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };
    return (
        <>
            <nav className='flex items-center justify-between bg-slate-900 basis-1/10'>
                <img className='pl-8' alt='logo' src={process.env.PUBLIC_URL + '/logo.png'} />
                <ul className='pr-8 flex justify-around text-main-color text-2xl'>
                    <li className='ml-4'>
                        <FontAwesomeIcon onClick={() => handleNavigate('/')} icon={faHouse} />
                    </li>
                    <li className='ml-4'>
                        <FontAwesomeIcon onClick={() => handleNavigate('/map')} icon={faTruckMedical} />
                    </li>
                    <li className='ml-4'>
                        <FontAwesomeIcon onClick={() => handleNavigate('/weather')} icon={faCloud} />
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Header;