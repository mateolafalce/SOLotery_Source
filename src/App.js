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
  const [account, setAccount] = useState(null);
  const [owner1, setOwner1] = useState(null);
  const [owner2, setOwner2] = useState(null);
  const [owner3, setOwner3] = useState(null);
  const [owner4, setOwner4] = useState(null);
  const [owner5, setOwner5] = useState(null);
  const [owner6, setOwner6] = useState(null);
  const [owner7, setOwner7] = useState(null);

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
    setAmount((balance / LAMPORTS_PER_SOL));
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

  async function buyShare() {
    const Account = await data.program.account.soLotery.fetch(data.AccountPk);
    const tx = await data.program.methods.buyShare(
      7,
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

  const SOLotery = () => {
    return <div>
    <div align="left">
      <button onClick={state}>Refresh</button>
    </div>
  <div className="App-header">
    <button onClick={getWallet}>getWallet</button>
    <button onClick={ticket}>Take a Ticket</button>
    <div className="SOLotery">
    <table width="300" cellSpacing="1" cellPadding="3" border="0" bgcolor="#1E679A">
      <tbody>
        <td><font color="white" face="arial, verdana, helvetica">
      <b>SOLotery demo</b>
        </font></td>
      </tbody>
      <tbody>
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
      </tbody>
      </table>
    </div>
    <div className="SOLotery">
      <p>Your last Tx: {tx}</p>
    </div>

    <div>
      <h1>
        SOLotery Dividends
      </h1>
      <p>
        Todos los dias hay un ganador.
        Los dividendos criptograficos que proporciona SOLotery varia segun el pozo.
        El ganador de la loteria se lleva el 98% del pozo. 
        El otro 2% restante se reparte en el momento del envio del dinero entre los 8 accionsita de la loteria.
        1 de las 8 partes se destina al mantenimiento del proyecto en blockchain. 
        Y las restante 7 se comercializan aqui.
        La mejor propuesta se queda con los dividendo y las ganancias.
        Si tiene una mejor propuesta que la vigente, podra obtener un ingreso pasivo diario.
      </p>
      <table width="300" cellSpacing="1" cellPadding="3" border="0" bgcolor="#1E679A"  align="center">
      <tbody>
        <td bgcolor="white">
        <font face="arial, verdana, helvetica" color="black">
        <p>SOLotery PDA Account: {data.AccountPk.toString()}</p>
        <p>Owner 1: {owner1}</p>
        <p>Owner 2: {owner1}</p>
        <p>Owner 3: {owner1}</p>
        <p>Owner 4: {owner1}</p>
        <p>Owner 5: {owner1}</p>
        <p>Owner 6: {owner1}</p>
        <p>Owner 7: {owner1}</p>
        </font>
        </td>
      </tbody>
      <button onClick={buyShare}> compra un cripto dividendo diario</button>
      </table>

    </div>

  </div></div>
  };
  return (
    <div className="App">
      <SOLotery />
    </div>
  );
}

export default App;