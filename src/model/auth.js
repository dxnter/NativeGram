import { thunk, action } from "easy-peasy";
import { AsyncStorage, Alert } from "react-native";
import api from "~/services/api";

const INITIAL_STATE = {
  user: null,
  token: null,
  signed: false,
  loading: false
};

export default {
  ...INITIAL_STATE,

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  signInRequest: thunk(async (actions, payload, { getState }) => {
    actions.setLoading(true);
    try {
      const { email, password } = payload;

      const response = await api.post("auth/local", {
        identifier: email,
        password
      });

      const { jwt, user } = response.data;

      //   console?.tron?.log(jwt, user);

      await AsyncStorage.setItem("@nativegram/token", jwt);
      actions.signInSuccess({ jwt, user });
      actions.setLoading(false);
    } catch (err) {
      const message = err?.response?.data?.data?.[0]?.messages?.[0]?.message;

      Alert.alert(
        "Login Failed",
        message || "There was an error signing in, check you data 😐"
      );
      actions.setLoading(false);
    }
  }),
  signInSuccess: action((state, payload) => {
    state.user = payload.user;
    state.token = payload.jwt;
    state.signed = true;
    state.loading = false;
  }),
  signUpRequest: thunk(async (actions, payload) => {
    actions.setLoading(true);
    try {
      const { username, email, password } = payload;
      const response = await api.post("auth/local/register", {
        username,
        email,
        password
      });

      actions.signInRequest({ email, password });
      actions.setLoading(false);
    } catch (err) {
      const message = err?.response?.data?.data?.[0]?.messages?.[0]?.message;

      Alert.alert(
        "Register Failed",
        message || "There was an error signing up, check you data 😐"
      );
      actions.setLoading(false);
    }
  }),
  signOut: thunk(async (actions, payload, { getState }) => {
    // await AsyncStorage.removeItem("@nativegram/token");
    actions.signOutSuccess();
    console.log(getState());
  }),
  signOutSuccess: action(state => {
    state.user = null;
    state.token = null;
    state.signed = false;
    state.loading = false;
  })
};