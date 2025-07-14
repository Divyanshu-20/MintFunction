import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import type { AppProps } from 'next/app';
import Mint from './mint';

const Home: NextPage = () => {
  return (
    <div>
      <Mint />
    </div>

  );
};

export default Home;
