import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INVITES } from '../../utils/queries'
import { ACCEPT_INVITE, DECLINE_INVITE } from '../../utils/mutations'



const ReceiveInvites = () => {
  const {loading, data} = useQuery(GET_INVITES, 
    {pollInterval: 1000})
    const [acceptInvite, { error }] = useMutation(ACCEPT_INVITE);
    const [declineInvite] = useMutation(DECLINE_INVITE);

    if(!loading){
        console.log(data.me.openInvites);
        data.me.openInvites.map(invite => {
            console.log(invite.username);
        })
    }
    const handleAccept = async (username) => {
        try {
          await acceptInvite({
            variables: { username: username },
          });
        } catch (e) {
          console.log(e);
        }
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
              <div>
                  <h4>
                  {invite.username} invited you to play a game! Would you like to accept or deny?
                  </h4>
                  <button onClick={() => handleAccept(invite.username)}>Accept</button>
                  <button onClick={() => handleDeny(invite.username)}>Deny</button>
              </div>
              ))}
          </div>
        )}
    </div>
  );
};

export default ReceiveInvites;