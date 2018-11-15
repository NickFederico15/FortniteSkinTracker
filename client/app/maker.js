const handleSkin = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#skinName").val() == '' || $("#vBucks").val() == '' || $("#rarity").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#skinForm").attr("action"), $("#skinForm").serialize(), function() {
    loadSkinsFromServer($("#token").val());
  });

  return false;
};

const handleDelete = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  sendAjax('DELETE', $("#deleteSkin").attr("action"), $("#deleteSkin").serialize(), function(){
    loadSkinsFromServer($("token").val());
  });
};

const SkinForm = (props) => {
  return (
    <form id="skinForm"
          onSubmit={handleSkin}
          name="skinForm"
          action="/maker"
          method="POST"
          className="skinForm"
    >
        <label htmlFor="skinName">Skin Name: </label>
        <input id="skinName" type="text" name="skinName" placeholder="Skin Name"/>
        <label htmlFor="vBucks">V-Bucks: </label>
        <input id="vBucks" type="text" name="vBucks" placeholder="V-Buck Cost"/>
        <label htmlFor="rarity">Rarity: </label>
        <input id="rarity" type="text" name="rarity" placeholder="Rarity"/>
        <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
        <input className="makeSkinSubmit" type="submit" value="Add Skin"/>
    </form>
  );
};

const SkinList = function(props) {
  if(props.skins.length === 0) {
    return (
      <div className="skinList">
        <h3 className="emptySkin">No Skins yet</h3>
      </div>
    );
  }

  const skinNodes = props.skins.map(function(skin) {
    return (
      <div key={skin._id} className="skin">
        <img src="/assets/img/default.png" alt="default skin" className="default"/>
        <h3 className="skinName">Skin Name: {skin.skinName}</h3>
        <h3 className="vBucks">V-Bucks: {skin.vBucks}</h3>
        <h3 className="rarity">Rarity: {skin.rarity}</h3>
        <form id="deleteSkin"
              onSubmit={handleDelete}
              name="deleteSkin"
              action="/deleteSkin"
              method="DELETE"
        >
            <input type="hidden" name="_id" value={skin._id}/>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <input className="makeSkinDelete" type="submit" value="Delete"/>
        </form>
      </div>
    );
  });

  return (
    <div className="skinList">
      {skinNodes}
    </div>
  );
};

const loadSkinsFromServer = (csrf) => {
  sendAjax('GET', '/getSkins', null, (data) => {
    ReactDOM.render(
      <SkinList skins={data.skins} csrf={csrf}/>, document.querySelector("#skins")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <SkinForm csrf={csrf} />, document.querySelector("#makeSkin")
  );

  ReactDOM.render(
    <SkinList skins={[]} csrf={csrf}/>, document.querySelector("#skins")
  );

  loadSkinsFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});