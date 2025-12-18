import { createActions } from "@/src/lib/utils";

const actionTypes = createActions("AUTH", [
  "LOGIN_REQUEST",
  "LOGIN_SUCCESS",
  "LOGIN_FAILURE",
  "SIGNUP_REQUEST",
  "SIGNUP_SUCCESS",
  "SIGNUP_FAILURE",
  "REFRESH_SUCCESS",
  "REFRESH_FAILURE",
  "LOGOUT",
]);

const actions = {};
