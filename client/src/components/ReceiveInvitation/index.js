import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INVITES } from '../../utils/queries'
import { ACCEPT_INVITE, DECLINE_INVITE, NEW_GAME } from '../../utils/mutations'



const ReceiveInvites = () => {
    const {loading, data} = useQuery(GET_INVITES, 
      {pollInterval: 1000})
    const [acceptInvite] = useMutation(ACCEPT_INVITE);
    const [declineInvite] = useMutation(DECLINE_INVITE);
    const [newGame] = useMutation(NEW_GAME)

    const startGame = async (username, category) => {
      try {
        await newGame({
          variables: { category: category, opponent: username },
        });
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
              <div>
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