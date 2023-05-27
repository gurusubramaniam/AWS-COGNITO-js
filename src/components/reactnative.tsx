import Button from "local/components/buttons/Button";
import SafeAreaWrapper from "local/components/safeAreaWrapper/SafeAreaWrapper";
import TextInput from "local/components/textinput/TextInput";
import { LocalizationContext } from "local/translation";
import React, { useContext, useState } from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import authHandler, { Pool_Data } from "local/authHandler/authHandler";
import {
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js";
import { Alert } from "react-native";

const TextInputWrapper = styled.ScrollView`
  margin: 20px;
  flex: 1;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.fontSize.f22}px;
`;

const CreateCustomer = () => {
  const navigation = useNavigation();
  const { userPool } = authHandler();
  const [loading, setLoading] = useState(false);
  const { translations, initializeAppLanguage } = useContext(
    LocalizationContext
  );
  initializeAppLanguage();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirm, setconfirm] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [success, setSuccess] = useState("");
  const attriList: CognitoUserAttribute[] = [];

  const EmailAttributes = {
    Name: "email",
    Value: userName
  };
  attriList.push(new CognitoUserAttribute(EmailAttributes));

  const handleSubmit = () => {
    setLoading(true);
    userPool.signUp(userName, password, attriList, null, (err, data) => {
      if (err) {
        setError(err.message);
      } else {
        Alert.alert(
          "Please visit your email",
          `You will get confimation code in this email: ${userName} address`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        console.log(data);
      }
    });
    setLoading(false);
  };

  const handleConfirmSubmit = () => {
    const poolData = new CognitoUserPool(Pool_Data);
    const userData = {
      Username: confirm,
      Pool: poolData
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(confirmCode, true, (err, result) => {
      if (err) {
        console.log("I am error", err);
        setConfirmError(err.message);
      } else if (result === "SUCCESS") {
        setSuccess("You successfully signed in");
        // eslint-disable-next-line no-sequences
        setconfirm(""), setConfirmCode("");
        setTimeout(() => {
          navigation.navigate("Author");
        }, 3000);
      }
    });
  };

  const renderConfirm = () => {
    return (
      <>
        <TextInput
          placeholder={"Email"}
          fieldName={"Email"}
          onChangeText={setconfirm}
          value={confirm}
        />
        <TextInput
          placeholder={"Confirmation code"}
          fieldName={"Confirmation code"}
          onChangeText={setConfirmCode}
          value={confirmCode}
        />
        <Button
          onPress={handleConfirmSubmit}
          title={loading ? "loading.." : `${translations.submit}`}
          disabled={!confirm}
        />
        {confirmError ? <Text>{confirmError}</Text> : null}
        {success ? <Text>{success}</Text> : null}
      </>
    );
  };

  return (
    <SafeAreaWrapper>
      <TextInputWrapper>
        <Text>Signup</Text>
        <TextInput
          placeholder={"Username"}
          fieldName={"Username"}
          onChangeText={setUserName}
          value={userName}
        />
        <TextInput
          placeholder={"password"}
          fieldName={"Password"}
          onChangeText={setPassword}
          value={password}
          // secureTextEntry={true}
        />
        {error ? <Text>{error}</Text> : null}

        <Button
          onPress={handleSubmit}
          title={loading ? "loading...." : `${translations.submit}`}
          disabled={!userName}
        />
        <Text>Confirm</Text>
        {renderConfirm()}
      </TextInputWrapper>
    </SafeAreaWrapper>
  );
};

export default CreateCustomer;
