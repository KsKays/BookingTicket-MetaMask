"use client";
import React, { useState, useEffect } from "react"; // hooks useState, useEffect

import { initializeConnector } from "@web3-react/core";
import { metaMask } from "@web3-react/metamask"; // metaMask

const [metaMask, hooks] = (actions) => new MetaMask({ actions });
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;
const contractChain = 11155111; // Contract Chain

export default function Page() {
  const chainId = useChainId; // useChainId
  const accounts = useAccounts; // useAccounts
  const isActive = useIsActive; // useIsActive

  const provider = useProvider();
  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed connect eagerly to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain); // contractChain
  };

  const handleDisconnect = () => {
    metaMask.resetState();
    alert("Disconnect ?");
  };

  return (
    <div>
      <p>chainId: {chainId}</p> //
      <p>isActive: {isActive.toString()}</p>
      <p>accounts: {accounts ? contractChain : ""}</p> //
      {isActive ? (
        <input type="button" onClick={handleDisconnect} value={"Disconnect"} /> //
      ) : (
        <input type="button" onClick={handleConnect} value={"Connect"} /> //
      )}
    </div>
  );
}
