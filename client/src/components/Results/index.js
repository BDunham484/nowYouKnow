import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, GET_USER_INFO } from '../../utils/queries';
import compareUsers from '../../utils/helpers';


const Results = () => {

    const { loading, data: myData } = useQuery(GET_ME);
    const [GameInfo, SetGameInfo] = useState({ opponent: '' })
    const { opponent } = GameInfo

    const { data } = useQuery(GET_USER_INFO, {
        variables: { username: opponent },
    });


    useEffect(() => {
        if (!loading) {
            SetGameInfo({
                ...GameInfo,
                opponent: myData.me.currentGame.opponent
            })
        }
    }, [myData])


    const testing = () => {
        console.log('TEST BUTTON CLICKED');

        console.log('myData!!!!!!!!!!');
        console.log(myData);
        console.log('opponent!!!!!!!');
        console.log(opponent)
        console.log('data!!!!!!!!!');
        console.log(data)
        console.log(compareUsers)
    }




    return (
        <div>
            {loading ? (
                <p>loading...</p>
            ) : (
                <>
                    <button onClick={testing}>TEST</button>
                </>
            )}

        </div>
    );
};

export default Results;