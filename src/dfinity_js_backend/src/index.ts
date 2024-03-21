import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Principal,
  nat64,
  Result,
  Canister,
} from "azle";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

// Define a Member type for Chamaa application
const Member = Record({
  id: text,
  name: text,
  email: text,
  contributions: Vec(text),
  investments: Vec(text),
});

// Define a payload for adding or updating member information
const MemberPayload = Record({
  name: text,
  email: text,
});

// Define a Contribution type for tracking member contributions
const Contribution = Record({
  id: text,
  memberId: text,
  amount: nat64,
  date: text,
});

// Define an Investment type for tracking group investments
const Investment = Record({
  id: text,
  record_type: text,
  amount: nat64,
  date: text,
  returns: nat64,
});

// Investment Payload
const InvestmentPayload = Record({
  record_type: text,
  amount: nat64,
  date: text,
});

// Define an error type for handling various operation outcomes
const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
});

// Initialize storage for members, contributions, and investments
const membersStorage = StableBTreeMap(0, text, Member);
const contributionsStorage = StableBTreeMap(1, text, Contribution);
const investmentsStorage = StableBTreeMap(2, text, Investment);

export default Canister({
  addMember: update([MemberPayload], Result(Member, ErrorType), (payload) => {
    if (!payload.name || !payload.email) {
      return Err({ InvalidPayload: "Name and email are required." });
    }
    const newMember = {
      id: uuidv4(),
      ...payload,
      contributions: [],
      investments: [],
    };
    membersStorage.insert(newMember.id, newMember);
    return Ok(newMember);
  }),

  getMembers: query([], Vec(Member), () => {
    return membersStorage.values();
  }),

  addContribution: update(
    [text, nat64, text], // memberId, amount, date
    Result(Contribution, ErrorType),
    (memberId, amount, date) => {
      const member = membersStorage.get(memberId);
      if ("None" in member) {
        return Err({ NotFound: `Member with id=${memberId} not found.` });
      }
      
      const newContribution = {
        id: uuidv4(),
        memberId,
        amount,
        date,
      };
      
      contributionsStorage.insert(newContribution.id, newContribution);
      return Ok(newContribution);
    }
  ),

  getContributions: query([], Vec(Contribution), () => {
    return contributionsStorage.values();
  }),

  // Investment
  addInvestment: update(
    [InvestmentPayload], // type, amount, date
    Result(Investment, ErrorType),
    (payload) => {
      if (!payload.record_type || !payload.amount || !payload.date) {
        return Err({ InvalidPayload: "Type, amount, and date are required." });
      }
      const newInvestment = {
        id: uuidv4(),
        ...payload,
        returns: 0n,
      };
      
      investmentsStorage.insert(newInvestment.id, newInvestment);
      return Ok(newInvestment);
    }
  ),

  getInvestments: query([], Vec(Investment), () => {
    return investmentsStorage.values();
  }),
});


// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
