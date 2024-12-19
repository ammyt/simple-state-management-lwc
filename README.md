# Global State Management for LWC

This project provides a simple global state management system for Lightning Web Components (LWC). It allows components to share and react to a centralized state in a consistent manner.

## Features

- Centralized state management using a shared store
- Reactive updates for derived components
- Customizable lifecycle hooks for state updates
- Easy-to-use subscription mechanism
- Detailed logging for state changes

---

## Installation

Clone this repository and integrate the provided files into your LWC project.

---

## How It Works

The system uses a shared `store` object wrapped in a JavaScript `Proxy`. This proxy tracks state updates and notifies all subscribed components about changes. Derived components inherit from the `BaseStateComponent` class to access and manage this shared state.

---


## Usage

### Step 1: Extend `BaseStateComponent`

Create a new component and extend `BaseStateComponent` to integrate global state management:

```javascript
import BaseStateComponent from 'c/baseStateComponent';

export default class MyComponent extends BaseStateComponent {
    connectedCallback() {
        super.connectedCallback(); //register component
        this.log(this.state) //log store content with custom logging function
    }

    handleAction() {
        this.updateStore({ actionTaken: true }); //update global store
    }

    onStoreUpdate(oldState, changePayload, newState) {
        console.log('State Updated:', { oldState, changePayload, newState }); //react to store updates
        //or use this.log as a bonus: this.log('State Updated:', { oldState, changePayload, newState });
    }
}
```

### Step 2: Use in LWC Templates

Bind component actions and state to the LWC template:

```html
<template>
    <div>
        <button onclick={handleAction}>Take Action</button>
        <p>State: {state}</p>
    </div>
</template>
```

---

## API Reference

### BaseStateComponent

#### Properties
- **`store`**: Access the shared state.
- **`state`**: Reactive property reflecting the current state.

#### Methods
- **`updateStore(newState)`**: Updates the shared state.
- **`subscribe(listener)`**: Subscribes to state changes.
- **`onStoreUpdate(oldState, changePayload, newState)`**: Hook for handling state updates.
- **`log(...message)`**: Utility for logging messages.

---

## License

MIT License.
