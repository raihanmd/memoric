import anyTest from "ava";
import { Worker } from "near-workspaces";
import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first"); // temp fix for node >v17

/**
 *  @typedef {import('near-workspaces').NearAccount} NearAccount
 *  @type {import('ava').TestFn<{worker: Worker, accounts: Record<string, NearAccount>}>}
 */
const test = anyTest;

test.beforeEach(async (t) => {
  // Create sandbox
  const worker = (t.context.worker = await Worker.init());

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount("test-account");

  // Use provided wasm path or default to ../build/hello_near.wasm
  const wasmPath = process.argv[2] || "../build/hello_near.wasm";
  console.log("Using WASM path:", wasmPath);
  await contract.deploy(wasmPath);

  // Save state for test runs, it is unique for each test
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("returns the default greeting", async (t) => {
  const { contract } = t.context.accounts;
  const greeting = await contract.view("get_data", {});
  console.log("greeting", greeting);
  t.is(greeting, "Hello");
});

test("changes the greeting", async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(contract, "set_greeting", { greeting: "Howdy" });
  const greeting = await contract.view("get_greeting", {});
  t.is(greeting, "Howdy");
});
