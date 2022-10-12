import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import SendInvite from '../components/SendInvitation'
import ReceiveInvites from '../components/ReceiveInvitation'
import { GET_ME } from '../utils/queries'
import "../Styles/index.scss";


const Home = () => {
  const login = Auth.loggedIn()
  const { loading, data } = useQuery(GET_ME)

  if(!loading && login){
    if(data.me.inGame){
      window.location.replace('/Game')
    }
  }


    return (
  <div>
  {login ? (
    <>
      <div>
        <div className="top">
          <h2>Scroll down to get started!</h2>
        </div>
        <div className="howto">
          <h2>Rules of the Game:</h2>
          <div className="text-section">
              <p> 1. Choose a category of questions. </p>
              <p> 2. Enter your friend's username for their account and send them an invitation to play with you! </p>
              <p> 3. Once your friend accepts your invitation, the game will automatically start.</p>
              <p> 4. Type in the answer to the question for yourself in the "your answer" section.</p>
              <p> 5. Type in what you think is your friend's answer is in "your guess" section.</p>
              <p> 6. Only use one word answers, and make sure you spell correctly!</p>
              <p> 7. Click submit and see if you really know your friend!</p>
          </div>
          <div className="wave">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
          </div>
          <div className="wave-bottom">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
          </div>
        </div>
      </div>
      <SendInvite />
      <ReceiveInvites />
    </>
  ) : (
    <>
      <div>
      <div className="top">
        <h2>Do You Know Your Friend? Does Your Friend Really Know You?</h2>
      </div>
          <div className="howto">
            <div className="wave">
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
              </svg>
            </div>

            <h2 className="howto-title">Play To Find Out!</h2>
            <div className="text-section">
              <p> 1. Login or Signup </p>
              <p> 2. Choose a category of questions. </p>
              <p> 3. Enter your friend's username for their account and send them an invitation to play with you! </p>
              <p> 4. Once your friend accepts your invitation, the game will automatically start.</p>
              <p> 5. Type in the answer to the question for yourself in the "your answer" section.</p>
              <p> 6. Type in what you think is your friend's answer is in "your guess" section.</p>
              <p> 7. Only use one word answers, and make sure you spell correctly!</p>
              <p> 8. Click submit and see if you really know your friend!</p>
            </div>
              <div className="wave-bottom">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
              </div>
          </div>
        </div>
    </>
  )}
  </div>
)
}

export default Home;