import React, {Component} from "react";
import {Chart} from "chart.js";
import "./charts.css";
import './App.css';

//TODO: Proper zoom on filter
class Barchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      chart: null,
      chartJSON: [],
      desc: false,
      sort: 'name'
    }
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleDescendingToggle = this.handleDescendingToggle.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  setSort(attr) {
    this.setState({sort: attr}, this.updateChart);
  }

  handleDescendingToggle() {
    this.setState(state => ({
      desc: !state.desc
    }), this.updateChart);
  }

  handleChangeFilter(event){    
    this.setState({filter: event.target.value.trim().toLowerCase()}, this.updateChart);  
  }

  componentDidMount() {
    this.initialize();
  }

  //sorts JSON data by key
  sortJSONData(key, data) {
    let sorted = [];
    let compare = function (a, b) {
      return (data[a][key] > data[b][key]) ? 1 : ((data[a][key] < data[b][key]) ? -1 : 0);
    };
    if (this.state.desc) {
      compare = function (a, b) {
        return (data[b][key] > data[a][key]) ? 1 : ((data[b][key] < data[a][key]) ? -1 : 0);
      }
    }
    Object.keys(data).sort(compare).forEach(function (id) {
      sorted.push(data[id]);
    });
    return sorted;
  }

  // Convert data for chart
  convertData(response) {
    let data = {
      names: [],
      values: [],
      colors: [],
    };
    let sorted = this.sortJSONData(this.state.sort, response.products);
    let count = 0;
    for (let i = 0; i < sorted.length; i++) {
      if(String(sorted[i].name.trim().toLowerCase().match(this.state.filter)) !== String(this.state.filter)){
        continue;
      }
      if (count % 2) {
        data.colors.push("rgba(0,255,0,0.5)");
      } else {
        data.colors.push("rgba(0,0,255,0.5)");
      }
      data.names.push(sorted[i].name);
      data.values.push(sorted[i].count);
      count++;
    }
    return data;
  }

  //initializes the Barchart
  async initialize() {
    // Fetch API call
    await fetch("/inventory/", {
      method: "GET",
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({chartJSON: response});
          let data = this.convertData(response);
          // Create the chart
          this.setState({chart: new Chart(document.getElementById("myChart").getContext("2d"), {
            type: "bar",
            data: {
              labels: data.names,
              datasets: [
                {
                  data: data.values,
                  backgroundColor: data.colors,
                },
              ],
            },
            options: {
              responsive: false,
              maintainAspectRatio: false,
              responsiveAnimationDuration: 0,
              legend: {
                display: false,
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            },
          })
        });
      });
  }

  /*function that removes the data of the chart and sets new data
  based on the chartJSON, sort and desc state*/
  updateChart() {
    var chart = this.state.chart;
    //remove current data
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    //add the new data
    let data = this.convertData(this.state.chartJSON);
    chart.data.labels.push(data.names);
    chart.data = {
      labels: data.names,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.colors,
        },
      ],
    }
    chart.update();
    this.setState({chart: chart})
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light static-top mb-5 shadow">
            <div className="container">
              <a className="navbar-brand" href="/">Shop toolkit</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                      aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                      <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item active">
                      <a className="nav-link" href="/products">Products sold</a>
                    </li>
                    <li className="nav-item active">
                      <a className="nav-link" href="https://google.com">Google</a>
                    </li>
                  </ul>
                </div>
            </div>
          </nav>
          <div className="container">
            <div className="card border-0 shadow my-5">
              <div className="card-body p-5">
                <div id="wrapper" className="chartWrapper">
                  <canvas id="myChart" width={10000} height="500"/>
                  <button onClick={() => {
                    this.setSort('count')
                  }}>Sort by count
                  </button>
                  <button onClick={() => {
                    this.setSort('name')
                  }}>Sort by name
                  </button>
                  <button onClick={this.handleDescendingToggle}>
                  {this.state.desc ? 'Set ascending' : "Set descending"}
                  </button>
                  <input type="text" onChange={this.handleChangeFilter} />
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default Barchart;
