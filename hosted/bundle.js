"use strict";

var handleSkin = function handleSkin(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#skinName").val() == '' || $("#vBucks").val() == '' || $("#rarity").val() == '') {
    handleError("RAWR! All fields are required");
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
      "label",
      { htmlFor: "skinName" },
      "Skin Name: "
    ),
    React.createElement("input", { id: "skinName", type: "text", name: "skinName", placeholder: "Skin Name" }),
    React.createElement(
      "label",
      { htmlFor: "vBucks" },
      "V-Bucks: "
    ),
    React.createElement("input", { id: "vBucks", type: "text", name: "vBucks", placeholder: "V-Buck Cost" }),
    React.createElement(
      "label",
      { htmlFor: "rarity" },
      "Rarity:"
    ),
    React.createElement("input", { id: "rarity", type: "text", name: "rarity", placeholder: "Skin Rarity" }),
    React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeSkinSubmit", type: "submit", value: "Add Skin" })
  );
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
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
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
  ReactDOM.render(React.createElement(SkinForm, { csrf: csrf }), document.querySelector("#makeSkin"));

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
