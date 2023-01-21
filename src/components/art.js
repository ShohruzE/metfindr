import React, { useState, useEffect } from 'react';
import axios from 'axios';

import departments from'../objects/departments.json';


export default function Art() {

    const [artPiece, setArtPiece] = useState({});
    const [objectIds, setObjectIds] = useState([]);

    const [favorites, setFavorites] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

    // Effect for first render to get all objects
    useEffect(() => {
        const fetchObjects = async () => {
            const result = await axios.get(`${API_URL}/objects`);
            console.log(result.data);
            setObjectIds(result.data.objectIDs);
        };
        fetchObjects();
    }, []);

    // EFfect for filtered departments
    useEffect(() => {
        let allIdsString = '';
        filtered.forEach(id => {
            allIdsString += id + '|';
        });
        console.log(allIdsString);

        const fetchFilteredObjects = async () => {
            const result = await axios.get(`${API_URL}/objects?departmentIds=${allIdsString}`);
            console.log(result.data);
            setObjectIds(result.data.objectIDs);
        };
        fetchFilteredObjects();
    }, [filtered]);

    // Effect that checks local storage for saved artworks 
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
        if (storedFavorites) {
            setFavorites(storedFavorites);
        }
    }, []);

    /*
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    */

    const handleGenerator = async () => {
        const randomIndex = Math.floor(Math.random() * objectIds.length);
        const randomId = objectIds[randomIndex];

        const result = await axios.get(`${API_URL}/objects/${randomId}`);;

        if (result.data.primaryImage === '') {
            handleGenerator();
        }
        else {
            setArtPiece(result.data);
        }
        console.log(result.data);
    };


    const handleFilter = (event) => {
        console.log('pressed');

        const id = event.target.id;
        if (event.target.checked) {
            setFiltered([...filtered, id]);
        }
        else {
            setFiltered(filtered.filter(dept => dept !== id));
        }
        console.log(filtered);
    };


    const handleFavorite = (artPiece) => {

        console.log('favorited');
        
        const isFavorited = favorites.find(a => a.objectID === artPiece.objectID);
        if (!isFavorited) {
            setFavorites([...favorites, artPiece]);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        else {
            alert('This artwork has already been favorited!');
        }
        console.log(favorites);
    };


    return (
        <div className = 'container'>

            <div className = 'filter'>
                <h1>Filter by Departments</h1>
            {
                departments.departments.map(department => (
                    <div className = 'item'>
                        <input type='checkbox' id = {department.departmentId} value = {department.displayName} onChange={handleFilter}/>
                        <label key={department.departmentId} htmlFor = {department.departmentId}>{department.displayName}</label>
                    </div>

                ))
            }
            <button className = 'filterButton' onClick={() => setFiltered(filtered)}>Save Filter</button>
            </div>
            <div className = 'art'>
                <div className = 'card'>
                    <img
                    src={artPiece.primaryImage} 
                    alt={artPiece.title}
                    />
                    <div className = 'content'>
                        <h2>{artPiece.title}</h2>
                        <h3>{artPiece.objectDate}</h3>
                        {
                            (artPiece.artistDisplayName === "") ? 
                                (<h4>Unknown Artist</h4>) :
                            (<h4>{artPiece.artistDisplayName}</h4>)
                        }
                        <span>{artPiece.culture}</span>

                    </div>
                    
                </div>
                <div className = 'buttons'>
                    <button onClick={() => {handleGenerator()}}>Generate</button>
                    <button className='favoriteButton'onClick={() => {handleFavorite(artPiece)}}>Favorite</button>
                </div>
            </div>

            <div className = 'favorites'>
                <h1>Favorites</h1>
                <div className = 'cards'>
                    {
                        favorites.map(artPiece => (
                            <div className = 'card'>
                                <img
                                src={artPiece.primaryImageSmall} 
                                alt={artPiece.title}
                                />
                                <div className = 'content'>
                                    <h2>{artPiece.title}</h2>
                                </div>
                            </div>
                        ))
                    }
                </div>
                
            </div>
        </div>

    );
}