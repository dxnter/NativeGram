import React, { useState } from "react";
import { SafeAreaView, Dimensions } from "react-native";
import { Layout, Text, Input, Icon, Button } from "@ui-kitten/components";
import { Container } from "./styles";
import SizedBox from "~/components/SizedBox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useStoreActions, useStoreState } from "easy-peasy";
import LoadingIndicator from "~/components/LoadingIndicator";

const HEIGHT = Dimensions.get("screen").height;

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const signIn = useStoreActions(actions => actions.auth.signInRequest);
  const loading = useStoreState(state => state.auth.loading);

  return (
    <Container level="2">
      <KeyboardAwareScrollView>
        <SafeAreaView>
          <SizedBox height={HEIGHT / 6} />
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="john.doe@example.com"
            value={email}
            onChangeText={setEmail}
          />
          <SizedBox height={20} />
          <Input
            label="Password"
            secureTextEntry
            placeholder="**************"
            value={password}
            onChangeText={setPassword}
          />
          <SizedBox height={40} />
          <Button
            icon={
              loading
                ? style => <LoadingIndicator {...style}></LoadingIndicator>
                : null
            }
            status="primary"
            disabled={loading}
            onPress={() => signIn({ email, password })}
          >
            {!loading && "LOGIN"}
          </Button>
          <SizedBox height={20} />
          <Button
            appearance="filled"
            status="basic"
            onPress={() => navigation.navigate("SignUp")}
          >
            CREATE ACCOUNT
          </Button>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Container>
  );
}