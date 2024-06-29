import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.scss';
import { CgProfile } from 'react-icons/cg';
import { IoIosFitness } from 'react-icons/io';
import { PiNotepad } from 'react-icons/pi';
import { TbHistory } from 'react-icons/tb';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || (path === '/' && location.pathname === '/')
    );
  };

  return (
    <nav className={styles.bottomNav}>
      <NavLink
        to="/"
        className={({ isActive: navLinkIsActive }) =>
          navLinkIsActive || isActive('/') ? styles.active : ''
        }
      >
        <IoIosFitness />
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive: navLinkIsActive }) =>
          navLinkIsActive ? styles.active : ''
        }
      >
        <TbHistory />
      </NavLink>
      <NavLink
        to="/my-program"
        className={({ isActive: navLinkIsActive }) =>
          navLinkIsActive ? styles.active : ''
        }
      >
        <PiNotepad />
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive: navLinkIsActive }) =>
          navLinkIsActive ? styles.active : ''
        }
      >
        <CgProfile />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
