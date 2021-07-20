import React from 'react';
import { Image, StyleSheet, View, Text, ScrollView, ActivityIndicator} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

/* This is the page for EACH INDIVIDUAL BANK PAGE. EXAMPLE HERE IS CITI BANK.
Please fetch data for individual banks from ArangoDB when ready */
//Always fetch data in componentDidMount



export default class BankPage extends React.Component {

  constructor() {
    super();

    /*State variables used throughout the class React.Component
    Please view https://www.geeksforgeeks.org/component-state-react-native/ for more details on using state varibles */
    this.state = {
      isLoading: false //set to true when ready for testing. Loading screen will be first thing users see

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

    /* Currently, all information visible on page is hard coded for demonstration purposes. Will need 
    to work with finance team to fetch this data from arangoDB*/

    /* Data fetching will take place here */
    /* ** Remember, the first thing users see is a LOADING SCREEN. AFTER, all data has been fetched, remove the loading screen ** */

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
              source={require('../../home/citibank_logo.png')}
            />
        </View>


        <View style={styles.bankAccountInfo}>

            <Text style={styles.bankName}>
                Citi Bank
             </Text>

            <Text style={styles.bankAccountNum}>
                1234567891011
            </Text>

            <View style={styles.balanceBackground}>
                <Text style={{fontSize: 12}}>
                    Balance:
                </Text>

                <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                    $46,000
                </Text>
            </View>
        </View>

        <View style={styles.transactionView}>
            <Text>
                Transactions:
            </Text>
            <ScrollView>
                <View>
                    <View style={styles.indivTranscation}>
                    <View>
                        <Text style={{fontSize: 12}}>
                        March 11, 2021
                        </Text>
                        <Text style={{fontSize: 18}}>
                        CVS PHARMACY
                        </Text>
                    </View>

                    <View style={{marginLeft: 'auto'}}>
                        <Text style={{color: '#0091ff', fontWeight: 'bold', fontSize: 18, marginLeft: 'auto'}}>
                        -$1.49
                        </Text>
                        <Text style={{fontSize: 12, marginLeft: 'auto'}}>
                        $68,411
                        </Text>
                    </View>
                    </View>

                    <View style={{borderBottomColor: 'black', borderBottomWidth: 1,}} />
                </View>

            </ScrollView>
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
    height: '20%',
    backgroundColor: '#4c52ba',
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40
  },
  bankName: {
    fontSize: 38,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: '15%'
  },
  bankAccountNum: {
    fontSize: 16,
    color: 'black',
    alignSelf: "center",
  },
  imgSize: {
    width: 62,
    height: 40,
  },
  imgView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '5%',
    borderWidth: 5,
    borderRadius: 20,
    borderColor: '#3e428c',
    width: '30%',
    height: '12%',
    backgroundColor: 'white',
    zIndex: 2
  },
  bankAccountInfo: {
    position:'absolute',
    justifyContent: 'center',
    top: '15%',
    width: '90%',
    height: '22%',
    backgroundColor: '#f2f2f2',
    borderRadius: 40,
  },
  balanceBackground: {
    backgroundColor: '#fff4a1',
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginVertical: '3%'
  },
  transactionView: {
      position: 'absolute',
      top: '43%',
      backgroundColor: '#f2f2f2',
      borderRadius: 40,
      height: '100%',
      width:'90%',
      padding: '5%'
  },
  indivTranscation: {
    flexDirection: "row",
    marginVertical: '5%'
  }
});