// tutorial2.js
var email = getCookie("email").replace(/%40/g,"@");

if(email==""){
  window.location='/message.html?mes='+'cookie_expired';
}

//Progress Bar
var Progress = React.createClass({
  render: function() {
    var progress = Math.floor((this.props.list.did/this.props.list.total) * 100);
    var style = {
      width: progress+'%',
    }

    return (
    <div className="progress">
      <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={style}>
        {this.props.list.did}/{this.props.list.total} Completed
      </div>
    </div>
    );
  }
});

//Exit submit
var Exit = React.createClass({
  redirect() {
    if (confirm("Do you want to submit your vote? Make sure that you saved every answer!\nOtherwise, they will not be in record") == true) {
      var url = "\/post_gradelist";
      var myInit = {
          method: 'POST',
          headers: {
            'gradelist':this.props.list.grade,
          },
      };
      fetch(url, myInit).then((response) =>{
        return response.json();
      }).then((answer) => {
        if(answer==1){
          window.location='/hackathon.html?mes='+'vote:_'+this.props.list.did+'_items,_'+'submit_successfully!';
        }else{
          window.location='/message.html?err='+ 'grade_cannot_exit';
        }
      })
    }
  },

  render: function() {
    var style = {
      float: 'right',
      padding:'5px'
    };
    return (
      <div className="exit" style={style}>
        <button onClick={this.redirect} type="button" className="btn btn-warning"><span id="exit">Submit and Exit</span></button>  
      </div>
    );
  }
});

//Project Name
var Top_line = React.createClass({
  render: function() {
  var style = {
    display: 'inline'
  }
    return (
    <div className="top_line">
      <h2  style={style}>{this.props.list.totallist[this.props.list.current*5+0]}</h2>
    </div>
    );
  }
});

//Project Description
var Desc = React.createClass({
  render: function() {
  var style = {
    display: 'inline'
  }
  return (
    <div className="desc">
      <pre>{this.props.list.totallist[this.props.list.current*5+1]}</pre>
    </div>
    );
  }
});

//Demo and Repo
var Detail = React.createClass({
  render: function() {
    return (
    <div className="detail">
      <h4>Demo</h4>
      <p>{this.props.list.totallist[this.props.list.current*5+3]}</p>
      <h4>Repository</h4>
      <p>{this.props.list.totallist[this.props.list.current*5+4]}</p>
    </div>
    );
  }
});

//Youtube
var Youtube_block = React.createClass({
  render: function() {
    return (
    <div className="embed-responsive embed-responsive-4by3">
      <iframe className="embed-responsive-item" src={this.props.list.totallist[this.props.list.current*5+2]}></iframe>
    </div>
    );
  }
});
    

class Container extends React.Component{
  constructor(props){
    super(props);
    this.state = {totallist:[], todolist:[], grade:[], total:0, did:0, current:0};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.go_next = this.go_next.bind(this);
    this.go_prev = this.go_prev.bind(this);
    this.panel_init = this.panel_init.bind(this);
    this.save_grade = this.save_grade.bind(this);
  }

  get(str) {
    var v = window.location.search.match(new RegExp('(?:[\?\&]'+str+'=)([^&]+)'));
    if(v){
      return v[1];
    } else {
      window.location='\/message.html?err=url_miss_email';
    }
  }

  componentDidMount() {
    var url = "\/get_gradelist?email="+email;
    var myInit = {
        method: "GET"
    };
    fetch(url, myInit).then((response) =>{
      return response.json();
    }).then((data) => {
      if(data.length == 1){
        window.location='\/message.html?err='+data[0];
      }
      this.state.totallist = data;
      this.state.grade[0] = email; 
      this.state.total = data.length/5;
      for(var i=0; i < this.state.total; i++){
        this.state.todolist[i] = "Save";
      }
      this.panel_init(0);
      this.setState(this.state);
      if(this.state.total == 1){
        document.getElementById("next").innerHTML = "End";
      }
    })
  }

  go_next(){
    if(this.state.current < this.state.total - 1){
      var newCurrent = this.state.current + 1;
      this.panel_init(newCurrent);
      this.setState({
        current : newCurrent
      });
      if(newCurrent == this.state.total - 1){
        document.getElementById("next").innerHTML = "End";
        document.getElementById("prev").innerHTML = "&laquo; Previous"; 
      }
      document.getElementById("prev").innerHTML = "&laquo; Previous";
    } 
  }

