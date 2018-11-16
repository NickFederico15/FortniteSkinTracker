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

// deletes a skin
var handleDelete = function handleDelete(e) {
  e.preventDefault();
    
  M.toast({html: 'Skin Deleted!', displayLength: 2500});

  // sends a request to delete the skin
  sendAjax('DELETE', $("#deleteSkin").attr("action"), $("#deleteSkin").serialize(), function () {
    loadSkinsFromServer($("token").val());
  });
};

// gets skin list and checks if it's empty
var SkinList = function SkinList(props) {
  if (props.skins.length === 0) {
    return React.createElement(
      "div",
      { className: "skinList" },
      React.createElement(
        "div", 
        { className: "container center-align"}, 
        React.createElement("h4", { className: "emptySkin" }, "No Skins Yet"),
      ),
    );
  }

  // React form for each skin
  var SkinNodes = props.skins.map(function (skin) {
    return React.createElement(
      "div",
      { key: skin._id, className: "card skin" },
      React.createElement(
        "div", 
        { className: "container center-align"}, 
        React.createElement("img", { src: "/assets/img/default.png", alt: "default skin", className: "default" }),
        React.createElement(
          "div",
          { className: "card-content white-text"},
          React.createElement("span", { className: "card-title skinName" }, "Skin Name: ", skin.skinName),
          React.createElement("p", { className: "vBucks" }, "V-Bucks: ", skin.vBucks),
          React.createElement("p", { className: "rarity" }, "Rarity: ", skin.rarity),
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
          React.createElement("input", { className: "btn white makeSkinDelete", type: "submit", value: "Delete" })
        ),
      ),
    );
  });

  return React.createElement(
    "div",
    { className: "skinList" },
    SkinNodes
  );
};

// loads the skins
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
