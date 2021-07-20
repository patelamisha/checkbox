import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

/* This is the current Finance job for demoing. For the future, fetch data from ArangoDB
This is the overall Shoptaki user bank information */
//Fetch data in componentDidMount 

export default class Finance extends React.Component {

  constructor() {
    super();

    //All variables in the finance screen
    this.state = {
      balance: '68,400',
      creditScore: '730'
    }
  }


  /* Builtin React Native function which is called AFTER the FIRST render of the page
  Please view https://reactjs.org/docs/react-component.html for more detail */
  async componentDidMount() {

    /* Currently, all information visible on page is hard coded for demonstration purposes. Will need 
    to work with finance team to fetch this data from arangoDB*/

    /* Data fetching will take place here */
    /* ** Remember, the first thing users see is a LOADING SCREEN. AFTER, all data has been fetched, remove the loading screen ** */

  }

  //function used to update the variables
  //val is the value and prop is the name of the variable
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

    render() {
      return(
        <View style={styles.container}>

          <View style={styles.backlocation}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                <Icon size={30} name="arrow-left" color="#e3d966" backgroundColor="#4c52ba" ></Icon>
            </TouchableOpacity>
          </View>

          <View style={styles.sendRequestLoc}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SendRequest')}>
                <Icon size={30} name="google-wallet" color="#e3d966" backgroundColor="#4c52ba" ></Icon>
            </TouchableOpacity>
          </View>

          <View style={styles.mainBackground}>
            <Text style={{fontSize: 14,color: '#f5bd1f',marginBottom: 5, alignSelf: "center"}}>
              Overall Balance
            </Text>

            <Text style={styles.textStyleBalance}>
              ${this.state.balance}
            </Text>
          </View>


          <View style={styles.creditScoreCard}>
            <View>
              <Text style={styles.textStyleC}>
                  My Credit Score
              </Text>

              <View style={{ flexDirection: "row", alignItems: 'center' }}>

                <Text style={styles.textStyleCScore}> 
                  {this.state.creditScore}
                </Text>
                
                <View style={{ flexDirection: "column", marginHorizontal: '10%' }}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.textStyleM}>
                      Last Updated
                    </Text>
                    <Text style={styles.textStyleM}>
                      01/01/2020
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{marginHorizontal: '10%'}}>
              <ProgressCircle
                percent={(this.state.creditScore/850)* 100}
                radius={30}
                borderWidth={3}
                color={(this.state.creditScore > 690) ? "#00ff00" : (this.state.creditScore > 629) ? "#ffae42" : "#ff0000"}
                shadowColor="#f2f2f2"
                bgColor="#f2f2f2" >
                <Text style={{ fontSize: 12 }}>{(this.state.creditScore > 690) ? "Good" : (this.state.creditScore > 629) ? "Fair" : "Bad"}</Text>
              </ProgressCircle>
            </View>
          </View>


          <View style={styles.recentTransactions}>

            <Text style={{ fontSize: 14, color: '#505050',}}>
              Recent Transactions
            </Text>

            <ScrollView>

              <View>
                <View style={styles.indivTranscation}>
                  <View>
                    <Text style={{fontSize: 12}}>
                      Processing
                    </Text>
                    <Text style={{fontSize: 18}}>
                      TARGET FENWAY
                    </Text>
                  </View>

                  <View style={{marginLeft: 'auto'}}>
                    <Text style={{color: '#0091ff', fontWeight: 'bold', fontSize: 18, marginLeft: 'auto'}}>
                      -$8.99
                    </Text>
                    <Text style={{fontSize: 12, marginLeft: 'auto'}}>
                      $68,400
                    </Text>
                  </View>
                  </View>

                  <View style={{borderBottomColor: 'black', borderBottomWidth: 1,}} />
              </View>

              <View>
                <View style={styles.indivTranscation}>
                  <View>
                    <Text style={{fontSize: 12}}>
                      March 12, 2021
                    </Text>
                    <Text style={{fontSize: 18}}>
                      AMAZON PURCHASE
                    </Text>
                  </View>

                  <View style={{marginLeft: 'auto'}}>
                    <Text style={{color: '#0091ff', fontWeight: 'bold', fontSize: 18, marginLeft: 'auto'}}>
                      -$12.49
                    </Text>
                    <Text style={{fontSize: 12, marginLeft: 'auto'}}>
                      $68,412
                    </Text>
                  </View>
                  </View>

