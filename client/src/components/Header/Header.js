import React, { useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DELETE_ACCOUNT } from '../../utils/mutations'
import { useMutation } from '@apollo/client'
import Auth from "../../utils/auth";

const Header = () => {

  const [deleteUser] = useMutation(DELETE_ACCOUNT)
  

  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: undefined,
    height: undefined,
  });

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      Auth.logout()
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };
  return (
    <header className={classes.header}>
      <div className={classes.header__content}>
        <Link style={{ textDecoration: "none" }} to="/">
          <h2 className={classes.header__content__logo}>
            <span>N</span>ow<span>Y</span>ou<span>K</span>now
          </h2>
        </Link>

        <nav
          className={`${classes.header__content__nav} ${
            menuOpen ? classes.isMenu : ""
          }`}
        >
          {Auth.loggedIn() ? (
            <>
              <ul>
                <button onClick={handleDeleteAccount}>
                Delete Account
                </button>
              </ul>
              <button>
                <a href="/" onClick={() => Auth.logout()}>
                  Logout
                </a>
              </button>
            </>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </nav>
        <div className={classes.header__content__toggle}>
          {!menuOpen ? (
            <BiMenuAltRight onClick={menuToggleHandler} />
          ) : (
            <AiOutlineClose onClick={menuToggleHandler} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
