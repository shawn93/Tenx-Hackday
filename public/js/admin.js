var cookie_email = getCookie("email").replace(/%40/g,"@");


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

var AdminForm = React.createClass({
  propTypes: {
    optional: React.PropTypes.element,
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },
  
  onNameChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {name: e.target.value}));
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

  onLimitsChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {limits: e.target.value}))
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit();
  },
  render: function() {
    return (
      React.createElement('h1', {className: 'AdminView-title'}, "Administrator Navigation Page"),
      React.createElement('form', {onSubmit: this.onSubmit, className: 'AdminForm'},
        React.createElement('h3', {className: 'AdminView-teamname'}, "HackDay Name"),
        React.createElement('input', {
          type: 'text',
          placeholder: 'i.e. HackDay 2017',
          value: this.props.value.name,
          onChange: this.onNameChange,
        }),
        React.createElement('h3', {className: 'AdminView-description'}, "Description: "),
        React.createElement('input', {
          type: 'textarea',
          placeholder: 'HackDay Description',
          value: this.props.value.description,
          onChange: this.onDescriptionChange,
        }),
        React.createElement('h3', {className: 'AdminView-judges'}, "Judges: "),
        React.createElement('input', {
          type: 'text',
          placeholder: 'i.e. Judges1@ten-x.com, Judges2@ten-x.com',
          value: this.props.value.email,
          onChange: this.onEmailChange,
        }),
        React.createElement('h3', {className: 'AdminView-limits'}, "Number of Teams Limit: "),
        React.createElement('input', {
          placeholder: 'i.e. 100',
          value: this.props.value.limits,
          onChange: this.onLimitsChange,
        }),
        React.createElement('button', {className: 'btn btn-info', type: 'submit'}, "Submit")
      )
    );
  },
});

var Phase = React.createClass({

  getInitialState: function () {
    
    return{
      selectedOption: ''
    };
  },

  handleOptionChange: function (changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  },

  handleFormSubmit: function (formSubmitEvent) {
    formSubmitEvent.preventDefault();
    var chosen = this.state.selectedOption;
    var url = "\/post_phase";
    var myInit = {
        method: 'POST',
        headers: {
          'phase': chosen,
        },
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((answer) => {
      if(answer==1){
        window.location='/admin.html?email='+cookie_email+'&message=phase_changed';
      }else{
        window.location='/message.html?err='+ 'error';
      }
    })
    console.log('You have selected:', this.state.selectedOption);
  },

  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
          <h2> Phases </h2>
            <form onSubmit={this.handleFormSubmit}>
              <div className="radio">
                <label>
                  <input type="radio" value="O" checked={this.state.selectedOption === 'O'} onChange={this.handleOptionChange} />
                  Open
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="P" checked={this.state.selectedOption === 'P'} onChange={this.handleOptionChange}/>
                  Start
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="V" checked={this.state.selectedOption === 'V'} onChange={this.handleOptionChange}/>
                  Voting
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="F" checked={this.state.selectedOption === 'F'} onChange={this.handleOptionChange}/>
                  Finals
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="C" checked={this.state.selectedOption === 'C'} onChange={this.handleOptionChange}/>
                  Close
                </label>
              </div>
              <button className="btn btn-info" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
/*
* Displaying the whole page
*/
var AdminView = React.createClass({
  propTypes: {
    admins: React.PropTypes.array.isRequired,
    newAdmin: React.PropTypes.object.isRequired,
    onNewAdminChange: React.PropTypes.func.isRequired,
    onNewAdminSubmit: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      React.createElement('div', {className: 'AdminView'},
        React.createElement('h1', {className: 'AdminView-title'}, "Administrator Navigation Page"),
        React.createElement(AdminForm, {
          value: this.props.newAdmin,
          onChange: this.props.onNewAdminChange,
          onSubmit: this.props.onNewAdminSubmit,
        })
      )
    );
  },
});
/*
 * Constants
 */
var CONTACT_TEMPLATE = {name: "", title: "", judges: "", description: "", limits: "", errors: null};
/*
 * Actions
 */
function updateNewAdmin(admin) {
  setState({ newAdmin: admin });
}
/*
* When Clicking the submit button
*/
function submitNewAdmin() {

  var admin = Object.assign({}, state.newAdmin);
  var url = "\/post_admin";
    var myInit = {
        method: 'POST',
        headers: {
          'email': admin.email,
          'title': admin.name,
          'description': admin.description,
          'video': admin.limits,
        },
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((answer) => {
      if(answer==1){
        window.location='/home.html?email='+cookie_email+'&message=admin_succeed';
      }else{
        window.location='/message.html?err='+ 'error';
      }
    })

  console.log('HackDay Name: '+admin.name);
  console.log('HackDay Description: '+admin.description);
  console.log('Judges: '+admin.email);
  console.log('Team Limits: '+admin.limits);
}

var state = {};

function setState(changes) {
  Object.assign(state, changes);
  ReactDOM.render(
    <Manubar />, document.getElementById('manubar')
  );
  ReactDOM.render(
    <Phase />, document.getElementById('phase')
  );
  ReactDOM.render(
    React.createElement(AdminView, Object.assign({}, state, {
      onNewAdminChange: updateNewAdmin,
      onNewAdminSubmit: submitNewAdmin,
    })),
    document.getElementById('page')
  );
}

setState({
  admins: [],
  newAdmin: Object.assign({}, CONTACT_TEMPLATE),
});
