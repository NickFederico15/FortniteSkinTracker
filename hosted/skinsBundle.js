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

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  $("#domoMessage").animate({ width: 'hide' }, 350);

  sendAjax('DELETE', $("#deleteSkin").attr("action"), $("#deleteSkin").serialize(), function () {
    loadSkinsFromServer($("token").val());
  });
};

var SkinList = function SkinList(props) {
  if (props.skins.length === 0) {
    return React.createElement(
      "div",
      { className: "skinList" },
      React.createElement(
        "h3",
        { className: "emptySkin" },
        "No Skins yet"
      )
    );
  }

  var SkinNodes = props.skins.map(function (skin) {
    return React.createElement(
      "div",
      { key: skin._id, className: "skin" },
      React.createElement("img", { src: "/assets/img/default.png", alt: "default skin", className: "default" }),
      React.createElement(
        "h3",
        { className: "skinName" },
        "Skin Name: ",
        skin.skinName
      ),
      React.createElement(
        "h3",
        { className: "vBucks" },
        "V-Bucks: ",
        skin.vBucks
      ),
      React.createElement(
        "h3",
        { className: "rarity" },
        "Rarity: ",
        skin.rarity
      ),
      React.createElement(
        "form",
        { id: "deleteSkin",
            onSubmit: handleDelete,
            name: "deleteSkin",
            action: "/deleteSkin",
            method: "DELETE"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: skin._id }),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeSkinDelete", type: "submit", value: "Delete" })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "skinList" },
    SkinNodes
  );
};

var loadSkinsFromServer = function loadSkinsFromServer(csrf) {
  sendAjax('GET', '/getSkins', null, function (data) {
    ReactDOM.render(React.createElement(SkinList, { skins: data.skins, csrf: csrf }), document.querySelector("#skins"));
  });
};

var setup = function setup(csrf) {

  ReactDOM.render(React.createElement(SkinList, { skins: [], csrf: csrf }), document.querySelector("#skins"));

  loadSkinsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
