import React, { Component } from "react";
import ProductInfoTable from "../../charts/ProductInfoTable";


class ProductInfoTableWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retrieve: false,
    };
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
    if(!this.props.extended){
      document.getElementById("plu-input").value="";
    }
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  renderProductInfoTable() {
    return (
      <ProductInfoTable
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        onLoaded={this.onLoaded}
        extended={this.props.extended}
      />
    );
  }

  render() {
    return (
      <div>
        <button className={"btn btn-secondary mt-2 mb-2 btn-block"} onClick={this.handleRetrieveButton}>retrieve</button>
        {this.renderProductInfoTable()}
      </div>
    );
  }
}

export default ProductInfoTableWrapper;