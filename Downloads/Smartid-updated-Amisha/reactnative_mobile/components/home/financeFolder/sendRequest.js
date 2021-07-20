import React from 'react';
import { Image, StyleSheet, View, Text, ScrollView, ActivityIndicator} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from 'react-native-modal-datetime-picker';


/* This is the page for EACH INDIVIDUAL BANK PAGE. EXAMPLE HERE IS CITI BANK.
Please fetch data for individual banks from ArangoDB when ready */
// ALWAYS fetch data in componentDidMount

/* More work to be done here. Coordinate with finace team to determine deliverables for finance page */

export default class SendRequest extends React.Component {

  constructor() {
    super();

    /*State variables used throughout the class React.Component
    Please view https://www.geeksforgeeks.org/component-state-react-native/ for more details on using state varibles */
    this.state = {

        sendOrRequest: true, //Send = true, request = false,

        // For design purposes. Buttons change color red/black
        sendBorder: 'red',   
        requestBorder: 'black',

        // date for payment to be sent if scheduled
        date: "",

        // Displays datePicker if icon is clicked
        isDatePickerVisible: false,

        //Boolean if payment will be scheduled
        schedulePayment: false,

        //Amount for payment/request
        moneyAmount: 0.0,

        //Recipient for money to be sent/requested
        recipient: ""
    }
  }

  //function used to update the variables
  //val is the value and prop is the name of the variable
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  /* Builtin React Native function which is called AFTER the FIRST render of the page
  Please view https://reactjs.org/docs/react-component.html for more detail */
  async componentDidMount() {

    /* For the next set, Finance team will supply Front end team with their developed APIS. Call APIS here if needed */

  }


  // OptionProcess takes in a boolean (if button is send or request)
  // Changes state to determine if payment is method{send, request}
  optionProcess = (whichButton) => {

    if (whichButton && this.state.sendOrRequest)
        return

    if (!whichButton && !this.state.sendOrRequest)
        return

    if(this.state.sendOrRequest){
        this.updateInputVal(false, 'sendOrRequest')
        this.updateInputVal('black', 'sendBorder' )
        this.updateInputVal('red', 'requestBorder' )

    } else {
        this.updateInputVal(true, 'sendOrRequest')
        this.updateInputVal('red', 'sendBorder' )
        this.updateInputVal('black', 'requestBorder' )
    }

  }

  /////////////////////// Code copied from signup.js. Used to access datePicker
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
    ////////////////////////


    /* When user clicks Send/Request, this function is called.
    Currently, no error checking is being done. Please do so before deployment 
    This function outputs a responses to the console. For the future, work with the finance team,
    to send this response to their API. */
    sendRequestData = () => {

      var amount = this.state.moneyAmount
      var recipient = this.state.recipient

      var send_request 
      if (this.state.sendOrRequest){
        send_request = "true"
      } else {
        send_request = "false"
      }

      var schedueleDate
      if (this.state.schedulePayment){
        schedueleDate = "true"
      } else {
        schedueleDate = "false"
      }
      


      var response = {
        recipient: recipient,
        amount: amount,
        sendOrRequest: send_request,
        dateScheduled: {
          scheduled: schedueleDate,
          date: this.state.date
        }

      }

      //Final response
      console.log(response)
    }


  render() {

    //Loading screen if loading variable is true
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }

    //HTML/CSS style for screen
    return (
      <View style={styles.container}>

        <View style={styles.backlocation}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Finance')}>
                <Icon size={30} name="arrow-left" color="#e3d966" backgroundColor="#4c52ba" ></Icon>
            </TouchableOpacity>
        </View>

        <View style={styles.mainBackground}>
        </View>

        <View style={styles.imgView}>
            <Image
              style={styles.imgSize}
              source={require('../../ShoptakiFill.png')}
            />
        </View>


            <TextInput
                style={styles.contactInput}
                placeholder="Search using smartID, phone number, email"
                placeholderTextColor="#808080"
                keyboardType="email-address"
                value={this.state.recipient}
                onChangeText={(val) => this.updateInputVal(val, 'recipient')}
          />




        <View style={{position: 'absolute', top: '35%', width: '90%'}}>

            
                <TouchableOpacity onPress={()=>{this.optionProcess(true)}}>
                  <View style={[styles.balanceBackground, {borderColor: this.state.sendBorder}]}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                        Send
                    </Text>
                  </View>
                </TouchableOpacity>


            <View style={{alignItems: 'center', alignSelf: 'center', width: '50%', padding: 10}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    Or
                </Text>
            </View>


                <TouchableOpacity onPress={()=>{this.optionProcess(false)}}>
                  <View style={[styles.balanceBackground, {borderColor: this.state.requestBorder}]}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                        Request
                    </Text>
                  </View>
                </TouchableOpacity>

        </View>


        <View style={{ position: 'absolute', top: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: '10%'}}>
            <Text style={{fontSize: 16, marginHorizontal: '5%'}}>
                Enter Amount: 
            </Text>

            <TextInput
              style={styles.amountInput}
              placeholder="$8.00"
              placeholderTextColor="#808080"
              keyboardType="numeric"
              value={this.state.moneyAmount}
              onChangeText={(val) => this.updateInputVal(val, 'moneyAmount')}
              returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'} />
        </View>

        <View style={{ position: 'absolute', top: '60%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginVertical: '10%'}}>
            
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 14, marginHorizontal: '5%'}}>
                  Schedule send/request payment: 
              </Text>

              <CheckBox
                disabled={false}
                tintColors={{ true: '#ccc', false: 'red' }}
                value={this.state.schedulePayment}
                onValueChange={(val) => this.updateInputVal(val, 'schedulePayment')}
              />
            </View>


            {this.state.schedulePayment &&

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 14}}>
                Select Date
              </Text>

              <View style={{marginLeft: '1%'}}>
                <TouchableOpacity
                  onPress={(val) => this.updateInputVal(true, 'isDatePickerVisible')}>
                  <View>
                    <Icon style={{ textAlign: "center" }} name="calendar" size={30} color="#243c97"></Icon>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={{fontWeight: 'bold', marginLeft: '1%', marginRight: '5%'}}>:</Text>


              <Text style={{fontWeight: 'bold', fontSize: 16, marginHorizontal: '3%'}}>
                {this.state.date}
              </Text>
            </View>
          }


        </View>

        <DateTimePicker
          mode="date"
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />

        <View style={{position: 'absolute', top: '85%', width: '90%'}}>
          <TouchableOpacity style={styles.sendBackground} onPress={()=>{this.sendRequestData()}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Send/Request
            </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#fff'
  },
  backlocation: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    zIndex: 2,
  },
  mainBackground: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '30%',
    backgroundColor: '#4c52ba',
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40
  },
  contactInput:{
    position: 'absolute',
    top: '20%',
    width: '80%',
    height: '5%',
    backgroundColor: 'white',
    paddingVertical: '2%',
    paddingLeft: 20,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 14
  },
  imgSize: {
    width: 95,
    height: 90,
  },
  imgView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '5%',
    borderWidth: 5,
    borderRadius: 20,
    borderColor: '#3e428c',
    width: '35%',
    height: '12%',
    backgroundColor: 'white',
    zIndex: 2,
  },
  balanceBackground: {
    backgroundColor: '#fff4a1',
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    padding: 5,
    marginVertical: '3%'
  },
  amountInput:{
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    padding: '3%',
    paddingHorizontal: '5%',
    fontSize: 16
  },
  sendBackground: {
    backgroundColor: '#fff4a1',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    marginVertical: '3%',
  },

});