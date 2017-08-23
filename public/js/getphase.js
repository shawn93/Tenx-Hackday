var url = "\/getphase";
  var myInit = {
        method: "GET"  
  };
  var phase;
  fetch(url, myInit).then((response) =>{
    return response.json();
  }).then((data) => {
    phase = data;
    //TODO
  });
