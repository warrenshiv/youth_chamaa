# Youth Chamaa Management System

## Overview

Youth Chamaa is a decentralized platform designed for youth groups to manage their savings and investments collaboratively on the Internet Computer blockchain. It demonstrates how smart contracts can facilitate group savings, investment tracking, and member collaboration in a secure and transparent environment.

## Structure

### 1. Data Structures

- **Member**: Represents a group member with properties like `id`, `name`, `email`, `contributions`, `investments`.
- **Contribution**: Represents a member's financial contribution with properties like `id`, `memberId`, `amount`, `date`.
- **Investment**: Represents a group investment with properties like `id`, `type`, `amount`, `date`, `returns`.
- **MemberPayload**: Used for adding or updating member information.
- **ErrorType**: Variant type representing different error scenarios in the application.

### 2. Storage

- `membersStorage`: A `StableBTreeMap` to store member information.
- `contributionsStorage`: A `StableBTreeMap` to track member contributions.
- `investmentsStorage`: A `StableBTreeMap` to manage group investments.

### 3. Canister Functions

- **Add Member**: Registers a new member in the system.
- **Add Contribution**: Records a new financial contribution from a member.
- **Get Members**: Retrieves all members from storage.
- **Get Contributions**: Retrieves all contributions from storage.
- **Add Investment**: Adds a new investment for the group.
- **Get Investments**: Retrieves all investments from storage.
- **Update Member**: Updates an existing member's information.
- **Delete Member**: Removes a member from the system.

### 4. Helper Functions

- **Generate UUID**: Utilizes a UUID generation library to assign unique identifiers.
- **Verify Member**: Ensures the member exists before any related operation.

### 5. Dependencies

- Utilizes `"azle"` for blockchain integration and smart contract development.
- Employs external libraries for UUID generation and other utility functions as needed.

### 6. Miscellaneous

- Implements `globalThis.crypto` for cryptographic functionalities.
- Incorporates Internet Computer features like `ic.call` and `ic.time` for blockchain interactions.

### 7. Error Handling

- Adopts `Result` types for robust error handling across various functions.

## Deployment Instructions

### Member Canister

- Use `dfx deploy` to deploy the member management canister.

### Contribution Canister

- Similar deployment steps, ensuring the canister for handling contributions integrates seamlessly.

### Investment Canister

- Follow deployment procedures to initialize and set up the investment management canister on the Internet Computer network.

### How to Interact with Canisters

- After deployment, interact with canisters using `dfx` commands or through front-end interfaces designed to facilitate user interaction with the Chamaa platform.
