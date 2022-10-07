import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import SendInvite from '../components/SendInvitation';
import ReceiveInvites from '../components/ReceiveInvitation';


const Home = () => {
const login = Auth.loggedIn()
return (
  <div>
    <div className="container">
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="particles"></div>
      <div className="border"></div>
      <div className="border"></div>
    </div>
  {login ? (
    <>
      <div></div>
      <SendInvite />
      <ReceiveInvites />
    </>

  ) : (
    <>
    <div>
      <h2>Login to start playing!</h2>
    </div>
    </>
  )}
  </div>
)
}

export default Home;