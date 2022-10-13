import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INVITES, GET_ME } from '../../utils/queries'
import { ACCEPT_INVITE, DECLINE_INVITE, NEW_GAME, JOIN_GAME } from '../../utils/mutations'



const ReceiveInvites = () => {
    const {loading, data} = useQuery(GET_INVITES, 
      {pollInterval: 1000})
    const {loading: myLoading, data: myData} = useQuery(GET_ME, 
      {pollInterval: 1000})
    const [acceptInvite, { error }] = useMutation(ACCEPT_INVITE);
    const [declineInvite] = useMutation(DECLINE_INVITE);
    const [newGame] = useMutation(NEW_GAME)
    const [joinGame] = useMutation(JOIN_GAME)

    const startGame = async (username, category) => {
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
      window.location.replace('/Game')
    }
    const handleAccept = async (username, category) => {
        try {
          await acceptInvite({
            variables: { username: username },
          });
        } catch (e) {
          console.log(e);
        }
        startGame(username, category)

      };

    const handleDeny = async (username) => {
        try {
            await declineInvite({
              variables: { username: username },
            });
          } catch (e) {
            console.log(e);
          }
    };

  return (
    <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <div>
              {data.me.openInvites.map(invite => (
              <div id="receive-invite-wrapper">
                  <h4>
                  {invite.username} invited you to play a game (Category: {invite.category})! Would you like to accept or deny?
                  </h4>
                  <button onClick={() => handleAccept(invite.username, invite.category)}>Accept</button>
                  <button onClick={() => handleDeny(invite.username)}>Deny</button>
              </div>
              ))}
          </div>
        )}
    </div>
  );
};

export default ReceiveInvites;