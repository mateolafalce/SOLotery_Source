import './App.css';
import * as buffer from "buffer";
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL} from '@solana/web3.js'
const idl = require('/mnt/c/Users/Mateo/test/src/idl/solotery.json');

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

const opts = {
  preflightCommitment: "recent",
};

const programID = new PublicKey("7hAdqnGKHeagVQaZ8mfUdVhJLFeLi3Cw87mwDf9UKcjf");
const AccountPk = new PublicKey("GLT2e7e8YffzWqibVDA8Wyjw8Ls2aVgo5N62uZN27VLt");
const wallet = window.solana;
const network = clusterApiUrl("devnet");
const connection = new Connection(network, opts.preflightCommitment);
const provider = new anchor.AnchorProvider(
  connection, wallet, opts.preflightCommitment,
);
const program = new anchor.Program(idl, programID, provider);

function App() {
  window.Buffer = buffer.Buffer;
  const [amount, setAmount] = useState(null)
  const [players, setPlayers] = useState(null)
  const [secureCheck, setSecureCheck] = useState(false)
  const [bumporiginal, setBump] = useState(null)
  const [winnerState, setWinner] = useState(null)
  const [tx, setTx] = useState(false)

  useEffect(() => {
    window.solana.on("connect", () => {
      console.log('updated...')
    })
    return () => {
      window.solana.disconnect();
    }
  }, [])
  async function state() {
    const Account = await program.account.soLotery.fetch(AccountPk);
    let balance = await connection.getBalance(AccountPk);
    setAmount((balance / LAMPORTS_PER_SOL)- 0.06830544);
    setPlayers(Account.players.length);
    setSecureCheck(Account.secureCheck);
    setBump(Account.bumpOriginal);
    if (Account.chooseWinnerOnlyOneTime === 1) {setWinner("Choosed")} else {setWinner("No winner")}
  }

  async function ticket() {
    const tx = await program.methods.ticket().accounts({
        solotery: AccountPk,
        from: wallet.publicKey,
        stake: AccountPk,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();
      const Account = await program.account.soLotery.fetch(AccountPk);
      let balance = await connection.getBalance(AccountPk);
      setAmount((balance / LAMPORTS_PER_SOL)- 0.06830544);
      setPlayers(Account.players.length);
      setSecureCheck(Account.secureCheck);
      setBump(Account.bumpOriginal);
      if (Account.chooseWinnerOnlyOneTime === 1) {setWinner("Choosed")} else {setWinner("No winner")}
      setTx(tx);
    console.log('Transaction: ', tx)
  }
  async function getWallet() {
    try {
      const wallet = typeof window !== 'undefined' && window.solana;
      await wallet.connect()
    } catch (err) {
      console.log('err: ', err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getWallet}>getWallet</button>
        <button onClick={ticket}>Take a Ticket</button>
        <button onClick={state}>Refresh state</button>

        <p>SOLotery PDA Account: {AccountPk.toString()}</p>
        <p>Original bump PDA: {bumporiginal}</p>
        <p>Total amount: {amount} SOL</p>
        <p>Total tickets: {players}</p>
        <p>Secure check: {secureCheck ? timeConverter(secureCheck) : null}</p>
        <p>Winner State: {winnerState}</p>
        <p>Last Tx: {tx}</p>
      </header>
    </div>
  );
}

export default App;