import {Animated, StyleSheet, TextInput} from 'react-native';
import {theme} from "../theme";
import {ShoppingListItem} from "../components/ShoppingListItem";
import {useState} from "react";
import ScrollView = Animated.ScrollView;

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
    >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 12,
  },
  contentContainer:{
    paddingBottom: 24,

  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
});
