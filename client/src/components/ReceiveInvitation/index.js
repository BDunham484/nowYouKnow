import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INVITES } from '../../utils/queries';
import { ACCEPT_INVITE, DECLINE_INVITE, NEW_GAME } from '../../utils/mutations';
import './ReceiveInvitation.scss';


const ReceiveInvites = () => {
    // query that gets your open invitations, updates every second to check for new or canceled ones
    const {loading, data} = useQuery(GET_INVITES, 
      {pollInterval: 1000})

    // graphQl mutations 
    const [acceptInvite] = useMutation(ACCEPT_INVITE);
    const [declineInvite] = useMutation(DECLINE_INVITE);
    const [newGame] = useMutation(NEW_GAME)

    // start the game with the username of your opponent, and the category
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

    // if you choose to accept the invite
    const handleAccept = async (username, category) => {
        try {
          await acceptInvite({
            variables: { username: username },
          });
          startGame(username, category)
        } catch (e) {
          console.log(e);
        }
      };

    // if you choose to decline the invite
    const handleDecline = async (username) => {
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
              {/* map over your open invites and display them with the option to accept or decline */}
              {data.me.openInvites.map((invite, index) => (
              <div id="receive-invite-wrapper" key={index}>
                  <h4>
                  {invite.username} invited you to play a game (Category: {invite.category})! Would you like to accept or decline?
                  </h4>
                  <button onClick={() => handleAccept(invite.username, invite.category)}>Accept</button>
                  <button onClick={() => handleDecline(invite.username)}>Decline</button>
              </div>
              ))}
          </div>
        )}
    </div>
  );
};

export default ReceiveInvites;