                  <View style={{borderBottomColor: 'black', borderBottomWidth: 1,}} />
              </View>

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


          <View style={styles.myBanks}>
            <Text style={{ fontSize: 14, color: '#505050',}}>
              My Banks
            </Text>

            <ScrollView horizontal={true} style={{marginVertical: '1%'}} >

            <View style={styles.indivBank}>

              <View style={{ flexDirection: "row", width: '100%' }}>
                <View style={{}}>
                  <Image
                    style={{width: 60, height: 38}}
                    source={require('./citibank_logo.png')}
                  />
                </View>

                <View style={{alignItems: 'flex-end', marginLeft: 'auto'}}>
                  <Text style={{color: 'white'}}>
                    Savings Account
                  </Text>
                  <Text style={{color: 'white'}}>
                    1234567891011
                  </Text>
                </View>
              </View>

              <View style={{flexDirection:'row', marginTop: 'auto', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 24, color: 'white'}}>
                  $46,000
                </Text>
                <View style={{marginLeft: 'auto'}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('BankPage')}>
                    <Icon size={20} name="chevron-right" color="white" ></Icon>
                  </TouchableOpacity>

                </View>
              </View>

            </View>
            <View style={styles.indivBank}>
              <View style={{ flexDirection: "row", width: '100%' }}>
                <View style={{}}>
                  <Image
                    style={{width: 60, height: 38}}
                    source={require('./tdbank_logo.png')}
                  />
                </View>

                <View style={{alignItems: 'flex-end', marginLeft: 'auto'}}>
                  <Text style={{color: 'white'}}>
                    Savings Account
                  </Text>
                  <Text style={{color: 'white'}}>
                    000000000000
                  </Text>
                </View>
              </View>

              <View style={{flexDirection:'row', marginTop: 'auto', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 24, color: 'white'}}>
                  $22,400
                </Text>
                <View style={{marginLeft: 'auto'}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('BankPage')}>
                    <Icon size={20} name="chevron-right" color="white" ></Icon>
                  </TouchableOpacity>

                </View>
              </View>

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
    mainBackground: {
      justifyContent: 'center',
      position:'absolute',
      top: 0,
      width: '100%',
      height: '35%',
      backgroundColor: '#4c52ba',
      borderBottomEndRadius: 30,
      borderBottomStartRadius: 30
    },
    creditScoreCard: {
      position:'absolute',
      top: '27%',
      padding: '8%',
      width: '90%',
      height: '15%',
      backgroundColor: '#f2f2f2',
      borderRadius: 40,
      flexDirection: "row"
    },
    textStyleBalance: {
      fontSize: 36,
      color: '#fff',
      marginBottom: 5,
      fontWeight: 'bold',
      alignSelf: "center",
    },
    textStyleC: {
      fontSize: 12,
      color: '#505050',
      marginBottom: '5%',
    },
    textStyleCScore: {
      fontSize: 34,
      color: '#000',
      fontWeight: 'bold',
      alignSelf: "center"
    }, 
    textStyleM: {
      fontSize: 12,
      color: '#757575',
      width: '100%'
    },
    backlocation: {
      position: 'absolute',
      top: '5%',
      left: '5%',
      zIndex: 2,
    },
    myBanks: {
      position:'absolute',
      top: '65%',
      width: '100%',
      height: '30%',
      paddingVertical: '2%',
      paddingHorizontal: '5%',
      backgroundColor: '#f2f2f2',
    },
    indivBank: {
      height: '95%',
      width: 250,
      backgroundColor: '#4c52ba',
      marginHorizontal: 10,
      borderRadius: 10,
      padding: '3%'
    },
    recentTransactions: {
      position:'absolute',
      top: '45%',
      width: '90%',
      height: '18%',
      paddingVertical: '2%',
      paddingHorizontal: '5%',
      backgroundColor: '#f2f2f2',
    },
    indivTranscation: {
      flexDirection: "row",
      marginVertical: '5%'
    },
    sendRequestLoc: {
      position: 'absolute',
      top: '5%',
      right: '5%',
      zIndex: 2,

    }
  });