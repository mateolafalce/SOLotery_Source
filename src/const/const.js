import * as anchor from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey} from '@solana/web3.js'

const idl = require('../idl/solotery.json');
export const opts = {
    preflightCommitment: "recent",
  };
  export const programID = new PublicKey("7hAdqnGKHeagVQaZ8mfUdVhJLFeLi3Cw87mwDf9UKcjf");
  export const AccountPk = new PublicKey("GLT2e7e8YffzWqibVDA8Wyjw8Ls2aVgo5N62uZN27VLt");
  export const wallet = window.solana;
  export const network = clusterApiUrl("devnet");
  export const connection = new Connection(network, opts.preflightCommitment);
  export const provider = new anchor.AnchorProvider(
    connection, wallet, opts.preflightCommitment,
  );
  export const program = new anchor.Program(idl, programID, provider);