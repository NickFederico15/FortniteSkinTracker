// helper function for errors
const handleError = (message) => {
  $("#errorMessage").text(message);
};

const redirect = (response) => {
  window.location = response.redirect;
};

// ajax request
const sendAjax = (type, action, data, success) => {
  $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: success,
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        handleError(messageObj.error);
      },
  });
};
