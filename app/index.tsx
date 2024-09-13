import {StyleSheet, TextInput, View} from 'react-native';
import {theme} from "../theme";
import {ShoppingListItem} from "../components/ShoppingListItem";
import {useState} from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
}

const initialList : ShoppingListItemType[] =[
  {
    id: "1",
    name: "Coffee",
  },
  {
    id: "2",
    name: "Tea",
  },
  {
    id: "3",
    name: "Sugar",
  },
]

export default function Index() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>(initialList);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if(value){
      const newShoppingList = [
        {
          id: new Date().toTimeString(),
          name: value,
        },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setValue("");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E.g. Coffee"
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {shoppingList.map((item) => (
        <ShoppingListItem key={item.id} name={item.name} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
  },
});
