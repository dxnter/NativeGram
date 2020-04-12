import React from "react";
import { SafeAreaView, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  TopNavigationAction,
  useTheme,
  Button,
} from "@ui-kitten/components";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import Home from "~/pages/Home";
import ProfileScreen from "~/pages/Profile";
import SignIn from "~/pages/SignIn";
import SignUp from "~/pages/SignUp";
import PostScreen from "~/pages/Post";
import CommentScreen from "~/pages/Comments";
import SettingsScreen from "~/pages/Settings";
import { BottomSafeArea } from "~/components/SafeArea";
import { useStoreState } from "easy-peasy";
import EditProfile from "./pages/EditProfile";

import CreatePostCamera from "~/pages/CreatePost/CreatePostCamera";
import CreatePostEditor from "~/pages/CreatePost/CreatePostEditor";
import CreatePostScreen from "~/pages/CreatePost/CreatePostScreen";

const BottomTab = createBottomTabNavigator();
const Auth = createStackNavigator();
const Root = createStackNavigator();
const Profile = createSharedElementStackNavigator();
const Post = createSharedElementStackNavigator();
const CreatePost = createSharedElementStackNavigator();

const PersonIcon = (style) => <Icon {...style} name="person" />;
const HomeIcon = (style) => <Icon {...style} name="home" />;
const CameraIcon = (style) => (
  <Icon {...style} style={{ width: 50 }} size={20} name="camera-outline" />
);

const BottomTabBar = ({ navigation, state }) => {
  const onSelect = (index) => {
    navigation.navigate(state.routeNames[index]);
  };
  return (
    <SafeAreaView>
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={onSelect}
        appearance="noIndicator"
      >
        <BottomNavigationTab icon={HomeIcon} />
        <BottomNavigationTab icon={CameraIcon} />
        <BottomNavigationTab icon={PersonIcon} />
      </BottomNavigation>
    </SafeAreaView>
  );
};

const AuthStack = () => {
  const theme = useTheme();
  return (
    <Auth.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
      }}
    >
      <Auth.Screen name="SignIn" component={SignIn}></Auth.Screen>
      <Auth.Screen name="SignUp" component={SignUp}></Auth.Screen>
    </Auth.Navigator>
  );
};

const TabNavigator = () => {
  const theme = useTheme();
  return (
    <>
      <BottomTab.Navigator
        tabBar={(props) => <BottomTabBar {...props} />}
        initialRouteName="UserProfile"
      >
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen
          name="CreatePost"
          component={CreatePostStack}
          options={{ tabBarVisible: false }}
        />
        <BottomTab.Screen name="UserProfile" component={ProfileStack} />
      </BottomTab.Navigator>
      <BottomSafeArea
        backgroundColor={theme["background-basic-color-1"]}
      ></BottomSafeArea>
    </>
  );
};

const ProfileStack = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Profile.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        mode: "card",

        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
      }}
    >
      <Profile.Screen name="Profile" component={ProfileScreen}></Profile.Screen>
      <Profile.Screen
        name="EditProfile"
        options={{ title: "Edit Profile" }}
        component={EditProfile}
      ></Profile.Screen>
      {PostStack(Profile)}
    </Profile.Navigator>
  );
};

const PostStack = (Navigator) => {
  const theme = useTheme();

  return (
    // <Post.Navigator
    //   screenOptions={{
    //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    //     mode: "card",
    //     headerStyle: { backgroundColor: theme["background-basic-color-1"] },
    //     headerTintColor: theme["text-basic-color"],
    //   }}
    // >
    <>
      <Navigator.Screen
        name="Post"
        sharedElementsConfig={(route, otherRoute, showing) => {
          const { postId } = route.params;
          if (otherRoute.name === "Profile" && showing)
            return [
              {
                id: `post.${postId}.photo`,
                // animation: "fade",
              },
            ];
        }}
        component={PostScreen}
      ></Navigator.Screen>
      <Navigator.Screen
        name="Comments"
        component={CommentScreen}
      ></Navigator.Screen>
    </>
    // </Post.Navigator>
  );
};

const CreatePostStack = () => {
  const theme = useTheme();
  return (
    <CreatePost.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // mode: "card",
      }}
    >
      <CreatePost.Screen
        options={{
          title: "",
        }}
        name="CreatePost/Camera"
        component={CreatePostCamera}
      ></CreatePost.Screen>
      <CreatePost.Screen
        options={{
          title: "Editor",
        }}
        name="CreatePost/Editor"
        component={CreatePostEditor}
        sharedElementsConfig={(route, otherRoute, showing) => {
          const { image } = route.params;
          // if (
          //   (otherRoute.name === "CreatePost/Save" ||
          //     otherRoute.name === "CreatePost/Camera") &&
          //   showing
          // )
          return [
            {
              id: `createPost.${image.uri}.photo`,
              // animation: "fade",
            },
          ];
        }}
      ></CreatePost.Screen>
      <CreatePost.Screen
        options={{
          title: "Post",
        }}
        name="CreatePost/Save"
        component={CreatePostScreen}
      ></CreatePost.Screen>
    </CreatePost.Navigator>
  );
};

const Routes = () => {
  const theme = useTheme();
  const isAuthenticated = useStoreState((state) => state.auth.signed);

  return (
    <NavigationContainer
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        mode: "card",
      }}
    >
      <Root.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme["background-basic-color-1"] },
          headerTintColor: theme["text-basic-color"],
        }}
      >
        {!isAuthenticated ? (
          <Root.Screen
            name="Auth"
            options={{ headerShown: false }}
            component={AuthStack}
          />
        ) : (
          <>
            <Root.Screen
              headerMode="none"
              options={{ headerShown: false }}
              name="Main"
              component={TabNavigator}
            />
            <Root.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