  go_prev(){
    if(this.state.current > 0){
      var newCurrent = this.state.current - 1;
      this.panel_init(newCurrent);
      this.setState({
        current : newCurrent
      });
      if(newCurrent == 0){
        document.getElementById("next").innerHTML = "Next &raquo";
        document.getElementById("prev").innerHTML = "Begin";
      }
      document.getElementById("next").innerHTML = "Next &raquo";
    }
  }

  panel_init(current){
    if(this.state.todolist[current] == "Save"){
      document.getElementById("submit").disabled = false;
      document.getElementById("rangeCre").value = 5;
      document.getElementById("rangeImp").value = 5;
      document.getElementById("rangeVia").value = 5;
      document.getElementById("rangeImp").disabled = false;
      document.getElementById("rangeVia").disabled = false;
      document.getElementById("rangeCre").disabled = false;
    }else{
      document.getElementById("submit").disabled = true;
      document.getElementById("rangeCre").value = this.state.grade[current*4+2];
      document.getElementById("rangeImp").value = this.state.grade[current*4+3];
      document.getElementById("rangeVia").value = this.state.grade[current*4+4];
      document.getElementById("rangeImp").disabled = true;
      document.getElementById("rangeVia").disabled = true;
      document.getElementById("rangeCre").disabled = true;
    }
    document.getElementById("creativity").innerHTML = document.getElementById("rangeCre").value;
    document.getElementById("impact").innerHTML = document.getElementById("rangeImp").value;
    document.getElementById("viability").innerHTML = document.getElementById("rangeVia").value;    
  }

  save_grade(){
    if(document.getElementById("submit").disabled == false){
      document.getElementById("submit").disabled = true;
      document.getElementById("rangeCre").disabled = true;
      document.getElementById("rangeImp").disabled = true;
      document.getElementById("rangeVia").disabled = true;
      this.state.grade[this.state.current*4+1] = this.state.totallist[this.state.current*5]; //projectname
      this.state.grade[this.state.current*4+2] = document.getElementById("rangeCre").value,  //creativity
      this.state.grade[this.state.current*4+3] = document.getElementById("rangeImp").value,  //impact
      this.state.grade[this.state.current*4+4] = document.getElementById("rangeVia").value,  //viability
      this.state.todolist[this.state.current] = "Saved";
      this.state.did++;
      this.setState(this.state);
    }
  }

  render(){
    var list = email;
    var style = {
      float:'left',
      padding: '5px'
    }

    function displayCre(){
      document.getElementById("creativity").innerHTML = document.getElementById("rangeCre").value;
    }

    function displayImp(){
      document.getElementById("impact").innerHTML = document.getElementById("rangeImp").value;
    }

    function displayVia(){
      document.getElementById("viability").innerHTML = document.getElementById("rangeVia").value;
    }

    return (
      <div className="container" id="container">
        <br />
        <Progress list = {this.state}/>
        <ul className="pager">
          <li className="previous"><a id="prev" onClick={this.go_prev}>Begin</a></li>
          <li className="next"><a id="next" onClick={this.go_next}>Next &raquo;</a></li>
        </ul>
        <Youtube_block list = {this.state}/>
        <br />
        <Top_line list = {this.state}/>
        <hr />
        <Desc list = {this.state}/>
        <Detail list = {this.state}/>

        
        <div className="panel" id="panel">
          <h4>Grade Here</h4>
          <form>
            <div className="well">
              <div className="grade_entry">
                <label>Creativity</label>
                <span id="creativity">5</span>
              </div>
              <input type="range" id="rangeCre" min="0" max="10" step="1" onChange={displayCre}></input>
            </div>
            <div className="well">
              <div className="grade_entry">
                <label>Impact</label>
                <span id="impact">5</span>
              </div>
              <input type="range" id="rangeImp" min="0"  max="10" step="1" onChange={displayImp}></input>
            </div>   
            <div className="well">
              <div className="grade_entry">
                <label>Viability</label>
                <span id="viability">5</span>
              </div>
              <input type="range" id="rangeVia" min="0"  max="10" step="1" onChange={displayVia}></input>
            </div>
            <span style={style}><button id="submit" onClick={this.save_grade} type="button" className="btn btn-info"><span id="save">{this.state.todolist[this.state.current]}</span></button></span>
            <Exit list = {this.state}/>
          </form>
        </div>
      </div>
    );
  }
};

ReactDOM.render(
  <Container />,
  document.getElementById('page')
);
