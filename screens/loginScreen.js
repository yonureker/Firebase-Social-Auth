import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";

import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";

import clientId from "../config/clientId";

const LoginScreen = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => props.navigation.navigate("Profile"))
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          alert("Wrong password.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  const loginWithFacebook = async () => {
    try {
      await Facebook.initializeAsync("567945563749281");
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"]
      });
      if (type === "success") {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);

        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => props.navigation.navigate("Profile"))
          .catch(error => {
            console.log(error);
          });
      } else {
        type === "cancel";
        Alert.alert("Login cancelled");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: clientId.iosClientId,
        androidClientId: clientId.androidClientId,
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken
        );
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => props.navigation.navigate("Profile"))
          .catch(error => {
            console.log(error);
          });
      } else {
        Alert.alert("Login cancelled");
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginModule}>
        <View>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor="#D7DBDD"
            onChangeText={email => setEmail(email)}
          />
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#D7DBDD"
            onChangeText={password => setPassword(password)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              loginUser(email, password);
            }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text>-- or --</Text>
        </View>

        <View style={styles.socialLogin}>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#3B5998" }}
            onPress={() => {
              loginWithFacebook();
            }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>
              Log in with Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#D73D32" }}
            onPress={() => {
              loginWithGoogle();
            }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>
              Log in with Google
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupContainer}>
          <Text>
            Don't have an account?{" "}
            <Text
              style={styles.textLink}
              onPress={() => props.navigation.navigate("Signup")}
            >
              Sign Up.
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

LoginScreen.navigationOptions = {
  title: "Log In"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  textLink: {
    color: "#49AEB5"
  },
  loginContainer: {
    width: "100%",
    minWidth: 400,
    borderWidth: 1,
    borderColor: "black"
  },
  textInput: {
    width: "100%",
    minWidth: "80%",
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: "#D7DBDD",
    marginTop: 10,
    padding: 10
  },
  socialLogin: {
    marginTop: 10
  },
  button: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "green",
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  signupContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flexDirection: "row"
  }
});

export default LoginScreen;
