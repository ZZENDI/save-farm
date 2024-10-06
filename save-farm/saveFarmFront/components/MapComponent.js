import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MapComponent = () => {
    const [mapUrl, setMapUrl] = useState('');

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const response = await axios.get('http://localhost:8081/generate_map');
                setMapUrl(response.data); // 서버에서 지도를 가져옴
            } catch (error) {
                console.error("Error fetching the map:", error);
            }
        };
        fetchMap();
    }, []);

    return (
        <div>
            {mapUrl && <iframe src={mapUrl} width="100%" height="500px" />}
        </div>
    );
};

export default MapComponent;
