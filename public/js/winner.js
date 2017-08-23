var email = getCookie("email").replace(/%40/g,"@");

if(email==""){
  window.location='/message.html?mes='+'cookie_expired';
}

var Manubar = React.createClass({
  render: function() {
  const email = this.props.list.email[0];
  var urlhome = "home.html?email=" + email;
  var urlhackathon = "hackathon.html?email=" + email;
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

var Username = React.createClass({
  render: function() {
    const email = this.props.list.email[0]
    return (
    <div className="username">
      <h3>Welcome: {email}</h3>
      <h2>Congratulation for everyone participating Tenx Hackathon</h2>
      <h4>This is a wonderful competition of Intelligence. Above all, <strong>Good Job</strong></h4>
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
          <hr />
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
  const email = this.props.list.email[0];
    return (
      <table className="table table-hover">
      <thead>
      <tr>
        <th>Price</th>
        <th>Project Title</th>
      </tr>
      </thead>
      <tbody>
        <tr>
            <td>Outstanding Price</td>
            <td><a href="#">{this.props.list.title[0]}</a></td>
        </tr>
        <tr>
            <td>Wonderful Price</td>
            <td><a href="#">{this.props.list.title[1]}</a></td>
        </tr>
        <tr>
          <td>Great Price</td>
          <td><a href="#">{this.props.list.title[2]}</a></td>
        </tr>
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
    var url = "\/get_winner?email="+email;
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