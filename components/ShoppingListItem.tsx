import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {theme} from "../theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from "@expo/vector-icons/Entypo";


type Props = {
    name: string,
    isCompleted?: boolean,
}

export function ShoppingListItem({name, isCompleted }: Props) {
    const handleDelete = () => {
        Alert.alert(`Are you sure you want to delete ${name}?`,
            "It will be gone for good",
            [
                {
                    text: "Yes",
                    onPress: ()=> console.log("Ok, Deleting"),
                    style: "destructive"
                },
                {
                    text:"Cancel",
                    style: "cancel"
                }
            ]
        );
    };
    return (
        <View style={[styles.itemContainer, isCompleted ? styles.completedContainer : undefined]}>
            <View style={styles.row}>
                <Entypo name={isCompleted ? "check" : "circle"} size={24} color={isCompleted ? theme.colorGrey : theme.colorCerulean}/>
                <Text style={[styles.itemText, isCompleted && styles.completedText]}>{name}</Text>
            </View>
            <TouchableOpacity
                onPress={handleDelete}
                activeOpacity={0.8}
            >
                <AntDesign name="closecircle" size={24} color={isCompleted ? theme.colorGrey : theme.colorRed} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomColor: theme.colorCerulean,
        borderBottomWidth: 1 ,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    completedContainer: {
        backgroundColor: theme.colorLightGrey,
        borderBottomColor:theme.colorLightGrey,
    },
    itemText: {
        fontSize: 18,
        fontWeight: '200',
        marginLeft: 8,
        flex: 1,
    },
    completedText: {
        textDecorationLine: 'line-through',
        textDecorationColor: theme.colorGrey,
        color: theme.colorGrey,
    },
    row: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
    },

});