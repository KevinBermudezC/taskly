import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {theme} from "../../theme";
import {registerForPushNotificationsAsync} from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {Alert} from "react-native";
import {useEffect, useState} from "react";
import {Duration, isBefore, intervalToDuration} from "date-fns";
import {TimeSegment} from "../../components/TimeSegment";

//10 sec from now
const timestamp = Date.now() + 10 * 1000;

type PersistedCountdownState = {
  
}

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {

  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  useEffect(() => {
    const intervalId =setInterval(() => {
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? {start: timestamp, end: Date.now()}
          : {start: Date.now(), end: timestamp}
      );
      setStatus({isOverdue, distance});

    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if(result === "granted"){
      await Notifications.scheduleNotificationAsync({
        content:{
          title: "I'm a notification from your app! 📨",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      if(Device.isDevice){
      Alert.alert(
        "Unable to schedule notification",
        "Please enable notifications in your settings to receive reminders"
      );
      }
    }
  }
  return (
    <View style={[styles.container, status.isOverdue ? styles.containerLate : undefined]}>
      {status.isOverdue? (
        <Text style={[styles.whiteText, styles.heading]}>Thing overdue by</Text>
      ) : (
        <Text style={[styles.heading]}>Thing due in...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment number={status.distance.days ?? 0} unit="Days" textStyle={status.isOverdue ? styles.whiteText : undefined }/>
        <TimeSegment number={status.distance.hours ?? 0} unit="Hours" textStyle={status.isOverdue ? styles.whiteText : undefined }/>
        <TimeSegment number={status.distance.minutes ?? 0} unit="Minutes" textStyle={status.isOverdue ? styles.whiteText : undefined }/>
        <TimeSegment number={status.distance.seconds ?? 0} unit="Seconds" textStyle={status.isOverdue ? styles.whiteText : undefined }/>
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={scheduleNotification}>
        <Text style={styles.buttonText}>i've done the thing!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  containerLate:{
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,

  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  whiteText:{
    color: theme.colorWhite,
  },
});
