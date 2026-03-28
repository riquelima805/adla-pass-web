
import { useMemo, useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';

import { usePrivy } from '@privy-io/react-auth';
import './App.css';

function generateNameHash(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString();
}

function App() {
  const { publicKey, connected, connecting, requestTransaction } = useWallet();
  const { login, authenticated, user } = usePrivy();

  const [step, setStep] = useState<number>(1);

  // formulários
  const [name, setName] = useState<string>('');
  const [birthYear, setBirthYear] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>('');

  const publicKeyPreview = useMemo(() => {
    try {
      if (!publicKey) return '';
      const asString = typeof publicKey === 'string' ? publicKey : JSON.stringify(publicKey);
      return asString.length > 10 ? `${asString.slice(0, 10)}...` : asString;
    } catch {
      return '';
    }
  }, [publicKey]);

  const handleClaim = async () => {
    if (!name.trim() || !birthYear.trim()) {
      alert('Preencha seu nome e ano de nascimento.');
      return;
    }

    setStep(5); 
    setIsProcessing(true);
    setTxId('');

    try {
      if (!connected || !publicKey) throw new WalletNotConnectedError();
      if (typeof publicKey !== 'string') {
        alert('Wallet publicKey in unexpected format.');
        setStep(4); 
        return;
      }

      const currentYear = '2026u16';
      const userBirthYear = `${birthYear}u16`;
      const nameHash = `${generateNameHash(name)}field`;

      const inputs = [userBirthYear, currentYear, nameHash];

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        'adla_zpass_rique.aleo',
        'mint_zpass',
        inputs,
        50_000,
        false
      );

      const transactionId = await requestTransaction(aleoTransaction);
      setTxId(transactionId);
    } catch (error) {
      console.error('Erro no Claim:', error);
      alert('Erro ao verificar a identidade ou transação rejeitada.');
      setStep(4); 
    } finally {
      setIsProcessing(false);
    }
  };

  
  const ProgressBar = ({ current }: { current: number }) => (
    <div className="progress-header">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(current / 5) * 100}%` }}></div>
      </div>
      <span className="progress-text">{current}/5</span>
    </div>
  );

  return (
    <div className="app-wrapper">
      <div className="mobile-container">
        
        {/* Introduçao */}
        {step === 1 && (
          <div className="screen-content step-1">
            <div className="intro-text">
              <h1 className="brand-title">ADLA<br />MUSIC<br />IDENTITY</h1>
              <p className="brand-subtitle">ZERO-KNOWLEDGE PASS</p>
            </div>
            <button className="neon-button mt-auto" onClick={() => setStep(2)}>
              START VERIFICATION
            </button>
          </div>
        )}

        {/* AUTENTICAÇaO */}
        {step === 2 && (
          <div className="screen-content">
            <ProgressBar current={1} />
            <div className="glass-card">
              <h2>AUTHENTICATE</h2>
              <p className="sub-text">Log in with your Email</p>
              
              {!authenticated ? (
                <button className="action-button login-btn" onClick={login}>
                  e.g., mail@example.com
                </button>
              ) : (
                <div className="success-block">
                  <img src="/check.png" alt="Verified" className="icon-img check-icon" />
                  <p className="user-email">{user?.email?.address}</p>
                  <span className="verified-badge">verified</span>
                </div>
              )}
            </div>
            <button 
              className="neon-button mt-auto" 
              disabled={!authenticated}
              onClick={() => setStep(3)}
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* Carteira */}
        {step === 3 && (
          <div className="screen-content">
            <ProgressBar current={2} />
            <div className="glass-card">
              <h2>LINK WALLET</h2>
              <p className="sub-text">Connect your Aleo Wallet</p>
              
              <div className="wallet-btn-wrapper">
                <WalletMultiButton />
              </div>

              {connected && (
                <div className="connected-status">
                  CONNECTED: {publicKeyPreview}
                </div>
              )}
              {connecting && <p className="sub-text">Connecting...</p>}
            </div>
            <button 
              className="neon-button mt-auto" 
              disabled={!connected}
              onClick={() => setStep(4)}
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* Campo de dados*/}
        {step === 4 && (
          <div className="screen-content">
            <ProgressBar current={3} />
            <div className="glass-card">
              <h2>YOUR DATA (ZK)</h2>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Birth Year"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                />
              </div>

              <div className="zk-disclaimer">
                <img src="/alert.png" alt="Secure" className="icon-img tiny-icon" />
                <p>Your data is encrypted and proven without revealing original content.</p>
              </div>
            </div>
            <button 
              className="neon-button mt-auto" 
              onClick={handleClaim}
            >
              GENERATE PROOF
            </button>
          </div>
        )}

        {/* Carregamento */}
        {step === 5 && (
          <div className="screen-content">
            <ProgressBar current={isProcessing ? 4 : 5} />
            
            {isProcessing ? (
              <div className="loading-state">
                <h2>CLAIM ZPASS</h2>
                <img src="/wave.png" alt="Processing" className="icon-img pulse-anim" />
                <p className="sub-text">Generating your proof and minting...</p>
              </div>
            ) : (
              <div className="success-state">
                <img src="/pass.png" alt="ADLA PASS" className="pass-card-img" />
                <h3 className="success-title">SUCCESS!</h3>
                <p className="tx-text">TxID: {txId}</p>
                <button 
                  className="neon-button mt-auto" 
                  onClick={() => window.location.reload()}
                >
                  DONE
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;