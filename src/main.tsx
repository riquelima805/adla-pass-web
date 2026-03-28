
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './App.css';

import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import {
  WalletAdapterNetwork,
  DecryptPermission,
} from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

import { PrivyProvider } from '@privy-io/react-auth';

function WalletSetup({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => {
    return [
      new LeoWalletAdapter({
        appName: 'ADLA Music',
        appId: 'adla-music',
        redirectUri: window.location.origin + window.location.pathname,
        returnUrl: window.location.origin + window.location.pathname,
      } as any),
    ];
  }, []);

  return (
    <PrivyProvider
      appId="cmn8tyuel04x40dl5sh227fnz"
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'dark',
          accentColor: '#1DB954',
        },
      }}
    >
      <WalletProvider
        wallets={wallets}
        decryptPermission={DecryptPermission.UponRequest}
        network={WalletAdapterNetwork.TestnetBeta}
        autoConnect={false}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </PrivyProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WalletSetup>
    <App />
  </WalletSetup>
);