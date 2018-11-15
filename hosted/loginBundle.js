"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

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

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

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

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

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
