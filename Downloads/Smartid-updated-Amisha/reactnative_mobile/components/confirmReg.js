// confirmReg.js is not used. Removed if needed

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { Auth } from 'aws-amplify';


export default class confirmReg extends Component {

    constructor(props) {
        super(props);


        this.state = {
            userEmail: props.route.params.email,
            code: '',
            isLoading: false
        }
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    resendConfirmationCode = async () => {
        try {
            await Auth.resendSignUp(this.state.userEmail);
            Alert.alert('Resent Code')
            console.log('code resent successfully');
        } catch (err) {
            console.log('error resending code: ', err);
        }
    }

    confirmSignUp = async () => {
        try {
            await Auth.confirmSignUp(this.state.userEmail, this.state.code);
            Alert.alert("Success")
            this.props.navigation.navigate('Dashboard')

        } catch (error) {
            console.log('error confirming sign up', error);
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Enter code here"
                    value={this.state.code}
                    onChangeText={(val) => this.updateInputVal(val, 'code')}
                />

                <Button
                    color="#3740FE"
                    title="Enter"
                    onPress={() => this.confirmSignUp()}
                />

                <Text
                    style={styles.loginText}
                    onPress={() => this.resendConfirmationCode()}>
                    Resend code? Click here
        </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 20,
        alignSelf: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10
    },
    loginText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});