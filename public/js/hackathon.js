var email = getCookie("email").replace(/%40/g,"@");

if(email==""){
  window.location='/message.html?mes='+'cookie_expired';
}

//Exit submit
var Add_grade = React.createClass({
  redirect() {
    var url = "\/post_gradetable";
    var myInit = {
        method: 'POST',
        headers: {
          'email':email,
        },
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((answer) => {
      if(answer==1){
        window.location="/hackathon.html?mes=System_already_build_a_gradelist_for_you!_Enjoying!"; 
      } else {
        window.location="/hackathon.html?mes="+answer[0]; 
      }
    })
  },

  render: function() {
    var style = {
      float: 'right',
      padding: '15px'
    };
    return (
      <div className="add_grade" style={style}>
        <button onClick={this.redirect} type="button" className="btn btn-warning"><span id="exit">Let us Grade</span></button>  
      </div>
    );
  }
});

var Manubar = React.createClass({
  render: function() {
    const email = this.props.list.email[0];
    var urlhome = "home.html?email=" + email;
    var urlwinner = "winner.html?email=" + email;
    return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" onClick={this.slidecontrol}>Hackday</a>
        </div>
        <ul className="nav navbar-nav">
          <li ><a href={urlhome}> Home </a></li>
          <li className="active"><a href="#"> Hackathon </a></li>
          <li><a href={urlwinner}> Winner </a></li>
        </ul>
      </div>
    </nav>
    );
  }
});

class Top extends React.Component {
  constructor(props){
    super(props);
    this.state = {stage: []};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    var url = "\/getphase?email=" + email;
    var myInit = {
        method: "GET"
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((data) => {
      if(data == 'O') {
        this.state.stage[0] = 'Open';
      }
      if(data == 'S') {
        this.state.stage[0] = 'Start';
      }
      if(data == 'V') {
        this.state.stage[0] = 'Voting';
      }
      if(data == 'F') {
        this.state.stage[0] = 'Finals';
      }
      if(data == 'C') {
        this.state.stage[0] = 'Close';
      }
      this.setState(this.state); 
    })
  }

  render() {
    const email = this.props.list.email[0];
    return (
    <div className="top">
        <h3>Username: {email}</h3>
        <h2>Welcome to Tenx Hackathon</h2>
        <h4>Current stage: <strong>{this.state.stage[0]}</strong></h4>
    </div>
    );
  }
}

class Voteproject extends React.Component {
  constructor(props){
    super(props);
    this.state = {len: 0, todolist: []};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount() {
    var url = "\/get_titleLen?email=" + email;
    var myInit = {
        method: "GET"
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((data) => {
      this.state.len = data[0];
      this.state.todolist[0] = "Remain(" + this.state.len + ") to Vote"
      this.setState(this.state); 
    })
  }

  redirect() {
    if(this.state.len !=0){
      window.location='/grade.html?email='+ email;
    }
    else{
      document.getElementById("voteproject").disabled = true;
      // window.location='/message.html?err='+ 'grading_table_is_currently_unavailble_or_already_did_grade';
    }
  }

  render() {
    if(this.state.len == 0) {
      this.state.todolist[0] = "Vote Done";
    }
    return ( 
      <div className="voteproject">
        <button onClick={this.redirect} type="button" className="btn btn-info"><span id="voteproject">{this.state.todolist[0]}</span></button>  
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onUserInput(
    this.filterTextInput.value,
    );
  }

  render(){
     return (
         <form>
           <input type = "text" placeholder = "Search Project Title..." value={this.props.filterText} ref={(input) => this.filterTextInput = input} onChange={this.handleChange} />
         </form>
      );
  }
}

class ProjectTable extends React.Component {
  render() {
    var rows = [];
    for (var i = 0; i < this.props.list.title.length; i++) {
      if (this.props.list.title[i].indexOf(this.props.filterText) === -1 ) {
        continue;
      }
      rows.push(      
        <tr>
        <td><a href="#">{this.props.list.title[i]}</a></td>
        <td>{this.props.list.description[i]}</td>
        <td>{this.props.list.repo[i]}</td>
        <td>{this.props.list.demo[i]}</td>
        <td>{this.props.list.creativity[i]}</td>
        <td>{this.props.list.impact[i]}</td>
        <td>{this.props.list.viability[i]}</td>
        </tr>
      );
    }
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Description</th>
            <th>Repository</th>
            <th>Demo</th>
            <th>Creativity</th>
            <th>Impact</th>
            <th>Viability</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

var FilterableProjectTable = React.createClass({
  render: function() {
    return (
      <div>
        <ProjectTable list={this.props.list} filterText={this.props.filterText} />
      </div>
    );
  }
});

class Container extends React.Component{
  constructor(props){
    super(props);
    this.state = {message:[], title: [], description:[], repo:[], demo:[], email: [], creativity: [], impact: [], viability: [], total: 0, filterText: ''};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
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
    var url = "\/get_projectList?email="+email;
    var myInit = {
        method: "GET"
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((data) => {
      this.state.message = data;
      if(data.length == 1){
        window.location='\/message.html?err='+data[0];
      }
      this.state.total = data.length;
      this.state.email[0] = email;
      for(var i=0; i < this.state.total; i++){
        this.state.title[i] = this.state.message[i].title;
        this.state.description[i] = this.state.message[i].description;
        this.state.repo[i] = this.state.message[i].repo;
        this.state.demo[i] = this.state.message[i].demo;
        this.state.creativity[i] = this.state.message[i].creativity;
        this.state.impact[i] = this.state.message[i].impact;
        this.state.viability[i] = this.state.message[i].viability;
      }
      this.setState(this.state); 
    })
  }

  handleUserInput(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  }

  render(){
    return (
    <div className="container" id="container">
        <Manubar list = {this.state} />
        <br />
        <Top list = {this.state} />
        <Voteproject list = {this.state} />
        <Add_grade />
        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
        <hr />
        <FilterableProjectTable list={this.state} filterText={this.state.filterText} />
    </div>
    );   
  }
};



ReactDOM.render(
  <Container />,
  document.getElementById('page')
);