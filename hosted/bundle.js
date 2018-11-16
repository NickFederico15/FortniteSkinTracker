"use strict";

// helper method to handle errors
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

// handles the user adding skin
var handleSkin = function handleSkin(e) {
  e.preventDefault();

  // makes sure all fields are filled out
  if ($("#skinName").val() == '' || $("#vBucks").val() == '' || $("#rarity").val() == '') {
    M.toast({html: 'All fields are required!', displayLength: 2500});
    return false;
  }

  // sends request to add skin
  sendAjax('POST', $("#skinForm").attr("action"), $("#skinForm").serialize(), function () {
    M.toast({html: 'Skin Added', displayLength: 2500})
    loadSkinsFromServer($("token").val());
  });

  return false;
};

// React skin form
var SkinForm = function SkinForm(props) {
  return React.createElement(
    "form",
    { id: "skinForm",
      onSubmit: handleSkin,
      name: "skinForm",
      action: "/maker",
      method: "POST",
      className: "skinForm"
    },
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "skinName", type: "text", name: "skinName"}),
      React.createElement("label", { htmlFor: "skinName" }, "Skin Name"),  
    ),
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "vBucks", type: "number", name: "vBucks", min: "0", max: "15000", step: "100"}),
      React.createElement("label", { htmlFor: "vBucks" }, "V-Bucks"),
    ),
    React.createElement(
      "div", 
      { className: "input-field col s6"},
      React.createElement("input", { id: "rarity", type: "text", name: "rarity"}),
      React.createElement("label", { htmlFor: "rarity" }, "Rarity"),
    ),
    React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
    React.createElement(
        "div", 
        { className: "container center-align"},
        React.createElement("input", { className: "btn purple lighten-2", type: "submit", value: "Add Skin" })
    ),
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(SkinForm, { csrf: csrf }), document.querySelector("#makeSkin"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  $('.collapsible').collapsible();
  getToken();
});
