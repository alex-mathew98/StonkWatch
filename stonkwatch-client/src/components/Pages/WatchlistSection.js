import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "../Buttons/Custom Button/Button";
import WatchList from "../Tables/Watchlist";
import ModalSearchBar from "../SearchBar/ModalSearchBar";

// Retrieving currently logged in user's profile from localStorage
var currentUser = JSON.parse(localStorage.getItem("userProfile"));

// Class Component implemented for the watchlist section in the Dashboard page
class WatchlistSection extends Component {
  state = {
    open: false,
    companyID: 0,
  };

  constructor() {
    super();
  }

  //Modal operations
  handleOpen = async () => {
    this.setState({ open: true });
  };
  handleClose = async () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="watchListSection">
        <div className="watchList_Title">
          <div>
            <h1>Watchlist</h1>
          </div>
          <div className="right-half">
            <h7>Add ticker</h7>
            <Button
              onClick={() => {
                this.handleOpen();
              }}
            >
              +
            </Button>
            <Modal size="lg" show={this.state.open} onHide={this.handleClose}>
              <Modal.Header closeButton className="Modal_title">
                <Modal.Title>Search Ticker </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <ModalSearchBar
                    use="add"
                    currentUser={currentUser}
                  ></ModalSearchBar>
                </div>
              </Modal.Body>
              <br />
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <br />
        <WatchList></WatchList>
      </div>
    );
  }
}

export default WatchlistSection;
