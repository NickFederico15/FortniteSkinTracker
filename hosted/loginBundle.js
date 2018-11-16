"use strict";

// haleper method to handle errors
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

// ajax request
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

// handles the user logging in
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  // checks if all fields are filled in
  if ($("#user").val() == '' || $("#pass").val() == '') {
    M.toast({html: 'Username or password is empty', displayLength: 2500});
    return false;
  }

  console.log($("input[name=_csrf]").val());
  
  M.toast({html: 'Login Success!', displayLength: 2500});
    
  // sends request to login user
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// handles the user creating an account
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  // checks if all fields are filled out
  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    M.toast({html: 'All fields are required!', displayLength: 2500});
    return false;
  }

  // checks if both passwords match
  if ($("#pass").val() !== $("#pass2").val()) {
    M.toast({html: 'Passwords do not match!', displayLength: 2500});
    return false;
  }

  M.toast({html: 'Account Created!', displayLength: 2500});
   
  // sends request to create account
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// React form for the login window
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "form",
    { id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "user", type: "text", name: "username"}),
      React.createElement("label", { htmlFor: "user" }, "Username"),
    ),
    React.createElement(
      "div", 
      { className: "input-field col s6"}, 
      React.createElement("input", { id: "pass", type: "password", name: "pass"}),
      React.createElement("label", { htmlFor: "pass" }, "Password"),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    ),
    React.createElement(
      "div", 
      { className: "container center-align"}, 
      React.createElement("input", { className: "btn purple lighten-2", type: "submit", value: "Sign in" }),
    ),
  );
};

// React form for the signup window
var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "form",
    { id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "user", type: "text", name: "username"}),
      React.createElement("label", { htmlFor: "user" }, "Username"),
    ),
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "pass", type: "password", name: "pass"}),
      React.createElement("label", { htmlFor: "pass" }, "Password"),
    ),
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "pass2", type: "password", name: "pass2"}),
      React.createElement("label", { htmlFor: "pass2" }, "Retype Password"),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    ),
    React.createElement(
      "div", 
      { className: "container center-align"}, 
      React.createElement("input", { className: "btn purple lighten-2", type: "submit", value: "Sign Up" }),
    ),
  );
};

// render functions for both React windows
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// sets up event listeners for signup and login buttons
var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
