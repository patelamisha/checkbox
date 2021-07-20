import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, TouchableHighlight } from 'react-native';

import { signupBackend, searchuserBackend, loginBackend } from './database/datafetch';

import { registerData } from './database/datafetch';
import DateTimePicker from 'react-native-modal-datetime-picker';

import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';

import PhoneInput2 from "react-native-phone-number-input";

import { TouchableOpacity } from 'react-native-gesture-handler';
import { setToken } from './async_storage'

export default class Signup extends Component {

  //initialize variables
  constructor() {
    super();

    /*State variables used throughout the class React.Component
    Please view https://www.geeksforgeeks.org/component-state-react-native/ for more details on using state varibles */
    this.state = {
      first: '',
      last: '',
      number: '',
      countryNumber: '',
      date: '',
      email: '',
      password: '',
      repeatpassword: '',
      isLoading: false,
      isDatePickerVisible: false,
      errorMessage: '',
      toggleCheckBox: false,

      pickerData: null,
      cca2: 'US',

      isFirstEmpty: false,
      isLastEmpty: false,
      isEmailEmpty: false,
      isNumberEmpty: false,
      isDateEmpty: false
    }
  }

  /* Builtin React Native function which is called AFTER the FIRST render of the page
  Please view https://reactjs.org/docs/react-component.html for more detail */
  componentDidMount() {
    this.setState({
      isLoading: false,
    })
  }


  /* Once user registers, the input sections get reset and set to ''  */
  resetInput = () => {
    this.updateInputVal('', 'first')
    this.updateInputVal('', 'last')
    this.updateInputVal('', 'number')
    this.updateInputVal('', 'countryNumber')
    this.updateInputVal('', 'date')
    this.updateInputVal('', 'email')
    this.updateInputVal('', 'errorMessage')
  }


  /* Error checking function used once the user clicks on SIGN UP 
  Methods that are currently checked:

  1. Empty string for {firstname, lastname, email, number, date of birth, agreement check}
  2. Validity of email
  3. Valid date of birth

  More can be added ......
  */
  errorCheckUser = () => {

    var newErrorMsg = "Please fill in every section indicated in red:\n"

    if (this.state.first.trim() == "") {
      this.state.isFirstEmpty = true
      newErrorMsg += "* First Name\n"
    }
    else this.state.isFirstEmpty = false;

    if (this.state.last.trim() == "") {
      this.state.isLastEmpty = true
      newErrorMsg += "* Last Name\n"
    }
    else this.state.isLastEmpty = false;

    if (this.state.email.trim() == "") {
      this.state.isEmailEmpty = true
      newErrorMsg += "* Email\n"
    }
    else this.state.isEmailEmpty = false;

    if (this.state.number.trim() == "") {
      this.state.isNumberEmpty = true
      newErrorMsg += "* Phone Number\n"
    }
    else this.state.isNumberEmpty = false;

    if (this.state.date.trim() == "") {
      this.state.isDateEmpty = true
      newErrorMsg += "* Date of Birth\n"
    }
    else this.state.isDateEmpty = false;

    if (!this.state.toggleCheckBox) {
      newErrorMsg += "* Please agree to the terms and policy\n"
    }

    if (!this.state.toggleCheckBox || this.state.isFirstEmpty || this.state.isLastEmpty || this.state.isEmailEmpty || this.state.isNumberEmpty || this.state.isDateEmpty) {
      this.updateInputVal(newErrorMsg, 'errorMessage')
      return true
    }

    /* Error checking to make sure email input is a valid email option */
    if (!this.state.email.includes("@")) {
      newErrorMsg = "Please enter a valid email"
      this.updateInputVal(newErrorMsg, 'errorMessage')
      return true
    }

    /* Error checking to make sure date of birth is a valid date*/
    if (!this.testDate(this.state.date)) {
      newErrorMsg = "Please enter a valid date of birth"
      this.updateInputVal(newErrorMsg, 'errorMessage')
      return true
    }

    this.updateInputVal("", 'errorMessage')
    return false;
  }


  /* testDate is the function used in the error checking function for testing the data of birth
  validity */
  testDate = (str) => {
    //checking if the date is in the correct format
    var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    //split date into month, day and year
    var t_date = str.split("/")

    //if array is null return fail
    if (t_date === null)
      return false;

    //Return failure if there is no MONTH & DAY & YEAT
    if (t_date.length != 3)
      return false;


    var d = t_date[0], m = t_date[1], y = t_date[2]
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return true;
    }

