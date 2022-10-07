import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INVITES} from '../../utils/queries'



const ReceiveInvites = () => {
  const {loading, data} = useQuery(GET_INVITES, 
    {pollInterval: 1000})

  return (
    <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <div>{data.me.openInvites.length}</div>
        )}
    </div>
  );
};

export default ReceiveInvites;