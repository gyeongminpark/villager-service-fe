/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscBell, VscCompass } from 'react-icons/vsc';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Drawer from 'react-modern-drawer';
import { logOutAPI } from '../../api/Users';
import Button from './Button';
import Responsive from './Responsive';
import TownSetup from '../modal/TownSetup';
import { setUserId } from '../../store/User';
import { removeRefreshToken } from '../../app/Cookie';
import { changeLocation } from '../../store/Location';
import 'react-modern-drawer/dist/index.css';
import Notification from './Notification';

const HeaderBlock = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
`;

const Inner = styled(Responsive)`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: #4ab7b6;
  }
  .orange {
    color: #fdaa5d;
    cursor: pointer;
    &:hover {
      color: #fdaa5f;
    }
  }
  .other {
    display: flex;
    align-items: center;
  }
  .bell {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    padding: 0.3rem;
    position: relative;
    .count {
      position: absolute;
      right: 3px;
      top: 0;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: #fdaa5d;
      color: #fff;
      font-size: 0.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .map {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-left: 0.25rem;
    margin-right: 0.5rem;
  }
`;

const Spacer = styled.div`
  height: 4rem;
`;

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.user.value.userId);
  const alerts = useSelector((state) => state.alert.value.alert);
  const { nickname } = useSelector((state) => state.location.value);
  const [isTownSetupModal, setTownSetupModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogOut = () => {
    logOutAPI().then((res) => {
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('access_token');
      localStorage.removeItem('persist:root');
      dispatch(setUserId(null));
      dispatch(
        changeLocation({
          lat: null,
          lng: null,
          nickname: '동네',
          address: null,
        }),
      );
      removeRefreshToken();
      console.log(res);
      navigate('/signin');
    });
  };

  return (
    <>
      {myId && (
        <TownSetup
          show={isTownSetupModal}
          onClose={() => setTownSetupModal(false)}
        />
      )}
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        className="drawer"
        size="70vw"
      >
        <Notification setIsOpen={setIsOpen} />
      </Drawer>
      <HeaderBlock>
        <Inner>
          <div className="logo">
            {myId ? (
              <span className="orange" onClick={() => setTownSetupModal(true)}>
                {nickname}
              </span>
            ) : (
              <span className="orange">동네</span>
            )}
            #람들
          </div>
          <div className="other">
            {!myId ? (
              <Button onClick={() => navigate('/signin')}>로그인</Button>
            ) : (
              <>
                <Button onClick={handleLogOut}>로그아웃</Button>
                <div className="map">
                  <VscCompass onClick={() => navigate('/map')} />
                </div>
                <div className="bell" onClick={toggleDrawer}>
                  <VscBell />
                  {alerts.length > 0 && (
                    <div className="count">{alerts.length}</div>
                  )}
                </div>
              </>
            )}
          </div>
        </Inner>
      </HeaderBlock>
      <Spacer />
    </>
  );
}

export default Header;
