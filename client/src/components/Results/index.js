import React from "react";
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, GET_USER_INFO } from '../utils/queries'


const Results = () => {

    const { loading, data: myData } = useQuery(GET_ME)

    const { data } = useQuery(GET_USER_INFO, {
        variables: { username: opponent },
        skip: !answersSubmitted,
        pollInterval: 1000
    });


    return (
        <div>
        </div>
    );
};

export default Results;