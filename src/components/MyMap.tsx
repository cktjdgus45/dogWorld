import React from 'react';
import { useState, useEffect } from 'react';
import { Container as MapDiv, NaverMap, useNavermaps, InfoWindow } from 'react-naver-maps';
import { hospitals } from '../data/latlon.ts';
import Marker from './Marker.tsx';

export default function MyMap() {
    const navermaps = useNavermaps();
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [infowindow, setInfoWindow] = useState<naver.maps.InfoWindow | null>(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function onSuccessGeolocation(position) {
        if (!map || !infowindow) return
        const location = new navermaps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
        )
        naver.maps.Service.fromCoordToAddr({ coords: location }, function (status, response) {
            if (status !== naver.maps.Service.Status.OK) {
                return alert('Something wrong!');
            }
            const result = response.v2;
            const address = result.address;
            infowindow.setContent(
                '<div style="padding:10px;">' +
                `${address.jibunAddress}` +
                '</div>',
            )
        });

        map.setCenter(location);
        map.setZoom(10);
        infowindow.setPosition(location);
        infowindow.open(map, location)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function onErrorGeolocation() {
        if (!map || !infowindow) return

        const center = map.getCenter()
        infowindow.setContent(
            '<div style="padding:20px;">' +
            '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>' +
            'latitude: ' +
            center.x +
            '<br />longitude: ' +
            center.y +
            '</div>',
        )
        infowindow.open(map, center)

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                onSuccessGeolocation,
                onErrorGeolocation,
            )
        } else {
            const center = map.getCenter()
            infowindow.setContent(
                '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>',
            )
            infowindow.open(map, center)
        }
    }
    useEffect(() => {
        if (!map || !infowindow) {
            return
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                onSuccessGeolocation,
                onErrorGeolocation,
            )
        } else {
            const center = map.getCenter()
            infowindow.setContent(
                '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>',
            )
            infowindow.open(map, center)
        }
    }, [map, infowindow, onSuccessGeolocation, onErrorGeolocation])

    return (
        <MapDiv
            style={{
                position: 'relative',
                width: '100%',
                height: '600px',
            }}
        >
            <NaverMap
                defaultCenter={new navermaps.LatLng(37.5666805, 126.9784147)}
                defaultZoom={10}
                defaultMapTypeId={navermaps.MapTypeId.NORMAL}
                ref={setMap}
            >
                <InfoWindow ref={setInfoWindow} content={'�� ��ġ'} />
                {
                    hospitals.map((hospital) =>
                        <Marker coord={hospital.coord} map={map} hospital={hospital} />
                    )
                }
            </NaverMap>
        </MapDiv>
    )
}
