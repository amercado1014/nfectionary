import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, Select, Button } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { getDiseaseNames } from '../../api/getDiseaseNames';
import { getDiseaseCount } from '../../api/getDiseaseCount';
import { buttonCleaner } from '../../api/cleaners/buttonCleaner';
import { diseaseSort } from '../../api/cleaners/sortDiseaseData';

export default class StateDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonData: [],
      state: '',
      statesList: [],
      diseaseList: []
    }
  }

  async componentDidMount() {
    const id = this.props.navigation.getParam('id');
    await this.fetchAllData(id);
  }

  async fetchAllData(id) {
    const diseaseId = Number(id) + 1;
    const diseaseList = await getDiseaseNames();
    diseaseList.sort(diseaseSort);
    const count = await getDiseaseCount(diseaseId);
    const buttonData = buttonCleaner(diseaseList, count);
    
    this.setButtonData(buttonData, id, diseaseList);
  }

  setButtonData(buttonData, id, diseaseList) {
    const statesList = this.props.navigation.getParam('statesList');
    const state = statesList[id]
    
    this.setState({ buttonData, state, statesList, diseaseList });
  }
  
  render() {
    const { buttonData, state, statesList, diseaseList } = this.state;

    const renderButton = buttonData.map(button => (
      <TouchableOpacity
        style={styles.button}
        key={button.count}
        onPress={() => this.props.navigation.navigate('DiseaseDisplay', {disease_id: button.disease_id, diseaseList })}>
        <Text> {button.name} </Text>
        <Text> {button.count} </Text>
      </TouchableOpacity>
    ));
    
    return (
      <View style={styles.container}>
      <ModalDropdown 
          defaultValue={state}
          options={statesList} 
          onSelect={(event) => this.fetchAllData(event)} 
          />
        {renderButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E79CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    width: 100,
    height: 50,
    padding: 10
  }
});