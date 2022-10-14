import React, { useState, useRef } from "react";
import { useMutation, useQuery } from '@apollo/client';
import Auth from "../../utils/auth";
import { SEND_INVITE, CANCEL_INVITE, NEW_GAME } from '../../utils/mutations';
import { GET_USER_INFO, GET_ME } from '../../utils/queries'
import { questions } from '../../assets/variables/questions';
import './SendInvitation.scss';



function SendInvite() {

  // The opponents username once an invite is sent, and whether or not you successfully submitted an invite
  const [opponentData, setOpponentData] = useState({ username: '', submitSuccess: false, category: '' })
  const { username: opponentUsername, submitSuccess, category } = opponentData

  // The keeps track of username and category chosen in form, whether you tried to submit with an empty fields,
  //  and whether you tried to send an invite to themselves
  const usernameRef = useRef()
  const categoryRef = useRef()

  // mutation for starting a new Game
  const [newGame] = useMutation(NEW_GAME)
  // mutation for sending an invite
  const [sendInvite, { error, reset }] = useMutation(SEND_INVITE);
  // mutation for canceling a sent invite
  const [cancelInvite] = useMutation(CANCEL_INVITE);

  // creating an array of category names from the questions object
  const categories = Object.keys(questions)

  // query to get logged in users data
  const { loading: myLoading, data: myData } = useQuery(GET_ME)

  // query your opponents data to check if they have accepted your invitation
  // only starts query once you have successfully submitted 
  // run query once a second to check if they have accepted invitation
  const { loading, data } = useQuery(GET_USER_INFO, {
    variables: { username: opponentUsername },
    skip: !submitSuccess,
    pollInterval: 1000
  });

  // when you click the submit button on your invitation
  const handleSubmitInvite = async (event) => {
      event.preventDefault();
      reset()
      try {
        // use mutation to send invite using the username you typed and category you chose
        await sendInvite({
          variables: { username: usernameRef.current.value, category: categoryRef.current.value },
        });
        // upon success, update opponent data with their username,
        //  and update that you have successfully submitted an invite
        setOpponentData({
          ...opponentData,
          username: usernameRef.current.value,
          category: categoryRef.current.value,
          submitSuccess: true
        })

      } catch (e) {
        console.log(e);
      }
}

  // when a sent invite is canceled by the user or their opponent
  const handleCancelInvite = async () => {
      try {
          // cancel invite mutation with the opponents username as the variable
          await cancelInvite({
            variables: { username: opponentUsername },
          });
          // reset opponent data to be no username, and set submit Success back to false
          setOpponentData({
              ...opponentData,
              username: '',
              submitSuccess: false
          })
        } catch (e) {
          console.log(e);
        }
  }

  // start a game
  const startGame = async () => {
    try {
      // mutation to start a new game with your opponent in a certain category
      await newGame({
        variables: { category: category, opponent: opponentUsername },
      });
    } catch (e) {
      console.log(e);
    }
    // once the game is started, the invite should be deleted from your opponents open invited
    // Then go to the game page
    handleCancelInvite();
    window.location.replace('/Game')
  }

  // once you have successfully submitted an invite, query your opponent to check if they accepted your invite

  if(!loading && submitSuccess) {
    // find your invite in your opponent's list of invites
    const openInvite = (data.user.openInvites.find(invite => invite.username === myData.me.username))
    if (openInvite) {
      // if they accept your invite, start a game
      if(openInvite.accepted){
      startGame();
      }
      // if there is no invite found
    } else {
      setOpponentData({
        ...opponentData,
        username: '',
        submitSuccess: false
      })
    }
  }

  
  if (Auth.loggedIn()) {
    return (
      <div className="container my-1">
      <h2>
        Send an invite to a friend or have them send one to you! <br></br>
        {!myLoading && (<> Your username is: {myData.me.username}</>)}<br></br>
        Capitalization matters! Good luck
        </h2>
      <form>
        {submitSuccess ? (
          <div className="inv-sent">You sent an invite to {opponentUsername} in category: {category}</div>
        ) : (
        <div className="flex-row space-between my-2 form-container">
          <label htmlFor="category">Choose a category:</label>
          <select id="category" name="category" ref={categoryRef} defaultValue="">
            <option value="" disabled>categories...</option>
            {/* map over categories and create an option in the drop down for each one */}
            {categories.map(category => (
              <option value={category} key={category}>{category}</option>
            ))}
          </select>
          <label htmlFor="username">Who would you like to play?</label>
          <input
            placeholder="opponent username..."
            name="username"
            id="username"
            ref={usernameRef}
          />
        </div>
        )}
        {/* display this if there is a submit error */}
        {error && (
        <div>
          <p className="error-text">{error.message}</p>
        </div>
        )}
        <div className="flex-row flex-end">
          {/* display submit button before invite is submitted, and cancel button after invite is submitted */}
          {submitSuccess ? (
              <button className="btn-cancel" onClick={handleCancelInvite}>Cancel Invitation</button>
          ): (
              <button className="btn-center" onClick={handleSubmitInvite}>Submit</button>
          )}
        </div>
      </form>
    </div>
    
    );
  } else {
    return (
      <div>Login to send or receive a Game Invite</div>
    );
  }
}
export default SendInvite;
