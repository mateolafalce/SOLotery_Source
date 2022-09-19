import * as anchor from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey} from '@solana/web3.js'

const idl = require('../idl/solotery.json');
export const opts = {
    preflightCommitment: "recent",
  };
  export const programID = new PublicKey("Ca8tecWTapYzeGfa8FvAMSo6JCheTRPvQhsjebZm56YE");
  export const AccountPk = new PublicKey("83xetaZnC4n37AxTwzUZXFnH8swQCyo9aQ8cypZh8bfA");
  export const wallet = window.solana;
  export const network = clusterApiUrl("devnet");
  export const connection = new Connection(network, opts.preflightCommitment);
  export const connectiontx = new Connection(network);
  export const provider = new anchor.AnchorProvider(
    connection, wallet, opts.preflightCommitment,
  );
  export const program = new anchor.Program(idl, programID, provider);
