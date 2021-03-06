import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';
import '../../styles/login.css';
import '../../styles/signup.css';
import Signup from '../../mutations/Signup';
import CurrentUser from '../../queries/CurrentUser';

import facebookIcon from '../../assets/images/icons/facebook_blue.svg';
import googleIcon from '../../assets/images/icons/google_blue.svg';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.data.user && nextProps.data.user) {
      this.props.history.push('/');
    }
  }

  // more es6 destructuring in the arg declaration
  onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query: CurrentUser }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(err => err.message);
      this.setState({ errors });
    });
  }

  // since we're maping over errors, we have to pass in errors when calling AuthForm
  render() {
    return (
      <div className="login-content">
        <AuthForm errors={this.state.errors} onSubmit={this.onSubmit.bind(this)} formType="sign up" />
        <img src={facebookIcon} className="login-icon" alt="facebook login" />
        <img src={googleIcon} className="login-icon" alt="google login" />
        <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    );
  }
}

// order doesn't matter
export default graphql(CurrentUser)(graphql(Signup)(SignupForm));
