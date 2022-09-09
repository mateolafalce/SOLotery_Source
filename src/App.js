import './App.css';
import * as buffer from "buffer";
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL} from '@solana/web3.js'
const idl = require('./idl/solotery.json');

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
  const [amount, setAmount] = useState(null);
  const [players, setPlayers] = useState(null);
  const [secureCheck, setSecureCheck] = useState(false);
  const [bumporiginal, setBump] = useState(null);
  const [winnerState, setWinner] = useState(null);
  const [tx, setTx] = useState(null);
  const [wallet, setWallet] = useState(null);

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
    setAmount((balance / LAMPORTS_PER_SOL) - 0.06830544);
    setPlayers(Account.players.length);
    setSecureCheck(Account.secureCheck);
    setBump(Account.bumpOriginal);
    if (Account.chooseWinnerOnlyOneTime === 1) {setWinner("Choosed")} else {setWinner("No winner")}
  }
  state();

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log('Connected with Public Key:', response.publicKey.toString());
          setWallet(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function ticket() {
    const tx = await program.methods.ticket().accounts({
        solotery: AccountPk,
        from: wallet.publicKey,
        stake: AccountPk,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();
      state();
    console.log('Transaction: ', tx)
    setTx(tx);
  }

  return (
    <div className="App">
      <nav>
        <div align="left">
          <button onClick={state}>Refresh</button>
        </div>
      </nav>
      <div className="App-header">
        <button onClick={checkIfWalletIsConnected}>getWallet</button>
        <button onClick={ticket}>Take a Ticket</button>
        <div className="SOLotery">
        <table width="300" cellspacing="1" cellpadding="3" border="0" bgcolor="#1E679A">
          <tr>
            <td><font color="white" face="arial, verdana, helvetica">
          <b>SOLotery demo</b>
            </font></td>
          </tr>
          <tr>
            <td bgcolor="white">
            <font face="arial, verdana, helvetica" color="black">
              <p>SOLotery PDA Account: {AccountPk.toString()}</p>
              <p>Original bump PDA: {bumporiginal}</p>
              <p>Total amount: {amount} SOL</p>
              <p>Total tickets: {players}</p>
              <p>Secure check: {secureCheck ? timeConverter(secureCheck) : null}</p>
              <p>Winner State: {winnerState}</p>
            </font>
            </td>
          </tr>
          </table>
        </div>
        <div className="SOLotery">
          <p>Your last Tx: {tx}</p>
        </div>
      </div>
    </div>
  );
}

export default App;