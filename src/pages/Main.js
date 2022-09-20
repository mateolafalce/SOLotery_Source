import React from "react";
import "App.css"
import  * as functions from "functions/timeconverter.js";
import * as data from "const/const.js"
import * as buffer from "buffer";
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  NavLink
} from "react-router-dom"
import Phamton from 'const/phantom-ghost-white.png';

export default function Main() {
  window.Buffer = buffer.Buffer;
  const [amount, setAmount] = useState(0);
  const [players, setPlayers] = useState(0);
  const [secureCheck, setSecureCheck] = useState(null);
  const [bumporiginal, setBump] = useState(null);
  const [winnerState, setWinner] = useState(null);
  const [tx, setTx] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    window.solana.on("connect", () => {
      console.log('updated...')
    })
    return () => {
      window.solana.disconnect();
    }
  }, [])
  
  function correctAmount(amount) {
    let am = (amount / LAMPORTS_PER_SOL);
    if (am < 0.076) {
      setAmount(0);
    } else {
      setAmount((am - 0.0702542).toFixed(7));
    }
  }
  async function getTx() {
    let tx = await data.connectiontx.getSignaturesForAddress(data.programID, { limit: 1 })
    setTx(tx[0].signature);
  }
  async function state() {
    const Account = await data.program.account.soLotery.fetch(data.AccountPk);
    let balance = await data.connection.getBalance(data.AccountPk);
    correctAmount(balance);
    setPlayers(Account.players.length);
    setSecureCheck(Account.secureCheck);
    setBump(Account.bumpOriginal);
    setAccount(Account.authority.toBase58());
    if (Account.chooseWinnerOnlyOneTime === 1) {setWinner("Choosed")} else {setWinner("No winner")}
  }
  useEffect(function () {
    state()
  }, [])
  useEffect(function () {
    getTx()
  }, [])
  async function ticket() {
    try {
      const wallet = typeof window !== 'undefined' && window.solana;
      await wallet.connect()
      const tx = await data.program.methods.ticket().accounts({
        solotery: data.AccountPk,
        from: window.solana.publicKey,
        stake: data.AccountPk,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();
      console.log('Transaction: ', tx)
      setTx(tx)
      state();
    } catch (err) {
      console.log('err: ', err)
    }
  }
  return (
  <div className="App-bg">
    <header>
      <nav>
        <ul>
          <li><NavLink to="/">SOLotery</NavLink></li>
          <li><NavLink to="/exchange">Exchange</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink><a>Manifiesto</a></NavLink></li>
          <li><a target="_blank" href="https://github.com/mateolafalce/SOLotery_Source">Github</a></li>
          <li><NavLink onClick={state}>Refresh</NavLink></li>
        </ul>
      </nav>
    </header>

      <div className="App-header">
      <div style={{color: '#282c34'}}>
         <p>.</p>
      </div>
          <table width="900" cellSpacing="1" cellPadding="3" bgcolor="#1E679A">
        <tbody>
        <tr>
          <td>
            <font color="white" face="arial, verdana, helvetica">
        <b>SOLotery demo</b>
          </font>
          </td>
          </tr>
        </tbody>
        <tbody>
        <tr>
          <td bgcolor="white">
          <font face="arial, verdana, helvetica" color="black">
          <p>SOLotery PDA Account: {data.AccountPk.toString()}</p>
          <p>Total amount: {amount} SOL</p>
          <p>Tickets: {players}/300</p>
          <p>Secure check: {secureCheck ? functions.timeConverter(secureCheck) : null}</p>
          <p>Winner State: {winnerState}</p>
          <div className="PhamtonButton">
            <button onClick={ticket}>0.00777777 SOL<img src={Phamton} width="50" ></img></button>
          </div>
          </font>
          </td>
          </tr>
        </tbody>
        </table>

        <footer>
            Last Transaction: {tx}
        </footer>
    </div>
    </div>
  ); 
};
