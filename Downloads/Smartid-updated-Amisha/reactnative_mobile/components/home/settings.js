/* This page is not used at the moment */

import React from 'react';
import { View, Button } from 'react-native';
import { Auth } from 'aws-amplify';

export default class Setting extends React.Component {

  signOut = async () => {
    try {
      await Auth.signOut();
      this.props.navigation.navigate('Login')
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        />
      </View>
    );
  }
}