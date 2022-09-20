import React from "react";
import "App.css";
import { useEffect, useState } from 'react';
import * as data from "const/const.js";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as buffer from "buffer";
import {
  NavLink
} from "react-router-dom"

export default function Exchange() {

window.Buffer = buffer.Buffer;
  const [tx, setTx] = useState(null);
  const [owner1, setOwner1] = useState(null);
  const [owner2, setOwner2] = useState(null);
  const [owner3, setOwner3] = useState(null);
  const [owner4, setOwner4] = useState(null);
  const [owner5, setOwner5] = useState(null);
  const [owner6, setOwner6] = useState(null);
  const [owner7, setOwner7] = useState(null);
  const [proposal1, setProposal1] = useState(null);
  const [proposal2, setProposal2] = useState(null);
  const [proposal3, setProposal3] = useState(null);
  const [proposal4, setProposal4] = useState(null);
  const [proposal5, setProposal5] = useState(null);
  const [proposal6, setProposal6] = useState(null);
  const [proposal7, setProposal7] = useState(null);
  
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
    setOwner1(Account.owner1.toBase58());
    setOwner2(Account.owner2.toBase58());
    setOwner3(Account.owner3.toBase58());
    setOwner4(Account.owner4.toBase58());
    setOwner5(Account.owner5.toBase58());
    setOwner6(Account.owner6.toBase58());
    setOwner7(Account.owner7.toBase58());
    setProposal1((Account.bestProposal1 / LAMPORTS_PER_SOL));
    setProposal2((Account.bestProposal2 / LAMPORTS_PER_SOL));
    setProposal3((Account.bestProposal3 / LAMPORTS_PER_SOL));
    setProposal4((Account.bestProposal4 / LAMPORTS_PER_SOL));
    setProposal5((Account.bestProposal5 / LAMPORTS_PER_SOL));
    setProposal6((Account.bestProposal6 / LAMPORTS_PER_SOL));
    setProposal7((Account.bestProposal7 / LAMPORTS_PER_SOL));
  }
  useEffect(function () {
    const getState = async () => {
      await state()
    }
    getState()
  }, [])
  
  async function getWallet() {
    try {
      const wallet = typeof window !== 'undefined' && window.solana;
      await wallet.connect()
    } catch (err) {
      console.log('err: ', err)
    }
  }

  async function buyStock(number) {
    const Account = await data.program.account.soLotery.fetch(data.AccountPk);
    const tx = await data.program.methods.buyShare(
      number,
      new anchor.BN(6500)
    ).accounts({
      solotery: data.AccountPk,
      from: data.wallet.publicKey,
      creator: Account.authority,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();
      state();
    console.log('Transaction: ', tx)
    setTx(tx);
  }
  return (
    <div>
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
    <button onClick={getWallet}>getWallet</button>
    <div>
      <table cellSpacing="1" cellPadding="3" bgcolor="#1E679A">
      <h1>
        SOLotery Dividends
      </h1>
      <tbody>
        <td bgcolor="white">
        <font face="arial, verdana, helvetica" color="black">
        <p>SOLotery PDA Account: {data.AccountPk.toString()}</p>
        <p>Owner 1: {owner1}</p>
        <p>Current proposal: {proposal1} SOL</p>
        <button onClick={() => buyStock(1)}> compra un cripto dividendo diario</button>
        <p>Owner 2: {owner2}</p>
        <p>Current proposal: {proposal2} SOL</p>
        <button onClick={() => buyStock(2)}> compra un cripto dividendo diario</button>
        <p>Owner 3: {owner3}</p>
        <p>Current proposal: {proposal3} SOL</p>
        <button onClick={() => buyStock(3)}> compra un cripto dividendo diario</button>
        <p>Owner 4: {owner4}</p>
        <p>Current proposal: {proposal4} SOL</p>
        <button onClick={() => buyStock(4)}> compra un cripto dividendo diario</button>
        <p>Owner 5: {owner5}</p>
        <p>Current proposal: {proposal5} SOL</p>
        <button onClick={() => buyStock(5)}> compra un cripto dividendo diario</button>
        <p>Owner 6: {owner6}</p>
        <p>Current proposal: {proposal6} SOL</p>
        <button onClick={() => buyStock(6)}> compra un cripto dividendo diario</button>
        <p>Owner 7: {owner7}</p>
        <p>Current proposal: {proposal7} SOL</p>
        <button onClick={() => buyStock(7)}> compra un cripto dividendo diario</button>
        </font>
        </td>
      </tbody>
      </table>
      <p>Your last Tx: {tx}</p>
    </div>
    </div>
    </div>
    )
}