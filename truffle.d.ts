import * as Web3 from "web3";
import { SimpleSaleInstance, SimpleTokenInstance } from "./contracts";

declare global {
  function contract(name: string, test: ContractTest): void;
  var artifacts: Artifacts;
  var web3: Web3;
  var assert: Chai.AssertStatic;
}

declare type ContractTest = (accounts: string[]) => void;

interface Contract<T> {
  "new"(...args: any[]): Promise<T>;
  deployed(): Promise<T>;
  at(address: string): T;
}

interface Artifacts {
  require(name: "SimpleSale"): Contract<SimpleSaleInstance>;
  require(name: "SimpleToken"): Contract<SimpleTokenInstance>;
}
