import React, { Component } from 'react';
import AuthForm from './AuthForm';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import Login from '../mutations/Login';
import CurrentUser from '../queries/CurrentUser';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  // react lifecycle hook
  // when our component is about to update this will be called
  componentWillUpdate(nextProps) {
    // nextProps is the props that will be placed on our component the next time it re-renders
    // this.props is the old props and nextProps are the new props
    if (!this.props.data.user && nextProps.data.user) {
       // redirect to about for now
       // NOTE: not sure if this is the right way to do it
      this.props.history.push('/about');
    }
  }

  onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query: CurrentUser }]
    }).catch(res => {
      // this is all of the errors that we get because graphQLErrors returns an array
      const errors = res.graphQLErrors.map(err => err.message);
      this.setState({ errors });
    });
  }

  render() {
    return (
      <div>
        <h5>Login</h5>
        <AuthForm errors={this.state.errors} onSubmit={this.onSubmit.bind(this)} />
        <Link to="/signup">Sign Up</Link>
      </div>
    );
  }
}

// CurrentUser is now assocaited with the component
//- so when CurrentUser query gets updated it will be on this.props.data
export default graphql(CurrentUser)(
  graphql(Login)(LoginForm)
);
