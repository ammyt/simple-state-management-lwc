import BaseStateComponent from 'c/baseStateComponent';


export default class OrderForm extends BaseStateComponent {

  connectedCallback() {
    super.connectedCallback() //register component

    this.log(this.state) //log store content with custom logging function
  }

  handleClick() {
    this.updateStore({ clicked: true }); //update global store
  }

  onStoreUpdate(oldState, changePayload, newState) {
    this.log(oldState, changePayload, newState) //react to store updates
  }

}