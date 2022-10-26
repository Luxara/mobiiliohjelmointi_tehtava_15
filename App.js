import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Header, Input, Button, ListItem, Icon } from'react-native-elements';


const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {
  
  const [listItem, setListItem] = useState('');
  const [amount, setAmount] = useState('');
  const [listItems, setListItems] = useState([]);
  

  useEffect(() => {  
    db.transaction(tx => {    
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, listItem text, amount text);');  
    }, null, updateList);
  }, []);


  const addItem = () => { 
     db.transaction(tx =>{
      tx.executeSql('insert into shoppinglist (listItem, amount) values (?, ?);',
              [listItem, amount]);
     }, null, updateList)
  }

  const updateList = () => {  
    db.transaction(tx => {    
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>      
      setListItems(rows._array)    
      );   
    });
    console.log('updated list')
    console.log(listItems)
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList)    
  }

  renderItem = ({ item }) => (
  <ListItem bottomDivider>
    <ListItem.Content>
      <ListItem.Title>{item.listItem}</ListItem.Title>
      <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
    </ListItem.Content>
    <Icon type='material' name='delete' color='red' onPress={() => deleteItem(item.id)}/>
  </ListItem>)

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header  centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }} />

      <View style={{ marginLeft:20, marginRight:20, marginTop:20}}>
        <Input placeholder='Type your product here' label='PRODUCT' onChangeText={listItem=>setListItem(listItem)} value={listItem}/>
        <Input placeholder='Type the amount here' label='AMOUNT' onChangeText={amount=>setAmount(amount)} value={amount}/>
        <Button containerStyle={{marginLeft:40, marginRight:40}} raised icon={{name: 'save', color:'white'}}  onPress={addItem}title="ADD" />
      </View>

      <View style={{}} >
      <FlatList
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}  
      data={listItems}
      ItemSeparatorComponent={listSeparator}
      />
      </View>
        
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  input:{
    width:200,
    borderColor:'gray',
    borderWidth:1
  },

  listcontainer:{
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  }  
});
