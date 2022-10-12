import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_USER } from "../../utils/mutations";
import "./Signup.scss";

function Signup(props) {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('handleFormSubmit clicked!')
    // const mutationResponse = await addUser({
    //   variables: {
    //     email: formState.email,
    //     password: formState.password,
    //     username: formState.username
    //   },
    // });

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      console.log(data);

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }

    // const token = mutationResponse.data.addUser.token;
    // Auth.login(token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="wrapper">
      <div className="login-form">
        <div className="container my-1">
          <i className="fa-regular fa-user"></i>
          <h2>Signup</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="flex-row space-between my-2">
              <input
                placeholder="username"
                name="username"
                type="username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div className="flex-row space-between my-2">
              <input
                placeholder="youremail@test.com"
                name="email"
                type="email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="flex-row space-between my-2">
              <input
                placeholder="******"
                name="password"
                type="password"
                id="pwd"
                onChange={handleChange}
              />
            </div>
            <div className="button-class">
              <button type="submit">signup</button>
            </div>
            <Link to="/login">← Go to Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
