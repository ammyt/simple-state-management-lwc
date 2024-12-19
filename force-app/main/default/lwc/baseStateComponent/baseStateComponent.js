import { LightningElement, track } from 'lwc';

let store = {}; // Shared state object

const listeners = new Set();

// Notify all subscribers
const notifyListeners = (oldState, newState, changePayload) => {
    listeners.forEach((listener) => {
        listener({
            oldState,
            changePayload,
            resultingState: newState,
        });
    });
};

// Proxy for tracking store updates
const proxyStore = new Proxy(store, {
    set(target, property, value) {
        const oldState = { ...store }; // Capture old state
        target[property] = value;

        // Prepare the changePayload for the updated property
        const changePayload = {
            [property]: {
                oldValue: oldState[property],
                newValue: value,
            },
        };

        // Notify listeners with consistent format
        notifyListeners(oldState, { ...store }, changePayload);

        return true;
    },
});

export default class BaseStateComponent extends LightningElement {
    @track state = {}; // Reactive property for derived components

    // Getter for accessing the store
    get store() {
        return proxyStore;
    }

    // Update the shared store and notify subscribers
    updateStore(newState) {
        const oldState = { ...store };
        Object.assign(proxyStore, newState); // Triggers Proxy's `set`
        const resultingState = { ...store };

        // Calculate the changePayload
        const changePayload = this.getChangePayload(oldState, newState);

        // Notify listeners with consistent format
        notifyListeners(oldState, resultingState, changePayload);
    }

    // Calculate detailed change payload
    getChangePayload(oldState, newState) {
        const changes = {};
        for (const key in newState) {
            if (oldState[key] !== newState[key]) {
                changes[key] = {
                    oldValue: oldState[key],
                    newValue: newState[key],
                };
            }
        }
        return changes
    }

    // Subscribe to store changes
    subscribe(listener) {
        listeners.add(listener);

        // Immediately notify the new subscriber with the current state
        listener(store, null);

        return () => listeners.delete(listener); // Unsubscribe function
    }

    // Lifecycle hook for automatic subscription
    connectedCallback() {
        this.unsubscribe = this.subscribe(({ resultingState, changePayload }) => {
            const oldState = { ...this.state };
            this.state = { ...resultingState }; // Reactively update `state`
            this.onStoreUpdate(oldState, changePayload, this.state);
        });

        // Initialize `state` with the current store value
        const initialState = { ...this.store };
        this.state = initialState;
        this.onStoreUpdate({}, null, initialState); // Notify with no changes initially
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    // Method to be overridden by derived components
    onStoreUpdate(oldState, changePayload, newState) {
        // Default implementation (can be empty)
    }

    log(...message) {
        // Stringify messages to prevent console.log errors
        console.log(...message.map((msg) => JSON.stringify(msg, null, 2)));
    }
}