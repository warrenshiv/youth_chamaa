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
  phone: text,
  contributions: Vec(text),
  investments: Vec(text),
});

// Define a payload for adding or updating member information
const MemberPayload = Record({
  name: text,
  email: text,
  phone: text,
});

const Group = Record({
  id: text,
  name: text,
  description: text,
  members: Vec(text),
  discussions: Vec(text),
});

// Define a payload for addimg or updating group information
const GroupPayload = Record({
  name: text,
  description: text,
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

// Initialize storage for groups, members, contributions, and investments
const membersStorage = StableBTreeMap(0, text, Member);
const contributionsStorage = StableBTreeMap(1, text, Contribution);
const investmentsStorage = StableBTreeMap(2, text, Investment);
const groupsStorage = StableBTreeMap(3, text, Group);

export default Canister({
  // Group management Functions
  createGroup: update([GroupPayload], Result(Group, ErrorType), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "Invalid payload" });
    }
    const newGroup = {
      id: uuidv4(),
      ...payload,
      members: [],
      discussions: [],
    };
    groupsStorage.insert(newGroup.id, newGroup);
    return Ok(newGroup);
  }),

  getGroups: query([], Vec(Group), () => {
    return groupsStorage.values();
  }),

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

  updateMember: update(
    [text, text, text], // Member ID, email, phone
    Result(Member, ErrorType),
    (id, email, phone) => {
      const memberOpt = membersStorage.get(id);
      if ("None" in memberOpt) {
        return Err({ NotFound: `Member with id=${id} not found` });
      }
      const member = memberOpt.Some;
      const updatedMember = {
        ...member,
        email,
        phone,
      };
      membersStorage.insert(id, updatedMember);
      return Ok(updatedMember);
    }
  ),
  
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
