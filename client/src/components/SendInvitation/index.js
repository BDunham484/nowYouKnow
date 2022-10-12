import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../../utils/auth";
import {
  SEND_INVITE,
  CANCEL_INVITE,
  NEW_GAME,
  JOIN_GAME,
} from "../../utils/mutations";
import { GET_USER_INFO, GET_ME } from "../../utils/queries";
import { questions } from "../../assets/variables/questions";
import "./SendInvitation.scss";

function SendInvite() {
  const [opponentData, setOpponentData] = useState({
    username: "",
    submitSuccess: false,
  });
  const { username: opponentUsername, submitSuccess } = opponentData;
  const [formState, setFormState] = useState({
    username: "",
    category: "",
    fieldsEmpty: false,
  });
  const { username, category, fieldsEmpty } = formState;
  const [newGame] = useMutation(NEW_GAME);
  const [joinGame] = useMutation(JOIN_GAME);
  const [sendInvite, { error }] = useMutation(SEND_INVITE);
  const [cancelInvite] = useMutation(CANCEL_INVITE);
  const categories = Object.keys(questions);
  const { data: myData } = useQuery(GET_ME);
  const { loading, data } = useQuery(GET_USER_INFO, {
    variables: { username: opponentUsername },
    skip: !submitSuccess,
    pollInterval: 1000,
  });

  const handleSubmitInvite = async (event) => {
    event.preventDefault();
    if (category && username) {
      try {
        await sendInvite({
          variables: { username: username, category: category },
        });
        setOpponentData({
          ...opponentData,
          username: username,
          submitSuccess: true,
        });
        setFormState({
          ...formState,
          fieldsEmpty: false,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      setFormState({
        ...formState,
        fieldsEmpty: true,
      });
    }
  };

  const handleCancelInvite = async () => {
    try {
      await cancelInvite({
        variables: { username: username },
      });
      setOpponentData({
        ...opponentData,
        username: "",
        submitSuccess: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const startGame = async () => {
    try {
      await newGame({
        variables: { category: category, opponent: username },
      });
    } catch (e) {
      console.log(e);
    }
    try {
      await joinGame();
    } catch (e) {
      console.log(e);
    }
    handleCancelInvite();
    window.location.replace("/Game");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  if (!loading && submitSuccess) {
    const opponentAnswer = data.user.openInvites.find(
      (invite) => invite.username === myData.me.username
    );
    if (opponentAnswer) {
      if (opponentAnswer.accepted) {
        startGame();
      }
    } else {
      setOpponentData({
        ...opponentData,
        username: "",
        submitSuccess: false,
      });
    }
  }

  if (Auth.loggedIn()) {
    return (
      <div className="container my-1">
        <h2>Send an invite to a friend!</h2>
        <form className="form">
          {submitSuccess ? (
            <div>
              You sent an invite to {username} in category: {category}
            </div>
          ) : (
            <div className="flex-row space-between my-2 form-container">
              <label htmlFor="category">Choose a category</label>
              <select id="category" name="category" onChange={handleChange}>
                <option value="" disabled selected>
                  categories...
                </option>
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
              <label htmlFor="username">Who would you like to play?</label>
              <input
                placeholder="opponent username..."
                name="username"
                id="username"
                onChange={handleChange}
              />
            </div>
          )}
          {fieldsEmpty && <p>You must pick a category and username</p>}
          {error ? (
            <div>
              <p className="error-text">This user does not exist</p>
            </div>
          ) : null}
          <div className="flex-row flex-end">
            {submitSuccess ? (
              <button className="btn-center" onClick={handleCancelInvite}>
                Cancel Invitation
              </button>
            ) : (
              <button className="btn-center" onClick={handleSubmitInvite}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    );
  } else {
    return <div>Login to send or receive a Game Invite</div>;
  }
}

export default SendInvite;
