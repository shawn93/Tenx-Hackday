var cookie_email = getCookie("email").replace(/%40/g,"@");
var title = get("title");
var email;
      var description = "";
      var video;
      var repo;
      var demo;
while(title.includes("%20")){
  title = title.replace("%20"," ");
}
var url = "\/get_register?email="+cookie_email+"&title="+title;
    var myInit = {
        method: "GET"
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((data) => {
      for(var i = 0; i< data.length; i++){
        if(data[i] == "undefined"){
          data[i] = "";
        }
      }
      email = data[4];
      description = data[0];
      video = data[1];
      repo = data[2];
      demo = data[3];

      

var Manubar = React.createClass({
  render: function() {
  var urlhome = "home.html?email=" + cookie_email;
  var urlhackathon = "hackathon.html?email=" + cookie_email;
    return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" onClick={this.slidecontrol}>Hackday</a>
        </div>
        <ul className="nav navbar-nav">
          <li><a href={urlhome}> Home </a></li>
          <li><a href={urlhackathon}> Hackathon </a></li>
          <li className="active"><a href="#"> Winner </a></li>
        </ul>
      </div>
    </nav>
    );
  }
});

 
 



var ProfileForm = React.createClass({
  propTypes: {
    optional: React.PropTypes.element,
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },


  onTitleChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {title: e.target.value}));
  },
  
  onEmailChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {email: e.target.value}));
  },
  
  onDescriptionChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {description: e.target.value}));
  },

  onVideoChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {video: e.target.value}))
  },

  onRepoChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {repo: e.target.value}))
  },

  onDemoChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {demo: e.target.value}))
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit();
  },
  render: function() {
    return (
      React.createElement('h1', {className: 'ProfileView-title'}, "Profile Setup and Project Submission"),
      React.createElement('form', {onSubmit: this.onSubmit, className: 'ProfileForm'},
        React.createElement('h3', {className: 'ProfileView-projecttitle'}, "Project Title: "),
        React.createElement('input', {
          type: 'text',
          placeholder: 'MyHackDayProject',
          value: this.props.value.title,
          onChange: this.onTitleChange,
        }),
        React.createElement('h3', {className: 'ProfileView-emails'}, "Members Email: "),
        React.createElement('input', {
          type: 'textarea',
          placeholder: 'member1@ten-x.com, member2@ten-x.com, member3@ten-x.com',
          value: this.props.value.email,
          onChange: this.onEmailChange,
        }),
        React.createElement('h3', {className: 'ProfileView-description'}, "Project Description: "),
        React.createElement('textarea', {
          placeholder: 'Describe what you are making',
          value: this.props.value.description,
          onChange: this.onDescriptionChange,
        }),
        React.createElement('h3', {className: 'ProfileView-video'}, "Video Link: "),
        React.createElement('input', {
          type: 'url',
          placeholder: 'https://www.youtube.com/abcdefgh',
          value: this.props.value.video,
          onChange: this.onVideoChange,
        }),
        React.createElement('h3', {className: 'ProfileView-repo'}, "Repository Link: "),
        React.createElement('input', {
          type: 'url',
          placeholder: 'https://www.github.com/myname/project1',
          value: this.props.value.repo,
          onChange: this.onRepoChange,
        }),
        React.createElement('h3', {className: 'ProfileView-demo'}, "Demo Link: "),
        React.createElement('input', {
          type: 'url',
          placeholder: 'https://www.myproject.com',
          value: this.props.value.demo,
          onChange: this.onDemoChange,
        }),
        React.createElement('button', {className: 'btn btn-info', type: 'submit'}, "Submit")
      )
    );
  },
});
/*
* Displaying the whole page
*/
var ProfileView = React.createClass({
  propTypes: {
    profiles: React.PropTypes.array.isRequired,
    newProfile: React.PropTypes.object.isRequired,
    onNewProfileChange: React.PropTypes.func.isRequired,
    onNewProfileSubmit: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      React.createElement('div', {className: 'ProfileView'},
        React.createElement('h1', {className: 'ProfileView-title'}, "Profile Setup and Project Submission"),
        React.createElement(ProfileForm, {
          value: this.props.newProfile,
          onChange: this.props.onNewProfileChange,
          onSubmit: this.props.onNewProfileSubmit,
        })
      )
    );
  },
});
/*
 * Constants
 */
var CONTACT_TEMPLATE = {title: title, email: email, description: description, video: video, repo: repo, demo: demo, errors: null};
/*
 * Actions
 */
function updateNewProfile(profile) {
  setState({ newProfile: profile });
}
/*
* When Clicking the submit button
*/
function submitNewProfile() {

  var profile = Object.assign({}, state.newProfile);
  var url = "\/post_regout?title="+get(title);
    var myInit = {
        method: 'POST',
        headers: {
          'email': profile.email,
          'title': profile.title,
          'description': profile.description,
          'video': profile.video,
          'repo': profile.repo,
          'demo': profile.demo,
        },
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((answer) => {
      if(answer==1){
        window.location='/home.html?email='+cookie_email;
      }else{
        window.location='/message.html?err='+ 'error';
      }
    })
}

var state = {};

      function setState(changes) {
  Object.assign(state, changes);
  ReactDOM.render(
    <Manubar />, document.getElementById('manubar')
  );
  ReactDOM.render(
    React.createElement(ProfileView, Object.assign({}, state, {
      onNewProfileChange: updateNewProfile,
      onNewProfileSubmit: submitNewProfile,
    })),
    document.getElementById('page')
  );
}


setState({
  profiles: [],
  newProfile: Object.assign({}, CONTACT_TEMPLATE),
});
    });


