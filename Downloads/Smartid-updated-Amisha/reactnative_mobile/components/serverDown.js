/* This psge is used when Shoptaki servers are down */
/* Please edit the UI in this page as it still needs development */


import React from 'react';
import { Text, View } from 'react-native';
import { Auth } from 'aws-amplify';
import { setToken } from './async_storage'
import { TouchableOpacity } from 'react-native-gesture-handler';



export default class ServerDown extends React.Component {

    constructor() {
        super();
    }

    signOut = async () => {
        try {
            await Auth.signOut();
            await setToken('@auth_token', '')
            this.props.navigation.navigate('Login')
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.signOut()}>
                    <Text> Shoptaki servers are currently down. Click here to log out </Text>
                </TouchableOpacity>
            </View>
        );
    }
}