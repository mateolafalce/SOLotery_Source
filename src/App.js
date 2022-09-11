import './App.css';
import * as data from "./const/const.js"
import * as buffer from "buffer";
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import  * as functions from "./functions/timeconverter.js";


function App() {
  window.Buffer = buffer.Buffer;
  const [amount, setAmount] = useState(null);
  const [players, setPlayers] = useState(null);
  const [secureCheck, setSecureCheck] = useState(false);
  const [bumporiginal, setBump] = useState(null);
  const [winnerState, setWinner] = useState(null);
  const [tx, setTx] = useState(null);

  useEffect(() => {
    window.solana.on("connect", () => {
      console.log('updated...')
    })
    return () => {
      window.solana.disconnect();
    }
  }, [])
  async function state() {
    const Account = await data.program.account.soLotery.fetch(data.AccountPk);
    let balance = await data.connection.getBalance(data.AccountPk);
    setAmount((balance / LAMPORTS_PER_SOL) - 0.06830544);
    setPlayers(Account.players.length);
    setSecureCheck(Account.secureCheck);
    setBump(Account.bumpOriginal);
    if (Account.chooseWinnerOnlyOneTime === 1) {setWinner("Choosed")} else {setWinner("No winner")}
  }
  useEffect(function () {
    state()
  }, [])
  
  async function getWallet() {
    try {
      const wallet = typeof window !== 'undefined' && window.solana;
      await wallet.connect()
    } catch (err) {
      console.log('err: ', err)
    }
  }

  async function ticket() {
    const tx = await data.program.methods.ticket().accounts({
        solotery: data.AccountPk,
        from: data.wallet.publicKey,
        stake: data.AccountPk,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();
      state();
    console.log('Transaction: ', tx)
    setTx(tx);
  }

  return (
    <div className="App">
      <navbar>
        <div align="left">
          <button onClick={state}>Refresh</button>
        </div>
      </navbar>
      <div className="App-header">
        <button onClick={getWallet}>getWallet</button>
        <button onClick={ticket}>Take a Ticket</button>
        <div className="SOLotery">
        <table width="300" cellspacing="1" cellpadding="3" border="0" bgcolor="#1E679A">
          <tbody>
            <td><font color="white" face="arial, verdana, helvetica">
          <b>SOLotery demo</b>
            </font></td>
          </tbody>
          <tbody>
            <td bgcolor="white">
            <font face="arial, verdana, helvetica" color="black">
              <p>SOLotery PDA Account: {data.AccountPk.toString()}</p>
              <p>Original bump PDA: {bumporiginal}</p>
              <p>Total amount: {amount} SOL</p>
              <p>Total tickets: {players}</p>
              <p>Secure check: {secureCheck ? functions.timeConverter(secureCheck) : null}</p>
              <p>Winner State: {winnerState}</p>
            </font>
            </td>
          </tbody>
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