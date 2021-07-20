// components/login.js
import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TextInput, Alert, ActivityIndicator, TouchableHighlight } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { getToken, setToken } from './async_storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loginBackend } from './database/datafetch';

import TouchID from 'react-native-touch-id';
import { TouchableOpacity } from 'react-native-gesture-handler';

const optionalConfigObject = {
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
}

export default class Login extends Component {

  //constructor where everything is initialized
  constructor() {
    super();

    /*State variables used throughout the class React.Component
    Please view https://www.geeksforgeeks.org/component-state-react-native/ for more details on using state varibles */
    this.state = {
      email: '',
      usePhoneBiometrics: false,
      isLoading: false,
      errorMsg: "",
      saveEmail: false,
    }
  }


  /* Builtin React Native function which is called AFTER the FIRST render of the page
  Please view https://reactjs.org/docs/react-component.html for more detail */
  async componentDidMount() {


    //Async storage to see if user is using FACEID for application
    var usePhoneBiometrics = await getToken('@use_phone_biometrics')
    if (usePhoneBiometrics == "1") {
      /* Uncomment this section to allow phoneBiometrics. Need to find a way to connect with keycloak for authentication */
      //this.phoneBiometrics()
    }

    //Remember me feature. For users to not need to input email every time for login
    // If @user_email is not null, this means, user has REMEMBER ME feature on. Email is saved on device
    var userEmail = await getToken('@user_email')
    if (userEmail != null) {
      this.updateInputVal(userEmail, 'email')
    }

  }

  /* PHONE Biometrics (NOT SHOPTAKI BIOMETRICS)
  Check that user device is capable of biometrics capabilities */
  phoneBiometrics = () => {

    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        // Success code
        if (biometryType === 'FaceID') {
          this.authPhoneBiometrics()
        } else {
          console.log('TouchID is supported.');
        }
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }

  /*Authenticate user with phone biometrics.
  Please view https://www.npmjs.com/package/react-native-touch-id for more detail on the use of the TouchID library */
  authPhoneBiometrics = () => {
    TouchID.authenticate('Login to Application', optionalConfigObject)
      .then(success => {
        this.props.navigation.navigate('Dashboard')
      })
      .catch(error => {
        Alert.alert('Not Recognized');
      });
  }

  //signin function. Signing in to cognito
  signIn = async () => {

    if (this.errorCheckUser())
      return

    try {
      this.setState({
        isLoading: true,
      })

      /* Auth.signIn function is a builtin AMPLIFY function used to login users to AWS Cognito 
      Only requires user email for registration 
      https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js  */

      // Hitting the keycloak token endpoint, function in datafetch.js
      const login = await loginBackend(this.state.email);
      setToken("@conf_Code", login);
      if (parseInt(login) < 0) {
        this.setState({
          isLoading: false,
        })
        this.updateInputVal(login + "Something went wrong", 'errorMsg')
        console.log('error signing in', login);
      } else {
        this.updateInputVal('', 'errorMsg');
        //removeOnboard checks to remove the onboarding screen with a successful login
        this.removeOnboard()

        this.setState({
          isLoading: false,
        })
        this.props.navigation.navigate('Confirmation',
          {
            keycloakUser: this.state.email,
            storeEmail: this.state.saveEmail,
            usePhoneBiometrics: this.state.usePhoneBiometrics
          }
        )
      }

      //After successful login, navigate to the confirmation page
      //send cognitoUser, and flags(whether they want to store emails/use faceID)
      // this.props.navigation.navigate('Confirmation',
      //   {
      //     cogUser: user,
      //     storeEmail: this.state.saveEmail,
      //     usePhoneBiometrics: this.state.usePhoneBiometrics
      //   })



    } catch (error) {

      //ANY ERROR CAUGHT BY COGNITO WILL BE DISPLAYED HERE
      this.setState({
        isLoading: false,
      })
      this.updateInputVal(error.message, 'errorMsg')
      console.log('error signing in', error);
    }
  }

  //setting @remove_onboard to '1'
  //This means the onboard screen is removed
  removeOnboard = () => {
    setToken('@remove_onboard', '1')
  }

  //update variables function
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }


  /* Error checking function used once the user clicks on SIGN UP 
Methods that are currently checked:

1. Empty string for {email}
2. Validity of email
More CAN be added ......
*/
  errorCheckUser = () => {

    var newErrorMsg = ""

    //CHECKING IF EMAIL IS EMPTY
    if (this.state.email.trim() == "") {
      newErrorMsg = "Please fill in your email"
      this.updateInputVal(newErrorMsg, 'errorMsg')
      return true
    }

    //CHECKING FOR A VALID EMAIL @
    if (!this.state.email.includes("@")) {
      newErrorMsg = "Please enter a valid email"
      this.updateInputVal(newErrorMsg, 'errorMsg')
      return true
    }


    this.updateInputVal("", 'errorMsg')
    return false;
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

        <View style={{ top: '5%' }}>
          <View style={styles.imgView}>
            <Image
              style={styles.imgSize}
              source={require('./logo.png')}
            />
          </View>

          <Text
            style={styles.mainText}>
            Sign in
          </Text>

          <Text
            style={styles.subText}>
            To continue
          </Text>

        </View>


        <View style={{ top: '5%' }}>

          <Text
            style={{ color: "red", marginBottom: 10 }}>
            {this.state.errorMsg}
          </Text>

          <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            placeholderTextColor="#808080"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '10%' }}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', marginBottom: '10%' }}>
              <CheckBox
                disabled={false}
                value={this.state.saveEmail}
                onValueChange={(val) => this.updateInputVal(val, 'saveEmail')}
              />

              <Text style={{ color: "#4c52ba", margin: 10, fontWeight: "bold" }}>
                Remember me
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', marginBottom: '10%' }}>
              <CheckBox
                disabled={false}
                value={this.state.usePhoneBiometrics}
                onValueChange={(val) => this.updateInputVal(val, 'usePhoneBiometrics')}
              />

              <Text style={{ color: "#4c52ba", margin: 10, fontWeight: "bold" }}>
                Use FaceID
              </Text>
            </View>
          </View>


          <TouchableHighlight
            style={{
              backgroundColor: "#243c97",
              borderColor: "#243c97",
              borderRadius: 10,
              borderWidth: 1,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: '5%'
            }}
            onPress={() => this.signIn()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: "bold", fontSize: 16 }}>Sign in</Text>
          </TouchableHighlight>


          <Text
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate('Signup')}>
            Don't have account? Click here to signup
          </Text>

        </View>

        <View style={{ marginTop: '50%', alignItems: 'center', justifyContent: 'center', }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Onboard')}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> About Shoptaki </Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: '3%',
    paddingTop: '3%',
    paddingLeft: 20,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10
  },
  loginText: {
    color: '#4c52ba',
    marginTop: 25,
    marginBottom: 5,
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
  },
  imgSize: {
    width: 80,
    height: 80,
  },
  imgView: {
    textAlign: 'left',
    marginBottom: 20,
  },
  mainText: {
    fontSize: 35,
    fontWeight: "bold"
  },
  subText: {
    fontSize: 15,
    marginBottom: 50
  },
});

