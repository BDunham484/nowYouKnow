import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import Auth from "../../utils/auth";
import { SEND_INVITE, CANCEL_INVITE } from '../../utils/mutations';


function SendInvite() {
    const [opponentData, setOpponentData] = useState({ username: '', submitSuccess: false })
    const { submitSuccess } = opponentData
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [sendInvite, { error }] = useMutation(SEND_INVITE);
    const [cancelInvite] = useMutation(CANCEL_INVITE);

    const handleSubmitInvite = async (event) => {
        event.preventDefault();
        try {
          await sendInvite({
            variables: { username: formState.username },
          });
          setOpponentData({
              ...opponentData,
              username: formState.username,
              submitSuccess: true
          })
        } catch (e) {
          console.log(e);
        }
      };

    const handleCancelInvite = async () => {
        try {
            await cancelInvite({
              variables: { username: formState.username },
            });
            setOpponentData({
                ...opponentData,
                submitSuccess: false
            })
          } catch (e) {
            console.log(e);
          }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value,
        });
      };

    if (Auth.loggedIn()) {
      return (
        <div className="container my-1">
        <h2>Send an invite to a friend!</h2>
        <form>
          <div className="flex-row space-between my-2">
            <label htmlFor="username">Who would you like to play?</label>
            <input
              placeholder="opponent username..."
              name="username"
              id="username"
              onChange={handleChange}
            />
          </div>
          {error ? (
          <div>
            <p className="error-text">This user does not exist</p>
          </div>
        ) : null}
          <div className="flex-row flex-end">
            {submitSuccess ? (
                <button onClick={handleCancelInvite}>Cancel Invitation</button>
            ): (
                <button onClick={handleSubmitInvite}>Submit</button>
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
