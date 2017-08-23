var email = getCookie("email").replace(/%40/g,"@");

if(email==""){
  window.location='/message.html?mes='+'cookie_expired';
}

var Manubar = React.createClass({
  render: function() {
  const email = this.props.list.email[0];
  var urlwinner = "winner.html?email=" + email;
  var urlhackathon = "hackathon.html?email=" + email;
    return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" onClick={this.slidecontrol}>Hackday</a>
        </div>
        <ul className="nav navbar-nav">
          <li className="active"><a href="#"> Home </a></li>
          <li><a href={urlhackathon}> Hackathon </a></li>
          <li><a href={urlwinner}> Winner </a></li>
        </ul>
      </div>
    </nav>
    );
  }
});

var Newproject = React.createClass({
  redirect() {
    const email = this.props.list.email[0];
    window.location='/register.html?email=' + email;
  },

  render: function() {
    return (
      <div className="newproject">
        <button onClick={this.redirect} type="button" className="btn btn-info"><span id="newproject">New Project</span></button>  
      </div>
    );
  }
});

var Username = React.createClass({
  render: function() {
    const email = this.props.list.email[0]
    return (
    <div className="username">
      <h2>Welcome: {email}</h2>
    </div>
    );
  }
});


var Slide_block = React.createClass({
  render: function() {
    return (
      <div className="slide_block" id="slide_block">
          <br />
          <Username list = {this.props.list}/>
          <Newproject list = {this.props.list}/>
          <hr />
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
  const projects = this.props.list.title;
  const email = this.props.list.email[0];
  var urlregout = "regout.html?email=" + email;
  var listItems = "";

  if (this.props.list.title[0] == 'No_Project_In_Your_Team') {
    listItems = projects.map((project) => <tr><td><a href="#">{project}</a></td></tr> );
  }
  else {
    listItems = projects.map((project) => <tr><td><a href={urlregout+ "&title=" + project}>{project}</a></td></tr> );
  }
    return (
      <table className="table table-hover">
      <thead>
      <tr>
        <th>Project Title</th>
      </tr>
      </thead>
      <tbody>
        {listItems}
      </tbody>
      </table>
    );
  }
});


class Container extends React.Component{
  constructor(props){
    super(props);
    this.state = {title: [], total: 0, email: []};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  get(str) {
    var v = window.location.search.match(new RegExp('(?:[\?\&]'+str+'=)([^&]+)'));
    if(v){
      return v[1];
    } 
    else {
      window.location='\/message.html?err=url_miss_email';
    }
  }

  componentDidMount() {
    var url = "\/get_pp?email="+email;
    var myInit = {
        method: "GET"
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((data) => {
      this.state.title = data;
      this.state.email[0] = email;     
      this.setState(this.state); 
    })
  }

  render(){
    return (
    <div className="container" id="container">
        <Manubar list = {this.state}/>
        <Slide_block list = {this.state}/>
        <ProjectList list = {this.state}/>
    </div>
    );   
  }
};

ReactDOM.render(
  <Container />,
  document.getElementById('page')
);