    return false;
  }


  /* Main signup function used ONCE the user clicks the SIGNUP button
  Error checking function used in the initial steps

  Once a user clicks the signup button, the isLoading variable is true (meaning, the loading screen pops up for the user)
  Auth.signUp is a builtin Amplify function used to register user to AWS Cognito https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js
  */
  signUp = async () => {

    if (this.errorCheckUser())
      return


    try {

      this.setState({
        isLoading: true,
      })

      // const { user, userConfirmed, userSub } = await Auth.signUp({
      //   username: this.state.email,
      //   password: 'test1234', //PLEASE CHANGE THIS BEFORE RELEASE OF SHOPTAKI. THIS SHOULD BE AN AUTO GENERATED PSEDUO RANDOM ID.
      //   attributes: {
      //     email: this.state.email,   // required
      //     name: this.state.first,   // required
      //     family_name: this.state.last, // required
      //     phone_number: this.state.countryNumber, // required

      //     //other optional attributes
      //     birthdate: this.state.date, // optional
      //   }
      // });

      // signs up with keycloak, and obtains user id for arango if necessary
      const userCreated = await signupBackend(this.state.first, this.state.last, this.state.email);
      console.log(userCreated);
      const user = await searchuserBackend(this.state.email);
      let userid = user.id;


      /* If Auth.signUp is successful, call registerData, which posts the data to ArangoDB(database)
      - userSub (generated user id by Cognito)
      - First name
      - Last name
      - Phone number
      - Date of Birth
      View datafetch,js for more tail on registerData function */
      await registerData(userid, this.state.first, this.state.last, this.state.countryNumber, this.state.date)

      //After both registerData and Auth.signup are complete, sign in user
      await this.signIn()

      //After signIn is complete, reset the inputs made by the user
      this.resetInput()

    } catch (error) {

      /* Any errors caught in the process get logged here. View developement server for details if present */
      this.setState({
        isLoading: false,
      })
      console.log('error signing up:', error);
      this.updateInputVal(error.message, 'errorMessage')

    }
  }

  //signIn function used to login Shoptaki user.
  signIn = async () => {
    try {

      /* Auth.signIn function is a builtin AMPLIFY function used to login users to AWS Cognito 
      Only requires user email for registration 
      https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js  */
      //const user = await Auth.signIn(this.state.email);

      // Hitting the keycloak token endpoint, function in datafetch.js
      const login = await loginBackend(this.state.email);
      setToken("@conf_Code", login);
      if (parseInt(login, 10) < 0) {
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
      }

      //After successful login, navigate to the confirmation page
      this.props.navigation.navigate('Confirmation', { keycloakUser: this.state.email })
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  //setting @remove_onboard to '1'
  //This means the onboard screen is removed
  removeOnboard = () => {
    setToken('@remove_onboard', '1')
  }


  //update variables
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  //Function used to make sure the date of birth is formatted correctly
  handleConfirm = (date) => {

    var dateMonth, dateDay

    if (date.getMonth() + 1 < 10) {
      dateMonth = "0" + String(date.getMonth() + 1)
    } else {
      dateMonth = String(date.getMonth() + 1)
    }

    if (date.getDate() < 10) {
      dateDay = "0" + String(date.getDate())
    } else {
      dateDay = String(date.getDate())
    }

    this.updateInputVal((dateDay + "/" + (dateMonth) + "/" + date.getFullYear()).toString(), 'date');
    this.updateInputVal(false, 'isDatePickerVisible');
  };

  //Hiding the date picker
  hideDatePicker = () => {
    this.updateInputVal(false, 'isDatePickerVisible');
  };


  //HTML
  render() {

    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }


    return (
      <ScrollView style={styles.container}>

        <View>
          <View style={styles.imgView}>
            <Image
              style={styles.imgSize}
              source={require('./logo.png')}
            />
          </View>

          <Text
            style={styles.mainText}>
            Sign up
          </Text>

          <Text
            style={styles.subText}>
            With your email
          </Text>
        </View>


        <View style={{ marginTop: '10%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.inputStyle2, { borderColor: this.state.isFirstEmpty ? "#ff0000" : "#ccc" }]}
              placeholder="First Name"
              placeholderTextColor="#808080"
              value={this.state.first}
              onChangeText={(val) => this.updateInputVal(val, 'first')}
            />
            <TextInput
              style={[styles.inputStyle2, { borderColor: this.state.isLastEmpty ? "#ff0000" : "#ccc" }]}
              placeholder="Last Name"
              placeholderTextColor="#808080"
              value={this.state.last}
              onChangeText={(val) => this.updateInputVal(val, 'last')}
            />
          </View>

          <TextInput
            style={[styles.inputStyle, { borderColor: this.state.isEmailEmpty ? "#ff0000" : "#ccc" }]}
            placeholder="Email"
            placeholderTextColor="#808080"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />

          <PhoneInput2
            defaultCode="US"
            value={this.state.number}
            onChangeText={(val) => this.updateInputVal(val, 'number')}
            onChangeFormattedText={(val) => this.updateInputVal(val, 'countryNumber')}
            placeholder="Phone Number"
            placeholderTextColor="#808080"
            containerStyle={[styles.phoneStyle, { borderColor: this.state.isNumberEmpty ? "#ff0000" : "#ccc" }]}
            textInputStyle={{ fontSize: 14, paddingLeft: 0, paddingTop: 0, paddingBottom: 0, backgroundColor: "white" }}
            textContainerStyle={{ backgroundColor: "white", paddingTop: 7, paddingBottom: 7 }}
            flagButtonStyle={{ backgroundColor: "white", paddingTop: 0, paddingBottom: 0 }}
            codeTextStyle={{ fontSize: 14 }}
          >
          </PhoneInput2>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>

            <TextInput
              style={[styles.inputStyle3, { borderColor: this.state.isDateEmpty ? "#ff0000" : "#ccc" }]}
              placeholder="Date of Birth"
              placeholderTextColor="#808080"
              keyboardType="numbers-and-punctuation"
              value={this.state.date}
              onChangeText={(val) => this.updateInputVal(val, 'date')}
            />

            <View style={{ marginLeft: '5%' }}>
              <TouchableOpacity
                onPress={(val) => this.updateInputVal(true, 'isDatePickerVisible')}>
                <View>
                  <Icon style={{ textAlign: "center" }} name="calendar" size={30} color="#243c97"></Icon>
                </View>
              </TouchableOpacity>
            </View>

          </View>

          <DateTimePicker
            mode="date"
            isVisible={this.state.isDatePickerVisible}
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: '6%', marginBottom: '3%' }}>
            <Text style={{ color: "#4c52ba", margin: 10, fontWeight: "bold" }}
              onPress={() => this.props.navigation.navigate('SignupBio')}
            >
              Documents and licences to scan (optional)
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: '6%', marginBottom: '3%' }}>
            <CheckBox
              disabled={true}
              value={this.props.route.params.toggleBiometrics}
              onValueChange={(val) => this.updateInputVal(val, 'toggleBiometricsBox')}
            />

            <Text style={{ color: "#4c52ba", margin: 10, fontWeight: "bold" }}
              onPress={() => this.props.navigation.navigate('SignupBio')}
            >
              Set Up Shoptaki Biometrics
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: '3%', marginBottom: '6%' }}>
            <CheckBox
              disabled={false}
              tintColors={{ true: '#ccc', false: 'red' }}
              value={this.state.toggleCheckBox}
              onValueChange={(val) => this.updateInputVal(val, 'toggleCheckBox')}
            />

            <Text style={{ color: "#4c52ba", margin: 10 }}>
              I have read and agree to the {"\n"}
              <Text style={[styles.bold, { color: "#4c52ba" }]}
                onPress={() => this.props.navigation.navigate('pdfViewer',
                  { source: 'https://shoptaki-static-files.s3.amazonaws.com/Shoptaki+-+Privacy+Policy.pdf' })}>
                Privacy Policy</Text>
              <Text style={{ color: "#4c52ba", fontWeight: "normal" }}> and </Text>
              <Text style={[styles.bold, { color: "#4c52ba" }]}
                onPress={() => this.props.navigation.navigate('pdfViewer',
                  { source: 'https://shoptaki-static-files.s3.amazonaws.com/Shoptaki+-+Terms+and+Conditions+v.2+.pdf' })}>
                Terms and Conditions </Text>
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
            alignItems: 'center'
          }}
          onPress={() => this.signUp()}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: "bold", fontSize: 16 }}>Sign up</Text>
        </TouchableHighlight>


        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
        </Text>

        <Text
          style={styles.errorText}>
          {this.state.errorMessage}
        </Text>

      </ScrollView>
    );
  }
}


//HTML/CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: '#fff'
  },
  phoneStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 0,
    paddingRight: 15,
    paddingTop: 0,
    paddingLeft: 5,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10
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
  inputStyle2: {
    width: '48%',
    marginBottom: 15,
    paddingBottom: '3%',
    paddingTop: '3%',
    paddingLeft: 20,
    marginRight: 12,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10
  },
  inputStyle3: {
    width: '75%',
    paddingBottom: '3%',
    paddingTop: '3%',
    paddingLeft: 20,
    marginRight: 12,
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
  errorText: {
    color: 'red',
    marginTop: 25,
    marginBottom: 100,
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
    marginBottom: '5%',
    marginTop: '5%'
  },
  mainText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 15
  },
  bold: {
    fontWeight: 'bold'
  },
});