// adds a skin
const handleSkin = (e) => {
  e.preventDefault();

  // checks if all fields are filled in
  if($("#skinName").val() == '' || $("#vBucks").val() == '' || $("#rarity").val() == '') {
    M.toast({html: 'All fields are required!'});
    return false;
  }

  // sends request
  sendAjax('POST', $("#skinForm").attr("action"), $("#skinForm").serialize(), function() {
    M.toast({html: 'Skin Added', displayLength: 2500});
    loadSkinsFromServer($("#token").val());
  });

  return false;
};

// deletes a skin from the list
const handleDelete = (e) => {
  e.preventDefault();
    
  M.toast({html: 'Skin Deleted!', displayLength: 2500});
  
  // sends the delete request
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

// checks if skin list is empty
const SkinList = function(props) {
  if(props.skins.length === 0) {
    return (
      <div className="skinList">
        <h3 className="emptySkin">No Skins yet</h3>
      </div>
    );
  }

  // creates skin cards
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

// sends a request to get the user's skins
const loadSkinsFromServer = (csrf) => {
  sendAjax('GET', '/getSkins', null, (data) => {
    ReactDOM.render(
      <SkinList skins={data.skins} csrf={csrf}/>, document.querySelector("#skins")
    );
  });
};

// sets up React renders
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