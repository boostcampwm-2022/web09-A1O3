import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// img
import addPostButtonImg from '../../static/addPost.svg';
// style
import NaverMap from './MapPageStyles';
// component
import NormalTopBar from '../../components/NormalTopBar/NormalTopBar';
import NavBar from '../../components/NavBar/NavBar';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

const MapPage = () => {
  const navigation = useNavigate();
  const { naver } = window;
  const [currentLocation, setCurrentLocation] = useState<
    { latitude: number; longitude: number } | string
  >('');

  const addPostButton = {
    buttonImg: addPostButtonImg,
    eventHandler: () => {
      navigation('/new-post');
    },
    description: '게시물을 추가할래요.',
  };

  /* 위치 가져오기 */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      // eslint-disable-next-line
      window.alert('현재위치를 알수 없습니다.');
    }
  }, []);

  /* 위치 마커 표시하기 */
  useEffect(() => {
    if (typeof currentLocation !== 'string') {
      const currentPosition = [
        currentLocation.latitude,
        currentLocation.longitude,
      ];

      const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(currentPosition[0], currentPosition[1]),
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      const currentMarker = () => {
        return new naver.maps.Marker({
          position: new naver.maps.LatLng(
            currentPosition[0],
            currentPosition[1],
          ),
          map,
          // 원하는 이미지로 마커 커스텀
          // icon: {
          //     url: pinImage,
          //     size: new naver.maps.Size(50, 52),
          //     origin: new naver.maps.Point(0, 0),
          //     anchor: new naver.maps.Point(25, 26),
          //   },
        });
      };
      currentMarker();
    }
  }, [currentLocation]);

  return (
    <>
      <NormalTopBar buttonData={addPostButton} />
      <NaverMap>
        <div id="map" style={{ width: '100%', height: '100%' }} />
      </NaverMap>
      <NavBar />
    </>
  );
};

export default MapPage;