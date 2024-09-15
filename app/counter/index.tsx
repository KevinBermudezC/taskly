import {Text, View, StyleSheet, TouchableOpacity,Alert, ActivityIndicator, Dimensions} from "react-native";
import {theme} from "../../theme";
import {registerForPushNotificationsAsync} from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {useEffect, useState, useRef} from "react";
import {Duration, isBefore, intervalToDuration} from "date-fns";
import {TimeSegment} from "../../components/TimeSegment";
import {getFromStorage, saveToStorage} from "../../utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

//10 sec from now
const frequency = 10 * 1000;
export const countdownStorageKey = "taskly-countdown";
export type PersistedCountdownState = {
  currentNotificationId : string | undefined;
  completedAtTimestamp: number[];
};
type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const confettiRef = useRef<any>();
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  const lastCompletedTimestamp = countdownState?.completedAtTimestamp[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    }
    init();
  }, []);

  useEffect(() => {
    const intervalId =setInterval(() => {
      const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now();
      if(lastCompletedTimestamp){
        setIsLoading(false);
      }

      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? {start: timestamp, end: Date.now()}
          : {start: Date.now(), end: timestamp}
      );
      setStatus({isOverdue, distance});

    }, 1000);
    return () => clearInterval(intervalId);
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiRef?.current?.start();
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if(result === "granted"){
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content:{
          title: "The thing is due!",
        },
        trigger: {
          seconds: frequency / 100,
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
    if(countdownState?.currentNotificationId){
      await Notifications.cancelScheduledNotificationAsync(countdownState?.currentNotificationId);
    }
    const newCountdownState : PersistedCountdownState ={
      currentNotificationId: pushNotificationId,
      completedAtTimestamp: countdownState
        ?[Date.now(),...countdownState.completedAtTimestamp]
        : [Date.now()]
    };
    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  if (isLoading){
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    )
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
      <ConfettiCannon
        count={50}
        origin={{ x: Dimensions.get("window").width / 2, y: -30 }}
        ref={confettiRef}
        fadeOut
        autoStart={false}
      />
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
  activityIndicatorContainer:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: theme.colorWhite,
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
