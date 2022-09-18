import React from "react";
import "App.css";
import  * as functions from "functions/timeconverter.js";
import * as data from "const/const.js"
import * as buffer from "buffer";
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  NavLink
} from "react-router-dom"

export default function Main() {
  window.Buffer = buffer.Buffer;
  const [amount, setAmount] = useState(null);
  const [players, setPlayers] = useState(null);
  const [secureCheck, setSecureCheck] = useState(false);
  const [bumporiginal, setBump] = useState(null);
  const [winnerState, setWinner] = useState(null);
  const [tx, setTx] = useState(null);
  const [account, setAccount] = useState(null);
  const [windowAccount, setWindowAccount] = useState(null);

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
  async function state() {
    const Account = await data.program.account.soLotery.fetch(data.AccountPk);
    let balance = await data.connection.getBalance(data.AccountPk);
    //setAmount((balance / LAMPORTS_PER_SOL));
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

  async function getWallet() {
    try {
      const wallet = typeof window !== 'undefined' && window.solana;
      await wallet.connect()
      setWindowAccount(window.solana.publicKey.toBase58())
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
  <div>
    <div className="App-header">
    <nav>
    <NavLink to="/exchange">Exchange</NavLink>
    <NavLink to="/about">About</NavLink>
    <button onClick={state}>Refresh</button>
    </nav>
      <button onClick={getWallet}>getWallet</button>
      <button onClick={ticket}>Take a Ticket</button>
      <div>
        <p>{windowAccount}</p>
      <table width="900" cellSpacing="1" cellPadding="3" bgcolor="#1E679A">
        <tbody>
        <tr>
          <td><font color="white" face="arial, verdana, helvetica">
        <b>SOLotery demo</b>
          </font></td>
          </tr>
        </tbody>
        <tbody>
        <tr>
          <td bgcolor="white">
          <font face="arial, verdana, helvetica" color="black">
          <p>SOLotery PDA Account: {data.AccountPk.toString()}</p>
          <p>Authority: {account}</p>
          <p>Original bump PDA: {bumporiginal}</p>
          <p>Total amount: {amount} SOL</p>
          <p>Total tickets: {players}</p>
          <p>Secure check: {secureCheck ? functions.timeConverter(secureCheck) : null}</p>
          <p>Winner State: {winnerState}</p>
          </font>
          </td>
          </tr>
        </tbody>
        </table>
      </div>
      <div className="SOLotery">
        <p>Your last Tx: {tx}</p>
      </div>
    </div>
    </div>
  ); 
};
