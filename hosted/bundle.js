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

var handleSkin = function handleSkin(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#skinName").val() == '' || $("#vBucks").val() == '' || $("#rarity").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#skinForm").attr("action"), $("#skinForm").serialize(), function () {
    loadSkinsFromServer($("token").val());
  });

  return false;
};

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
